var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');
var request = require('request');
var session = require('express-session');
var db = require('./db/controllers/users');
var dbHelpers = require('./db/controllers/helpers');
var dbConfig = require('./db/config/db');
var apiKeys = require('./config/API_Keys');
var axios = require('axios');
var worker = require('./worker');
var bcrypt = require('bcrypt');
var charitiesDB = require('./db/controllers/usersCharities');
var Transactions = require('./db/controllers/transactions');


var app = express();
var port = process.env.PORT || 8080;

var currentUser = undefined;
var userSession = {};

//accurate interval timer +- 1ms
function interval(duration, fn){
  this.baseline = undefined

  this.run = function(){
    if(this.baseline === undefined){
      this.baseline = new Date().getTime()
    }
    fn()
    var end = new Date().getTime()
    this.baseline += duration

    var nextTick = duration - (end - this.baseline)
    if(nextTick<0){
      nextTick = 0
    }
    (function(i){
        i.timer = setTimeout(function(){
        i.run(end)
      }, nextTick)
    }(this))
  }

  this.stop = function(){
   clearTimeout(this.timer)
  }
}
//interval function, runs every 15 minutes
var callWorker = new interval(900000, function(){
  worker.processDailyTransactions();
})
//calls interval function on worker file
callWorker.run()

app.use(parser.json(), function(req, res, next) {
  //allow cross origin requests from client, and Plaid API
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, session({
  secret: 'test',
  resave: true,
  saveUnintialized: true
}));

//remove client_id and secret from this file and save them in ENV for deployment
var client_id = '58224c96a753b9766d52bbd1';
var secret = '04137ebffb7d68729f7182dd0a9e71';

//create your new user with Plaid
var plaidClient = new plaid.Client(client_id, secret, plaid.environments.tartan);

//send a POST to Plaid's API to authenticate your user's credentials on
//user bank linking
app.post('/authenticate', function(req, res) {
  var public_token = req.body.public_token;
  var account_id = req.body.account_id;
  // Exchange a public_token for a Plaid access_token
  plaidClient.exchangeToken(public_token, account_id, function(err, exchangeTokenRes) {
    if (err != null) {
      res.json('error!');
    } else {
      var access_token = exchangeTokenRes.access_token;
      var stripe_token = exchangeTokenRes.stripe_bank_account_token;
      console.log('access token', access_token);
      console.log('stripe token', stripe_token);
      //save access tokens to the local db
      db.updateUser(userSession.email, { plaid_access_token: access_token,
      stripe_bank_account_token: stripe_token },
      function(result) {
        console.log('result ', result);
      })
    }
  });
});

//sends POST to Plaid and returns transaction data
app.post('/transactions', function(req, res) {
  axios.post('https://tartan.plaid.com/connect/get', {
    'client_id': '58224c96a753b9766d52bbd1',
    'secret': '04137ebffb7d68729f7182dd0a9e71',
    'access_token': req.body.access_token
  }).then(resp => res.send(resp.data))
    .catch(err => console.log('error pinging plaid', err));
});

//signup new users to our local db
app.post('/signup', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  db.createUser(email, password, firstName, lastName)
    .then(function() {
      axios.post('http://localhost:8080/login', {
        email: email,
        password: password
      })
      .then(function() {
        res.status(200).send('Success!');
      })
      .catch(function(err) {
        console.log(err);
      });
    });
});

//login users
app.post('/login', function(req, res) {
  console.log('req', req.body);
  var email = req.body.email;
  var password = req.body.password;
  db.loginUser(email, password, function(response) {
    console.log('Login User Response ', response);
    //if response is true continue with login
    if(response) {
      //update currentUser
      bcrypt.hash(email, 10, function(error, hash) {
        currentUser = hash;
      })
      req.session.email = req.body.email
      //gets user info to send back to client for dynamic loading such as "Hello, X!"
      db.getUserFields(email, function(err, data) {
        if(err) {
          //if error send error to client
          res.send('Error in User Login');
        } else {
          console.log('this is also running');
          req.session.regenerate(function(err) {
            // will have a new session here
            req.session.email = email;
            req.session.firstName = data[0].first_name;
            req.session.lastName = data[0].last_name;
            userSession = {
              email: email,
              firstName: data[0].first_name,
              lastName: data[0].last_name
            };
            console.log('LOOOOOOOOGGGGGGIIIIIIIINNNNNNNNNN', userSession);
          });
          //send response to client with first_name, last_name, and email
          res.send({"first_name": data[0].first_name, "last_name": data[0].last_name,
          "email": data[0].email, currentUser: currentUser});
        }
      })
    };
  })
});


app.get('/userSession', function(req, res) {
  req.session.reload(function(err) {
    res.send(JSON.stringify(userSession));
    // session updated
  })
});



//replace session email and currentUser with undefined
app.get('/logout', function(req, res) {
  currentUser = undefined;
  userSession = {};
  req.session.destroy(function(err) {
    // cannot access session here
    if (err) {
      console.log(err);
    }
    res.send('sucess');
  });
  //call the function that destroys the user's token
});

//Sample request body (body can take category, searchTerm, category, city, state, zipCode)
// {
//   "category": "A",
//   "city": "Santa Rosa",
//   "state": "CA"
// }
app.post('/charitySearch', function(req, res) {
  console.log('search terms', req.body);
  var options = {
    method: 'post',
    body: req.body,
    json: true,
    url: 'http://data.orghunter.com/v1/charitysearch?user_key=' + apiKeys.orgHunter
  };
  console.log('search req', req.body.searchTerm);
  request(options, function (err, result, body) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(JSON.stringify(body.data));
    }
  });
});

app.post('/userCharities', function(req, res) {
  console.log(req.body.email);
  dbHelpers.getIDs(req.body.email, '', function(idObj) {
    var id_users = idObj.id_users;
    console.log('SELECT * FROM (SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\') AS uc \
      INNER JOIN charities ON charities.id = uc.id_charities;');
    var queryString = 'SELECT * FROM (SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\') AS uc \
      INNER JOIN charities ON charities.id = uc.id_charities;';
    dbConfig.query({
        text: queryString
      }, 
      function(err, results) {
        if (err) {
          res.send(err);
        } else if (results.rowCount > 0) {
          // console.log(results.rows);
          // var sendResults = results.rows.filter(function(item) {
          //   return (item.id_users === ''+id_users);
          // });
          res.send(results.rows);
        } else {
          res.send('NO RECORDS');
        }
      }
    );
  });
});

app.post('/charityInfo', function (req, res) {
  var options = {
    method: 'post',
    body: req.body,
    json: true,
    url: 'http://data.orghunter.com/v1/charitypremium?user_key=' + apiKeys.orgHunter + '&ein=' + req.body.charityId
  };
  request(options, function (err, result, body) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(JSON.stringify(body.data))
    }
  });
});

app.post('/userfield', function(req, res) {
  db.getUserFields(req.body.email, function(err, data) {
    if(err) {
      res.send(err)
    } else {
      res.send(data[0].plaid_access_token);
    }
  });
})

app.post('/addcharity', function(req, res) {
  var percentage = req.body.percentage || 1;
  charitiesDB.insert(req.body.email, req.body.charity, percentage, function(err, response) {
    if(err) {
      res.send(err);
    } else {
      res.send(200);
    }
  })
})

app.post('/api/user/info', function(req, res) {
  db.getUserFields(req.body.email, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
})

app.post('/api/user/transactions', function(req, res) {
  Transactions.getTransactions(req.body.email, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
})


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

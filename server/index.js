var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');
var request = require('request');
var session = require('express-session');
var db = require('./db/controllers/users');
var apiKeys = require('./config/API_Keys');
var axios = require('axios');

var app = express();
var port = process.env.PORT || 8080;

var currentUser = undefined;

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
  var institution_name = req.body.institution_name;
  // Exchange a public_token for a Plaid access_token
  plaidClient.exchangeToken(public_token, account_id, function(err, exchangeTokenRes) {
    if (err != null) {
      res.json('error!');
    } else {
      var access_token = exchangeTokenRes.access_token;
      var stripe_token = exchangeTokenRes.stripe_bank_account_token;
      //save access tokens to the local db
      axios.post('https://tartan.plaid.com/connect/get', {
        client_id: '58224c96a753b9766d52bbd1',
        secret: '04137ebffb7d68729f7182dd0a9e71',
        access_token: access_token
      })
      .then(function(response) {
        db.updateUser(currentUser, { plaid_access_token: access_token,
          stripe_bank_account_token: stripe_token, plaid_account_id: account_id,
          bank_name: institution_name, last_transaction_id: response.data.transactions[0]._id},
          function(result) {
          });
      })
      .catch(function(response) {
        console.log('error in /authenticate', response);
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
      currentUser = email;
      req.session.email = req.body.email
      //gets user info to send back to client for dynamic loading such as "Hello, X!"
      db.getUserFields(currentUser, function(err, data) {
        if(err) {
          //if error send error to client
          res.send('Error in User Login');
        } else {
          //send response to client with first_name, last_name, and email
          res.send({"first_name": data[0].first_name, "last_name": data[0].last_name, "email": data[0].email});
        }
      })
    };
    console.log('currentUser ', currentUser);
  })
});

//replace session email and currentUser with undefined
app.get('/logout', function(req, res) {
  req.session.email = undefined;
  currentUser = undefined;
  //call the function that destroys the user's token
});

//Sample request body (body can take category, searchTerm, category, city, state, zipCode)
// {
//   "category": "A",
//   "city": "Santa Rosa",
//   "state": "CA"
// }
app.post('/charitySearch', function(req, res) {
  console.log('req.body', req.body);
  var options = {
    method: 'post',
    body: req.body,
    json: true,
    url: 'http://data.orghunter.com/v1/charitysearch?user_key=' + apiKeys.orgHunter
  };
  request(options, function (err, result, body) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(JSON.stringify(body.data));
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


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

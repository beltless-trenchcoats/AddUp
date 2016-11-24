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
var Transactions = require('./db/controllers/transactions');
var userCharitiesDB = require('./db/controllers/usersCharities');
var charitiesDB = require('./db/controllers/charities');
var helperFunctions = require('./helpers');
var aws = require('aws-sdk');
var S3_BUCKET = process.env.S3_BUCKET || 'addupp-profile-photos';
// var stripe = require("stripe")(
//   "sk_test_eKJNtjs3Il6V1QZvyKs1dS6y"
// );

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
app.post('/api/plaid/authenticate', function(req, res) {
  var public_token = req.body.public_token;
  var account_id = req.body.account_id;
  var bank_name = req.body.institution_name;
  var bank_digits = '';

  // Exchange a public_token for a Plaid access_token to get users past transactions
  plaidClient.exchangeToken(public_token, account_id, function(err, exchangeTokenRes) {
    if (err != null) {
      res.json('error!');
    } else {
      var access_token = exchangeTokenRes.access_token;

      axios.post('http://localhost:8080/api/plaid/transactions', {
        access_token: access_token
      })
      .then(resp => {
        var accounts = resp.data.accounts;
        var transactions = resp.data.transactions;
        //Get user's last four digits of bank account number
        var index = 0;
        while (bank_digits === '') {
          if (accounts[index]._id === account_id) {
            bank_digits = accounts[index].meta.number;
          }
          index++;
        }
        //Get most recent transaction (to keep track of which transactions not to round up)
        index = 0;
        var mostRecentTransaction = '';
        while (mostRecentTransaction === '') {
          if (transactions[index]._account === account_id) {
            mostRecentTransaction = transactions[index]._id;
          }
          index++;
        }
        db.updateUser(userSession.email, {
          plaid_account_id: account_id,
          plaid_access_token: access_token,
          plaid_public_token: public_token,
          bank_name: bank_name,
          bank_digits: bank_digits
        },
          function(result) {
            //Send back the bank digits to PlaidLink.js to display on the UserProfile page
            res.status(201).send(bank_digits);
          })
      })
      .catch(err => console.log('error authenicating bank ', err));
    }
  });
});

//sends POST to Plaid and returns transaction data
app.post('/api/plaid/transactions', function(req, res) {
  axios.post('https://tartan.plaid.com/connect/get', {
    'client_id': '58224c96a753b9766d52bbd1',
    'secret': '04137ebffb7d68729f7182dd0a9e71',
    'access_token': req.body.access_token
  }).then(resp => {
    res.send(resp.data)
  })
    .catch(err => console.log('error pinging plaid', err));
});

// THIS IS FOR LETTINGS USERS WHO CREATED A CUSTOM CAUSE SET UP A STRIPE ACCOUNT. UNCOMMENT WHEN STRIPE EMAILS ME BACK
// app.post("/oauth/callback", function(req, res) {

//   var code = req.body.code;

//   // Make /oauth/token endpoint POST request
//   request.post({
//     url: 'https://connect.stripe.com/oauth/token',
//     form: {
//       grant_type: "authorization_code",
//       client_id: 'ca_9bfGnqU5JGVlcbNEJfmcmCCDAewlhQP7',
//       code: code,
//       client_secret: 'sk_test_eKJNtjs3Il6V1QZvyKs1dS6y'
//     }
//   }, function(err, r, body) {
//     if (err) {
//       console.log(err);
//     }
//     console.log('STRIPE BODY', body);
//     var accessToken = JSON.parse(body).access_token;
//     var stripeUserID = JSON.parse(body).stripe_user_id;

//     // var stripe = require("stripe")(
//     //   "sk_test_eKJNtjs3Il6V1QZvyKs1dS6y"
//     // );

//     // stripe.tokens.create({
//     //   card: {
//     //     "number": '4242424242424242',
//     //     "exp_month": 12,
//     //     "exp_year": 2017,
//     //     "cvc": '123'
//     //   }
//     // }, function(err, token) {
//     //   // asynchronously called
//     // });

//     // Do something with your accessToken
//     stripe.charges.create({
//       amount: .01,
//       currency: "usd",
//       source: accessToken, // obtained with Stripe.js
//       description: "TEST CHARGE"
//     }, {
//       stripe_account: stripeUserID
//     }, function(err, charge) {
//       // asynchronously called
//       if (err) {
//         console.log(err);
//       }
//       console.log('IT CHARGED', charge);
//     });

//     // For demo"s sake, output in response:
//     res.send({ "Your Token": accessToken });

//   });
// });

//signup new users to our local db
app.post('/api/session/signup', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  db.createUser(email, password, firstName, lastName)
    .then(function(success) {
      if (success) {
        axios.post('http://localhost:8080/api/session/login', {
          email: email,
          password: password
        })
        .then(function(resp) {
          res.status(201).send(resp.data);
        })
        .catch(function(err) {
          console.log(err);
        });
      } else {
        res.send();
      }
    });
});

//login users
app.post('/api/session/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db.loginUser(email, password, function(response) {
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
          });
          //send response to client with first_name, last_name, and email
          res.send({"first_name": data[0].first_name, "last_name": data[0].last_name,
          "email": data[0].email, currentUser: currentUser});
        }
      })
    } else { // No user exists
      res.send();
    }
  })
});


app.get('/api/session', function(req, res) {
  req.session.reload(function(err) {
    res.send(JSON.stringify(userSession));
    // session updated
  })
});



//replace session email and currentUser with undefined
app.get('/api/session/logout', function(req, res) {
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
app.post('/api/charities/search', function(req, res) {
  if (req.body.type === 'Custom Cause') {
    var keyWordMap = {
      searchTerm: 'name',
      category: 'category',
      city: 'city',
      state: 'state',
      zipCode: 'zip',
      id_owner: 'id_owner',
      private: 'private'
    };
    var searchBody = {};
    for (var key in keyWordMap) {
      if (req.body[key]) {
        searchBody[keyWordMap[key]] = req.body[key];
      }
    }
    charitiesDB.searchCustomCauses(searchBody, function(err, results) {
      if (err) {
        console.log(err);
        res.send(err);
      } else if (!results) {
        res.send();
      } else {
        results.forEach(function(item) {
          item.charityName = item.name;
          delete item.name;
          item.zipCode = item.zip;
          delete item.zip;
          item.missionStatement = item.mission_statement;
          delete item.mission_statement;
          item.category = helperFunctions.convertCategoryToString(item.category);
        });
        res.send(results);
      };
    });
  } else {
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
  }
});

app.get('/api/transactions/all', function(req, res) {
  dbConfig.query('SELECT * FROM transactions;', function(err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send(results.rows);
    }
  });
});

//charityId in request is EIN
app.post('/api/charity', function (req, res) {
  if (req.body.type === 'charity') {
    var options = {
      method: 'post',
      body: {charityId: req.body.charityId},
      json: true,
      url: 'http://data.orghunter.com/v1/charitypremium?user_key=' + apiKeys.orgHunter + '&ein=' + req.body.charityId
    };
    request(options, function (err, result, body) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        charitiesDB.getCharityFields({ein: req.body.charityId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            var toSend = body.data;
            toSend.total_donated = result[0] ? result[0].total_donated : 0;
            res.send(JSON.stringify(toSend));
          }
        });
      }
    });
  } else {
    charitiesDB.getCharityFields({id: req.body.charityId}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        var toSend = result[0];
        toSend.category = helperFunctions.convertCategoryToString(toSend.category);
        res.send(toSend);
      }
    });
  }
});

app.post('/api/charity/savedInfo', function (req, res) {
  charitiesDB.getCharityFields({ein: req.body.ein}, function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send(data[0])
    }
  })
})

app.post('/api/user/charities/update', function(req, res) {
  var userEmail = req.body.email;
  var promises = [];
  req.body.charities.forEach(function (charity) {
    // Remove any charities that the user has marked to remove
    if (charity.remove) {
      userCharitiesDB.remove(userEmail, charity.id, function (err, charityRemoved) {
        err ? console.log(err) : null;
      });
    } else { // Check if the current charity has already been saved to the database
      charitiesDB.getCharityFields({ein: charity.ein}, function (err, results) {
        // If it is not in db, add and also add entry to userscharities to link user to charity
        if (results.length === 0) {
          charitiesDB.createCharity(charity, function (err, charityAdded) {
            if (err) {
              console.log(err);
            } else {
              promises.push(userCharitiesDB.insert(userEmail, charityAdded[0].id, charity.percentage));
            }
          })
        } else { // If the charity is already in the db, check if the user is already linked to it
          var charityId = results[0].id;
          userCharitiesDB.getUserCharityFields(userEmail, charityId, function (err, results) {
            if (results === null) {
              // If the user is not linked to the charity, add entry to db
              promises.push(userCharitiesDB.insert(userEmail, charityId, charity.percentage));
            } else { //If they are already linked, just update the percentage
              promises.push(userCharitiesDB.updatePercentage(userEmail, charityId, charity.percentage));
            }
          });
        }
      });
    }
  });
  Promise.all(promises).then(() => res.sendStatus(200));
})

app.post('/api/user/info', function(req, res) {
  db.getUserFields(req.body.idOrEmail, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data[0]);
    }
  });
})

app.post('/api/user/transactions', function(req, res) {
  if (req.body.email) {
    Transactions.getTransactions(req.body.email, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  } else {
    res.send([]);
  }
})

app.post('/api/user/charities/info', function(req, res) {
  userCharitiesDB.getUsersCharityDonationsInfo(req.body.email, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  })
})

app.post('/api/user/update', function(req, res) {
  var email = req.body.email;
  var newEmail = req.body.newEmail;
  var newPassword = req.body.newPassword;
  var newPhotoUrl = req.body.photoUrl;
  var newLimit = req.body.limit;
  if(newEmail) {
    db.updateUser(email, {email: newEmail}, function(result) {
      res.send(result);
    })
  } else if (newPassword) {
    db.updateUser(email, {password: newPassword}, function(result) {
      res.send(result);
    })
  } else if (newPhotoUrl) {
    db.updateUser(email, {photo_url: newPhotoUrl}, function(result) {
      res.send(result);
    })
  } else {
    db.updateUser(email, {monthly_limit: newLimit}, function(result) {
      res.send(result);
    });
  }
})

// //NOTE: This should be refactored into the same route as the one above...Ill do that post-MVP (Karina)
// app.post('/api/user/update/limit', function(req, res) {
//   var email = req.body.email;
//   var newLimit = req.body.limit;
//   db.updateUser(email, {monthly_limit: newLimit}, function(result) {
//     res.send(result);
//   });
// })


app.post('/charityInfo', function (req, res) {
  if (req.body.type === 'charity') {
    var options = {
      method: 'post',
      body: {charityId: req.body.charityId},
      json: true,
      url: 'http://data.orghunter.com/v1/charitypremium?user_key=' + apiKeys.orgHunter + '&ein=' + req.body.charityId
    };
    request(options, function (err, result, body) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        charitiesDB.getCharityFields({ein: req.body.charityId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            var toSend = body.data;
            toSend.total_donated = result[0] ? result[0].total_donated : 0;
            res.send(JSON.stringify(toSend));
          }
        });
      }
    });   
  } else {
    if (req.body.charityId) { var filterFields = {id: req.body.charityId}; }
    else { var filterFields = null; }
    charitiesDB.getCharityFields(filterFields, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (!(req.body.charityId)) {
          res.send(result);
        } else {
          var toSend = result[0];
          toSend.category = helperFunctions.convertCategoryToString(toSend.category);
          console.log(toSend);
          res.send(toSend);
        }
      }
    });
  }
});


//===================CUSTOM CAUSES=====================
app.post('/api/customCause/add', function(req, res) {
  charitiesDB.createCharity(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(result);
    }
  })
});


app.post('/api/customCause/search', function(req, res) {
  charitiesDB.searchCustomCauses(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(result);
    }
  })
});

app.post('/api/customCause/transactions', function(req, res) {
  Transactions.getTransactionsForCharity(req.body.charityID, function(err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send(response);
    }
  });
});

app.post('/api/charity/update', function(req, res) {
  charitiesDB.updateCharity(req.body.charityID, req.body.updateFields, function(result) {
    res.send(result);
  });
});


app.get('/sign-s3', (req, res) => {
  console.log('S3REQUEST!!!',req.query)
  var s3 = new aws.S3({
    accessKeyId: apiKeys.AWSAccessKeyId,
    secretAccessKey: apiKeys.AWSSecretKey});
  var fileName = req.query['file-name']
  var fileType = req.query['file-type']
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    var returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    console.log('RETURN DATA', returnData)
    res.write(JSON.stringify(returnData));
    res.end();
  });
});


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');
var session = require('express-session');
var db = require('./db/controllers/users');

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

//remove cliend_id and secret from this file and save them in EVN for deployment
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
      db.updateUser(currentUser, { plaid_access_token: access_token,
      stripe_bank_account_token: stripe_token },
      function(result) {
        console.log('result ', result);
      })
    }
  });
});

//sends POST to Plaid and returns transaction data
app.post('/connect/get', function(req, res) {
  var data = {
    client_id: '58224c96a753b9766d52bbd1',
    secret: '04137ebffb7d68729f7182dd0a9e71',
    access_token: req.body.access_token
  }
  res.send(data);
});

//signup new users to our local db
app.post('/signup', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  //create new user in local db
  db.createUser(email, password, firstName, lastName, function(response) {
    //response is true or false
    console.log('Create User Response ', response);
    if(response) {
      res.send('Successful Signup');
    } else {
      res.send('Failed Signup');
    }
  })
});

//login users
app.post('/login', function(req, res) {
  console.log('req', req.body);
  req.session.email = req.body.email
  var email = req.body.email;
  var password = req.body.password;
  db.loginUser(email, password, function(response) {
    console.log('Login User Response ', response);
    //if response is true continue with login
    if(response) {
      //update currentUser
      currentUser = email;
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


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

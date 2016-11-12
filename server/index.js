var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');
var session = require('express-session');
var db = require('./db/controllers/users');

var app = express();
var port = process.env.PORT || 8080;

var currentUser = undefined;

app.use(parser.json(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, session({
  secret: 'test',
  resave: true,
  saveUnintialized: true
}));

var client_id = '58224c96a753b9766d52bbd1';
var secret = '04137ebffb7d68729f7182dd0a9e71';

var plaidClient = new plaid.Client(client_id, secret, plaid.environments.tartan);

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
      //save access tokens to the db
      db.updateUser(currentUser, { plaid_access_token: access_token,
      stripe_bank_account_token: stripe_token },
      function(result) {
        console.log('result ',result);
      })
    }
  });
});

//this post needs to go to https://tartan.plaid.com/ and returns transaction data
app.post('/connect/get', function(req, res) {
  var data = {
    client_id: '58224c96a753b9766d52bbd1',
    secret: '04137ebffb7d68729f7182dd0a9e71',
    access_token: ''
  }
  res.send(data);
});


app.post('/signup', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  db.createUser(email, password, firstName, lastName, function(response) {
    console.log('Create User Response ', response);
  })
});


app.post('/login', function(req, res) {
  console.log('req', req.body);
  req.session.email = req.body.email
  var email = req.body.email;
  var password = req.body.password;
  db.loginUser(email, password, function(response) {
    console.log('Login User Response ', response);
    if(response) {
      currentUser = email;
      db.getUserFields(currentUser, function(err, data) {
        if(err) {
          throw err;
        } else {
          res.send({"first_name": data[0].first_name, "last_name": data[0].last_name, "email": data[0].email});
        }
      })
    };
    console.log('currentUser ', currentUser);
  })
});


app.get('/logout', function(req, res) {
  req.session.email = undefined;
  //call the function that destroys the user's token
});


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

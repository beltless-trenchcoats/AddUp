var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');

var app = express();
var port = process.env.PORT || 8080;

app.use(parser.json(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var client_id = '58224c96a753b9766d52bbd1';
var secret = '04137ebffb7d68729f7182dd0a9e71';

var plaidClient = new plaid.Client(client_id, secret, plaid.environments.tartan);

app.post('/authenticate', function(req, res) {
  var public_token = req.body.public_token;
  var account_id = req.body.account_id;
  // console.log('public_token in express ', public_token);
  // Exchange a public_token for a Plaid access_token
  plaidClient.exchangeToken(public_token, account_id, function(err, exchangeTokenRes) {
    if (err != null) {
      res.json('error!');
    } else {
      var access_token = exchangeTokenRes.access_token;
      var stripe_token = exchangeTokenRes.stripe_bank_account_token;
      console.log('access token', access_token);
      console.log('stripe token', stripe_token);

      //TODO: Save these tokens to the database

      plaidClient.getAuthUser(access_token, function(err, authRes) {
        if (err != null) {
          res.json('error!');
        } else {
          // An array of accounts for this user, containing account
          // names, balances, and account and routing numbers.
          var accounts = authRes.accounts;

          res.json({accounts: accounts});
        }
      });
    }
  });
});


//this is skeleton code until we get a front-end accessible for Plaid Link
//this post needs to go to https://tartan.plaid.com/ and returns transaction data
app.post('/connect/get', function(req, res) {
  var data = {
    client_id: '58224c96a753b9766d52bbd1',
    secret: '04137ebffb7d68729f7182dd0a9e71',
    access_token: ''
  }
  res.send(data);
});


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

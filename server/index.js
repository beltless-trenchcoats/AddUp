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

var plaidClient = new plaid.Client('58224c96a753b9766d52bbd1', '04137ebffb7d68729f7182dd0a9e71', plaid.environments.tartan);

app.post('/authenticate', function(req, res) {
  var public_token = req.body.public_token;
  console.log('public_token in express ', public_token);
  // Exchange a public_token for a Plaid access_token
  plaidClient.exchangeToken(public_token, function(err, exchangeTokenRes) {
    if (err != null) {
      // Handle error!
      res.json('error!');
    } else {
      // This is your Plaid access token - store somewhere persistent
      // The access_token can be used to make Plaid API calls to
      // retrieve accounts and transactions
      var access_token = exchangeTokenRes.access_token;

      plaidClient.getAuthUser(access_token, function(err, authRes) {
        if (err != null) {
          // Handle error!
          res.json('error!');
        } else {
          // An array of accounts for this user, containing account
          // names, balances, and account and routing numbers.
          var accounts = authRes.accounts;

          // Return account data
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
    client_id: '',
    secret: '',
    access_token: ''
  }
  res.send(data);
});


app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');

var app = express();

app.get('/accounts', function(req, res, next) {
  var public_token = req.query.public_token;

  plaidClient.exchangeToken(public_token, function(err, tokenResponse) {
    if (err != null) {
      res.json({error: 'Unable to exchange public_token'});
    } else {
      var access_token = tokenResponse.access_token;
      //save access_token with user account in the db
    }
  });
});

var express = require('express');
var parser = require('body-parser');
var plaid = require('plaid');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

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

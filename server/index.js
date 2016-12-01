var express = require('express');
var parser = require('body-parser');
var path = require('path');

var userHandler = require('./requestHandlers/userRequestHandler');
var charityHandler = require('./requestHandlers/charityRequestHandler');
var transactionRequestHandler = require('./requestHandlers/transactionRequestHandler');
var authRequestHandler = require('./requestHandlers/authRequestHandler');

//COMMENT THESE IN FOR DEV MODE
var env = require('node-env-file');
env(__dirname + '/config/.env');

var app = express();
var port = process.env.PORT || 8080;

app.use(parser.json(), function(req, res, next) {
  //allow cross origin requests from client, and Plaid API
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use('/', express.static(__dirname + '/../client/build'));

app.get('/charity/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/custom/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/search*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/user', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/contact', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/profile/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});
app.get('/myCause/edit/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

//===================USER AUTH=====================
app.post('/api/session/signup', authRequestHandler.signupUser);
app.post('/api/session/login', authRequestHandler.loginUser);


//===================PLAID AUTH=====================
app.post('/api/plaid/authenticate', authRequestHandler.plaidAuth);
app.post('/api/plaid/transactions', authRequestHandler.getUserPlaidTransactions);
app.post('/api/plaid/delete', authRequestHandler.plaidDelete);


//===================USER TRANSACTIONS=====================
app.get('/api/transactions/all', transactionRequestHandler.getAllTransactions);


//===================USER ACCOUNT=====================
app.post('/api/user/charities/update', userHandler.updateUserCharities);
app.post('/api/user/info', userHandler.getUserInfo);
app.post('/api/user/transactions', userHandler.getUserTransactions);
app.post('/api/user/charities/info', userHandler.getUserCharityDonations);
app.post('/api/user/update', userHandler.updateUserInfo);
app.get('/sign-s3', userHandler.getS3Url);


//===================EXISTING CHARITIES=====================
app.post('/api/charity',charityHandler.getCharityInfo);
app.post('/api/charity/savedInfo', charityHandler.getCharityInfoFromDB);
app.post('/api/charities/search', charityHandler.charitySearch);


//===================CUSTOM CAUSES=====================
app.post('/api/customCause/add', charityHandler.addCustomCause);
app.post('/api/customCause/search', charityHandler.searchCustomCause);
app.post('/api/customCause/transactions', charityHandler.getCustomCauseTransactions);
app.post('/api/charity/update', charityHandler.updateCustomCause);



app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/build/404.html'));
});

app.listen(port, function() {
  console.log('listening on ', port);
});

module.exports = app;

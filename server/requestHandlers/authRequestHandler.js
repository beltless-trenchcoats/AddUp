var Users = require('../db/controllers/users');

var axios = require('axios');
var bcrypt = require('bcrypt');
var server = require('../config/config');

//COMMENT THESE IN FOR DEV MODE
var env = require('node-env-file');
env(__dirname + '/../config/.env');

var plaid = require('plaid');
//get Plaid transactions for signed up user
var client_id = process.env.PLAID_CLIENT_ID;
var secret = process.env.PLAID_SECRET;
//create your new user with Plaid
var plaidClient = new plaid.Client(client_id, secret, plaid.environments.tartan);

//signup new users to our local db
exports.signupUser = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  Users.createUser(email, password, firstName, lastName)
    .then(function(success) {
      if (success) {
        axios.post(server + '/api/session/login', {
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
};

//login users
exports.loginUser = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  Users.loginUser(email, password, function(response) {
    //if response is true continue with login
    if(response) {
      //gets user info to send back to client for dynamic loading such as "Hello, X!"
      Users.getUserFields(email, function(err, data) {
        if(err) {
          //if error send error to client
          res.send('Error in User Login');
        } else {
          //send response to client with first_name, last_name, and email
          res.send({"first_name": data[0].first_name, "last_name": data[0].last_name,
          "email": data[0].email});
        }
      })
    } else { // No user exists
      res.send();
    }
  })
};

//===========PLAID AUTH AND TRANSACTIONS

//send a POST to Plaid's API to authenticate your user's credentials on
//user bank linking
exports.plaidAuth = function(req, res) {
  var public_token = req.body.public_token;
  var account_id = req.body.account_id;
  var bank_name = req.body.institution_name;
  var email = req.body.email;
  var bank_digits = '';

  // Exchange a public_token for a Plaid access_token to get users past transactions
  plaidClient.exchangeToken(public_token, account_id, function(err, exchangeTokenRes) {
    if (err != null) {
      res.json('error!');
    } else {
      var access_token = exchangeTokenRes.access_token;

      axios.post(server + '/api/plaid/transactions', {
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
        Users.updateUser(email, {
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
};

//sends POST to Plaid and returns transaction data
exports.getUserPlaidTransactions = function(req, res) {
  axios.post('https://tartan.plaid.com/connect/get', {
    'client_id': '58224c96a753b9766d52bbd1',
    'secret': '04137ebffb7d68729f7182dd0a9e71',
    'access_token': req.body.access_token
  }).then(resp => {
    res.send(resp.data)
  })
    .catch(err => console.log('error pinging plaid', err));
};

exports.plaidDelete = function(req, res) {
  Users.updateUser(req.body.email, {plaid_access_token: null, bank_name: null, bank_digits: null}, function(result) {
    res.send(result)
  });
};

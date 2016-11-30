var Users = require('./db/controllers/users');
var Transactions = require('./db/controllers/transactions');
var UsersCharities = require('./db/controllers/usersCharities');
var Charities = require('./db/controllers/charities');
var axios = require('axios');
var plaid = require('plaid');

var server = require('./config/config');

//comment these in for dev mode
// var env = require('node-env-file');
// env(__dirname + '/config/.env');

// Note: This should be the testing key unless we actually want to charge real money!
var test_key = 'sk_test_eKJNtjs3Il6V1QZvyKs1dS6y';
var stripe = require('stripe')(test_key);

var client_id = process.env.PLAID_CLIENT_ID;
var secret = process.env.PLAID_SECRET;

var plaidClient = new plaid.Client(client_id, secret, plaid.environments.tartan);

// This function will be called whenever we want to check if a user has made new transactions
var processDailyTransactions = function() {
  Users.getUserFields('', function(err, users) {
    users.forEach(user => {
      //If the user has linked a bank account through plaid
      if (user.plaid_access_token && user.plaid_public_token) { 
        axios.post(server + '/api/plaid/transactions', {
            'access_token': user.plaid_access_token
          })
          .then(resp => {
            var transactions = resp.data.transactions;
            var newTransactions = findRecentTransactions(user, transactions);
            //if there are new transactions, add up the round ups, charge the user, and distribute to charities
            if (newTransactions.length > 0) {
              var amtToCharge = newTransactions.reduce((totalAmt, trans) => totalAmt + roundUpTransaction(trans), 0);

              // Add any pending balances the user has
              amtToCharge += user.pending_balance;

              //if user's monthly limit would be exceeded by this amount, only charge amt up to monthly_limit
              var limitWouldExceed = false;
              if ((user.monthly_total + amtToCharge) > user.monthly_limit) {
                amtToCharge = user.monthly_limit - user.monthly_total;
                limitWouldExceed = true;
              }

              // If the amount < 0.50, we can't charge it yet, will save with other updates
              var amtToSave = 0;
              if (amtToCharge < 0.50) {
                amtToSave = amtToCharge;
                amtToCharge = 0;
              }

              charge(user, Math.floor(amtToCharge * 100) / 100);

              var newTotal = user.monthly_total + amtToCharge;

              if (limitWouldExceed) {
                Users.updateUser(user.email, {
                  last_transaction_id: newTransactions[0]._id,
                  monthly_total: newTotal,
                  pending_balance: 0
                }, () => {});
              } else { // Otherwise, save it back to db
                Users.updateUser(user.email, {
                  last_transaction_id: newTransactions[0]._id,
                  monthly_total: newTotal,
                  pending_balance: amtToSave
                }, () => {});
              }
            }
          })
          .catch(err => console.log('error pinging localhost:', err));
      }
    });
  });
};

// Return new transactions since last transaction checked
var findRecentTransactions = function(user, transactions) {
  //filter transactions for correct account and whether they are already an even dollar amount and positive
  var usersTransactions = transactions.filter(function(transaction) {
    return (transaction._account === user.plaid_account_id && 
            transaction.amount % 1 !== 0 &&
            transaction.amount > 0);
  });
  var mostRecentTransactionId = user.last_transaction_id;
  var newTransactions = [];
  var index = 0;
  var trans = usersTransactions[index];
  // Iterate through recent transactions until find the last transaction that was rounded
  while (trans && trans._id && trans._id !== mostRecentTransactionId) {
    newTransactions.push(trans);
    index++;
    trans = usersTransactions[index];
  }
  return newTransactions;
};

// Calculate rounded amount to charge
var roundUpTransaction = function(transaction) {
  return 1 - (transaction.amount % 1).toFixed(2);
};

var charge = function(user, amount) {
  plaidClient.exchangeToken(user.plaid_public_token, user.plaid_account_id, function(err, exchangeTokenRes) {
    var stripe_token = exchangeTokenRes.stripe_bank_account_token;
    var chargeAmount = amount * 100; // Note: The stripe charge takes an integer representing the number of cents (100 = $1.00)
    var charge = stripe.charges.create({
      amount: chargeAmount,
      currency: "usd",
      source: stripe_token
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        console.log('Card Declined');
      } else if (err) {
        console.log(err);
      }
      if (charge) { //if the charge goes through, distribute donations to charities
        var chargeAmount = charge.amount / 100; //Change the amount back to a normal $X.XX number
        distributeDonation(user, chargeAmount);
        return chargeAmount;
      }
    });
  });
};

//check if limit has been reached for custom charity
var distributeDonation = function(user, amount) {
  UsersCharities.getUserCharityFields(user.email, null, (err, charities) => {
    if (charities) {
      charities.forEach(userCharity => {
        var charity_id = userCharity.id_charities;
        var amountForCharity = (amount * userCharity.percentage).toFixed(2);
        Transactions.insert(user.id, charity_id, amountForCharity, () => {});
        Charities.updateBalance(charity_id, {total_donated: amountForCharity, balance_owed: amountForCharity}, () => {
          if (userCharity.type === 'custom' && userCharity.total_donated >= userCharity.dollar_goal) {
            UsersCharities.updatePercentage(user.email, userCharity.name, 0, function(response) {
            });
          };
        });
      });
    }
  });
}

module.exports = {
  processDailyTransactions: processDailyTransactions,
  findRecentTransactions: findRecentTransactions,
  roundUpTransaction: roundUpTransaction,
  charge: charge,
  distributeDonation: distributeDonation
};

// processDailyTransactions();

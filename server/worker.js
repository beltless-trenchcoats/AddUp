var Users = require('./db/controllers/users');
var Transactions = require('./db/controllers/transactions');
var UsersCharities = require('./db/controllers/usersCharities');
var Charities = require('./db/controllers/charities');
var axios = require('axios');

// Note: This should be the testing key unless we actually want to charge real money!
var test_key = 'sk_test_eKJNtjs3Il6V1QZvyKs1dS6y';
var stripe = require('stripe')(test_key);
// This function will be called whenever we want to check if a user has made new transactions
var processDailyTransactions = function() {
  Users.getUserFields('', function(err, users) {
    users.forEach(user => {
      if (user.plaid_access_token) { //If the user has linked a bank account through plaid
        axios.post('http://localhost:8080/transactions', {
            'access_token': user.plaid_access_token
          })
          .then(resp => {
            var transactions = resp.data.transactions;
            var newTransactions = findRecentTransactions(user, transactions);
            newTransactions.forEach(transaction => {
              var amtToCharge = roundUpTransaction(user, transaction);
              if (amtToCharge) {
                charge(user, amtToCharge);
              }
            });
          })
          .catch(err => console.log('error pinging localhost:', err));
      }
    });
  });
};

// Return new transactions since last transaction checked
var findRecentTransactions = function(user, transactions) {
  var usersTransactions = transactions.filter(function(transaction) {
    return transaction._account === user.plaid_account_id;
  });
  var mostRecentTransactionId = user.last_transaction_id;
  var newTransactions = [];
  var index = 0;
  var trans = usersTransactions[index];
  while (trans && trans._id && trans._id !== mostRecentTransactionId) {
    newTransactions.push(trans);
    index++;
    trans = usersTransactions[index];
  }
  return newTransactions;
};

// Calculate rounded amount to charge
var roundUpTransaction = function(user, transaction) {
  var transAmt = transaction.amount;
  // If the user is already over their limit or the transaction is 0 or a refund, exit
  if (user.monthly_total >= user.monthly_limit || transAmt <= 0) {
    return 0;
  }
  // Calculate round-up amount
  var roundUpAmt = 1 - (transAmt % 1).toFixed(2);

  //if user's monthly limit would be exceeded by this roundUpAmt, only charge amt up to monthly_limit
  roundUpAmt = (user.monthly_total + roundUpAmt) > user.monthly_limit ? user.monthly_limit - user.monthly_total : roundUpAmt;

  // If the amount < 0.50, we can't charge it yet...
  if (roundUpAmt < 0.50) {
    // Check what pending balance the user has and add roundUpAmt to this
    var updatedPendingBalance = roundUpAmt + user.pending_balance;

    // If the amount is still too small to charge, save to db and exit function
    if (updatedPendingBalance < 0.50) {
      Users.updateUser(user.email, {pending_balance: updatedPendingBalance}, () => {});
      return 0;
    } else { // Else, zero out the user's pending balance and return new amount to charge
      Users.updateUser(user.email, {pending_balance: 0}, () => {});
      return updatedPendingBalance;
    }
  }
  return roundUpAmt;
};

var charge = function(user, amount) {
  var stripe_token = user.stripe_bank_account_token;
  var chargeAmount = amount * 100; // Note: The stripe charge takes an integer representing the number of cents (100 = $1.00)
  var charge = stripe.charges.create({
    amount: chargeAmount,
    currency: "usd",
    source: stripe_token
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      console.log('Card Declined');
    }
    // console.log('CHARGE', charge);
    if (charge) { //if the charge goes through
      var chargeAmount = charge.amount / 100; //Change the amount back to a normal $X.XX number
      distributeDonation(user, chargeAmount);
    }
  });
};

//check if limit has been reached for custom charity
var distributeDonation = function(user, amount) {
  UsersCharities.getUserCharityFields(user.email, '', (err, charities) => {
    charities.forEach(userCharity => {
      var charity_id = userCharity.id_charities;
      var amountForCharity = (amount * userCharity.percentage).toFixed(2);
      Transactions.insert(user.id, charity_id, amountForCharity, () => {});
      Charities.updateBalance(charity_id, {total_donated: amountForCharity, balance_owed: amountForCharity}, () => {
        if (userCharity.type === 'custom' && userCharity.total_donated >= userCharity.dollar_goal) {
          UsersCharities.updatePercentage(user.email, userCharity.name, 0, function(response) {
            console.log(response);
          });
        };     
      });
    });
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

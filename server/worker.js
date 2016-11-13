var Users = require('./db/controllers/users');
var Transactions = require('./db/controllers/transactions');
var UsersCharities = require('./db/controllers/usersCharities');
var Charities = require('./db/controllers/charities');
var axios = require('axios');

// Note: This should be the testing key unless we actually want to charge real money!
var test_key = 'sk_test_eKJNtjs3Il6V1QZvyKs1dS6y';
var stripe = require('stripe')(test_key);

var roundDailyTransactions = function() {
  Users.getUserFields('', function(err, users) {
    users.forEach(user => {
      //If the user has linked a bank account through plaid
      if (user.plaid_access_token) { 
        axios.post('http://localhost:8080/transactions', {
            'access_token': user.plaid_access_token
          })
          .then(transactions => {
            findRecentTransactions().forEach(transaction => {
              var amtToCharge = roundUpTransaction(user, transaction);
              if (amtToCharge) {
                charge(user, amount);
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
  var mostRecentTransactionId = user.last_transaction_id;
  var newTransactions = [];
  var index = 0;
  var trans = transactions[index];
  while (trans._id && trans._id !== mostRecentTransactionId) {
    newTransactions.push(trans);
    index++;
    trans = transactions[index];
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
      Users.updateUser(user.email, {pending_balance: updatedPendingBalance}, result => console.log(result));
      return 0;
    } else { // Else, zero out the user's pending balance and return new amount to charge
      Users.updateUser(user.email, {pending_balance: 0}, result => console.log(result));
      return updatedPendingBalance;
    }
  }
  return roundUpAmt;
};

var charge = function(user, amount) {
  var stripe_token = user.stripe_bank_account_token;
  // Note: The stripe charge takes an integer representing the number of cents (100 = $1.00)
  var chargeAmount = amount * 100;
  var charge = stripe.charges.create({
    amount: chargeAmount,
    currency: "usd",
    source: stripe_token
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      console.log('Card Declined');
    }
    console.log('CHARGE', charge);
    var chargeAmount = charge.amount / 100;
    // Determine how much to send to each charity the user has chosen
    distributeDonation(user, chargeAmount);
  });
};

var distributeDonation = function(user, amount) {
  var charities = UsersCharities.getUserCharityFields(user.email, (err, charities) => {
    charities.forEach(charity => {
      var amountForCharity = amount * charity.percentage;
      // Save amount, charity id , user id to db
      Transactions.insert(user._id, charity._id, amountForCharity, result => console.log(result));
      // Save that amount to a charity in the db
      Charities.updateBalance(charity_id, {total_donated: amountForCharity, balance_owed: amountForCharity}, 
        result => console.log(result));
    });
  });
}

module.exports = {
  roundDailyTransactions: roundDailyTransactions,
  findRecentTransactions: findRecentTransactions,
  roundUpTransaction: roundUpTransaction,
  charge: charge,
  distributeDonation: distributeDonation
};

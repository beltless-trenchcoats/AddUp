var db = require('./db/controllers/users');

exports.roundDailyTransactions = function() {
  // Get all users
  db.getUserFields('', function(err, results) {
    var users = results.rows;
    users.forEach(user => {

      //TODO: GET USER'S RECENT TRANSACTIONS
      var transactions = [];

      transactions.forEach(transaction => {
        var amtToCharge = roundTransaction(user, transaction);
        if (amtToCharge) {
          charge(user, amount);
        }
        //TODO: Save amount, charity, username to database (transactions)
      });

    });
  });
}


// Calculate rounded amount to charge
var roundTransaction = function(user, transaction) {
  var transAmt = transaction.amount;
  var roundUpAmt = transAmt % 1;
  
  //if user's monthly limit would be exceeded by this roundUpAmt, only charge amt up to monthly_limit
  var hypotheticalSum = user.monthly_total + roundUpAmt;
  if (hypotheticalSum > user.monthly_limit) {
    roundUpAmt = user.monthly_limit - user.monthly_total;
  }

  // If the amount < 0.50, we can't charge it yet...
  if (roundUpAmt < 0.50) { 
    // Check what pending balance the user has and add roundUpAmt to this
    var updatedPendingBalance = roundUpAmt + users.pending_balance;

    // If the amount is still too small to charge, save to db and exit function
    if (updatedPendingBalance < 0.50) { 
      db.updateUser(user.username, {pending_balance: updatedPendingBalance}, result => console.log(result););
      return 0;
    } else { // Else, zero out the user's pending balance and return new amount to charge
      db.updateUser(user.username, {pending_balance: 0}, result => console.log(result););
      return updatedPendingBalance;
    }
  }

  return roundUpAmt;
};

var charge = function(user, amount) {
  var stripe_token = user.stripe_bank_account_token;
  // Note: This should be the testing key unless we actually want to charge real money!
  var stripe = require('stripe')('sk_test_eKJNtjs3Il6V1QZvyKs1dS6y');
  // Note: The stripe charge takes an integer representing the number of cents (100 = $1.00)
  var chargeAmount = amount * 100;
  var charge = stripe.charges.create({
    amount: chargeAmount,
    currency: "usd",
    source: stripe_token
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      console.log('Card Declined')
    });
};





var expect = require('chai').expect;

var helpers = require('../server/helpers');

describe('Helper functions', function() {

  // An example user based on db schema
  var user = {
    username: 'Helga',
    password: 'Jo',
    plaid_access_token: '',
    stripe_bank_account_token: '',
    pending_balance: 0.3,
    monthly_total: 22.62,
    monthly_limit: 25,
    last_transaction_id: ''
  };

  // A snippet of what an actual transaction result looks like
  var transaction = {
    amount: 3.19,
    date: "2014-06-21",
    name: "Gregorys Coffee"
  };

  it('should return rounded-up amount for an amount > 0.50', function() {
    // expect(transaction.amount).to.equal(3.19);
    expect(helpers.roundUpTransaction(user, transaction)).to.equal(0.81);
  });
});
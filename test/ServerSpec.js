var expect = require('chai').expect;

var helpers = require('../server/helpers');

describe('Helper functions', function() {

  // An example user based on db schema
  var users = [
    {
      username: 'helga',
      plaid_access_token: '',
      stripe_bank_account_token: '',
      pending_balance: 0.3,
      monthly_total: 24.32,
      monthly_limit: 25,
      last_transaction_id: ''
    },
    {
      username: 'helga',
      plaid_access_token: '',
      stripe_bank_account_token: '',
      pending_balance: 0,
      monthly_total: 25,
      monthly_limit: 25,
      last_transaction_id: ''
    }
  ];

  // Snippets of what actual transaction results looks like
  var transactions = [
    {
      amount: 3.49,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      amount: 3.19,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      amount: 3.99,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    }
  ];

  it('should return rounded-up amount for an amount > 0.50', function(done) {
    expect(helpers.roundUpTransaction(users[0], transactions[0])).to.equal(0.51);
    done();
  });

  it('should only return an amount up to their monthly limit', function(done) {
    expect(helpers.roundUpTransaction(users[0], transactions[1])).to.equal(users[0].monthly_limit - users[0].monthly_total);
    done();
  });

  it('should return 0 if they are already over their monthly limit', function(done) {
    expect(helpers.roundUpTransaction(users[1], transactions[0])).to.equal(0);
    done();
  });

  it('should update a users pending balance if their aggregate balance is still < 0.50', function(done) {
    expect(helpers.roundUpTransaction(users[0], transactions[2])).to.equal(0);
    //giving time for the inner database call to go through 
    setTimeout(() => done(), 1000);
    // done();
  })
});
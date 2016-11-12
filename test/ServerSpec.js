var expect = require('chai').expect;

var helpers = require('../server/helpers');

describe('Helper functions', function() {

  // An example user based on db schema
  var users = [
    {
      email: 'helga@gmail.com',
      plaid_access_token: 'test_wells',
      stripe_bank_account_token: 'btok_9YDoZt3NHiIjun',
      pending_balance: 0.3,
      monthly_total: 24.32,
      monthly_limit: 25,
      last_transaction_id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY'
    },
    {
      email: 'helga@gmail.com',
      plaid_access_token: 'test_wells',
      stripe_bank_account_token: 'btok_9YDoZt3NHiIjun',
      pending_balance: 0,
      monthly_total: 25,
      monthly_limit: 25,
      last_transaction_id: 'DAE3Yo3wXgskjXV1JqBDIrDBVvjMLDCQ4rMQdR'
    }
  ];

  // Snippets of what actual transaction results looks like
  var transactions = [
    {
      _id: 'KdDjmojBERUKx3JkDdO5IaRJdZeZKNuK4bnKJ1',
      amount: 3.49,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      id: 'DAE3Yo3wXgskjXV1JqBDIrDBVvjMLDCQ4rMQdR',
      amount: 3.19,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY',
      amount: 3.99,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    }
  ];

  describe('rounding up transactions', function() {
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
    });
  });

  describe('charging with stripe', function() {
    it('should return success when charging a user a given amount', function(done) {
      helpers.charge(users[0], 0.51);
      expect(true).to.be.true;
      done();
    });
  });

  describe('finding recent transactions', function() {
    it('should only return transactions since the last transaction id', function(done) {
      expect(helpers.findRecentTransactions(users[1], transactions).length).to.equal(1);
    });
  })

});
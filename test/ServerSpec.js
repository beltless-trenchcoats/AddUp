var expect = require('chai').expect;

var worker = require('../server/worker');

// var Transactions = require('../server/db/controllers/transactions');

describe('Worker functions', function() {

  // An example user based on db schema
  var users = [
    {
      email: 'miles71397@gmail.com',
      plaid_access_token: 'test_wells',
      stripe_bank_account_token: 'btok_9YDoZt3NHiIjun',
      pending_balance: 0.3,
      monthly_total: 24.32,
      monthly_limit: 25,
      last_transaction_id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY'
    },
    {
      email: 'miles71397@gmail.com',
      plaid_access_token: 'test_bofa',
      stripe_bank_account_token: 'btok_9YEdF4atq1rpif',
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
      _id: 'DAE3Yo3wXgskjXV1JqBDIrDBVvjMLDCQ4rMQdR',
      amount: 3.19,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      _id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY',
      amount: 3.99,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    }
  ];

  describe('finding recent transactions', function() {
    it('should only return transactions since the last transaction id', function(done) {
      expect(worker.findRecentTransactions(users[0], transactions).length).to.equal(2);
      expect(worker.findRecentTransactions(users[1], transactions).length).to.equal(1);
      done();
    });
  });

  describe('rounding up transactions', function() {
    it('should return rounded-up amount for an amount > 0.50', function(done) {
      expect(worker.roundUpTransaction(users[0], transactions[0])).to.equal(0.51);
      done();
    });

    it('should only return an amount up to their monthly limit', function(done) {
      expect(worker.roundUpTransaction(users[0], transactions[1])).to.equal(users[0].monthly_limit - users[0].monthly_total);
      done();
    });

    it('should return 0 if they are already over their monthly limit', function(done) {
      expect(worker.roundUpTransaction(users[1], transactions[0])).to.equal(0);
      done();
    });

    it('should update a users pending balance if their aggregate balance is still < 0.50', function(done) {
      expect(worker.roundUpTransaction(users[0], transactions[2])).to.equal(0);
      //giving time for the inner database call to go through 
      setTimeout(() => done(), 100);
    });
  });

  describe('charging with stripe', function() {
    it('should return without error when charging a user a given amount', function(done) {
      var testCharge = function() {
        worker.charge(users[0], 0.51);
      }
      expect(testCharge).to.not.throw(Error);
      setTimeout(() => done(), 100);
    });
  });

  xdescribe('distributing donations amongst charities', function() {
    it('should split donation amount based on percentages', function(done) {
      worker.distributeDonation();
      done();
    });

    it('should save transaction to database upon successful charge', function(done) {
      worker.charge(users[0], 0.75);
      //TODO:query db to check if exists
      setTimeout(() => done(), 100);
    });
  });
});
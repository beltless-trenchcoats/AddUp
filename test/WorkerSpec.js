var expect = require('chai').expect;

var worker = require('../server/worker');

var Transactions = require('../server/db/controllers/transactions');
var Users = require('../server/db/controllers/users');
var Charities = require('../server/db/controllers/charities');
var UsersCharities = require('../server/db/controllers/usersCharities');
var db = require('../server/db/config/db');

var dbHelper = require('../server/db/controllers/helpers');


describe('Worker functions', function() {

  // An example user based on db schema
  var users = [
    {
      id: 1,
      // plaid_access_token: 'test_wells',
      // stripe_bank_account_token: 'btok_9YDoZt3NHiIjun',
      plaid_account_id: 'nban4wnPKEtnmEpaKzbYFYQvA7D7pnCaeDBMy',
      pending_balance: 0.3,
      monthly_total: 24.32,
      monthly_limit: 25,
      last_transaction_id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY'
    },
    {
      id: 2,
      // plaid_access_token: 'test_bofa',
      // stripe_bank_account_token: 'btok_9YEdF4atq1rpif',
      plaid_account_id: 'nban4wnPKEtnmEpaKzbYFYQvA7D7pnCaeDBMy',
      pending_balance: 0,
      monthly_total: 25,
      monthly_limit: 25,
      last_transaction_id: 'moPE4dE1yMHJX5pmRzwrcvpQqPdDnZHEKPREYL'
    }
  ];

  // Snippets of what actual transaction results looks like
  var transactions = [
    {
      _id: 'KdDjmojBERUKx3JkDdO5IaRJdZeZKNuK4bnKJ1',
      _account: 'nban4wnPKEtnmEpaKzbYFYQvA7D7pnCaeDBMy',
      amount: 3.49,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      _id: 'DAE3Yo3wXgskjXV1JqBDIrDBVvjMLDCQ4rMQdR',
      _account: 'pJPM4LMBNQFrOwp0jqEyTwyxJQrQbgU6kq37k',
      amount: 3.19,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      _id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY',
      _account: 'nban4wnPKEtnmEpaKzbYFYQvA7D7pnCaeDBMy',
      amount: 3.99,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    },
    {
      _id: 'moPE4dE1yMHJX5pmRzwrcvpQqPdDnZHEKPREYL',
      _account: 'nban4wnPKEtnmEpaKzbYFYQvA7D7pnCaeDBMy',
      amount: 3.99,
      date: "2014-06-21",
      name: "Gregorys Coffee"
    }
  ];

  describe('finding recent transactions', function() {
    it('should only return transactions since the last transaction id', function(done) {
      expect(worker.findRecentTransactions(users[0], transactions).length).to.equal(1);
      expect(worker.findRecentTransactions(users[1], transactions).length).to.equal(2);
      done();
    });
  });

  describe('rounding up transactions', function() {
    it('should return rounded-up amount for an amount > 0.50', function(done) {
      expect(worker.roundUpTransaction(transactions[0])).to.equal(0.51);
      done();
    });
  });

  xdescribe('linking together worker functions', function() {
    it('should log transactions in db for recent transactions', function(done) {
      worker.processDailyTransactions();
      //TODO: How to test if it has run correctly?? (depends on real plaid data...)
    });
  })
});
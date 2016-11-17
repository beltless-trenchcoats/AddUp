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

  describe('distributing donations amongst charities', function() {

    before(function() {
      db.query({
        text: 'SELECT id FROM users WHERE email=\'test@test.com\';'
      }, (err, results) => {
        if (results.rowCount > 0) {
          var id = results.rows[0].id;
          console.log('DELETE FROM transactions WHERE id_users=59');
          db.query({
            text: 'DELETE FROM transactions WHERE id_users=' + id + ';'
          }).then(() => {})
        }
        Users.createUser('test@test.com', 'test', 'Test', 'Test')
        .then(() => {
          Users.updateUser('test@test.com', {plaid_access_token: 'test_wells', stripe_bank_account_token: 'btok_9YDoZt3NHiIjun'}, () => {});
          Charities.createCharity({name: 'Green Peace', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
            state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'})
            .then(() =>{
              Charities.createCharity({name: 'Sea Shepherd Conservation Society', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
                state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'})
              .then(() => {
                dbHelper.getIDs('', 'Green Peace', function(idObj1) {
                  dbHelper.getIDs('', 'Sea Shepherd Conservation Society', function(idObj2) {
                    console.log('CHARITY IDS ARE', idObj1, idObj2);
                    UsersCharities.insert('test@test.com', idObj1.id_charities, .7, (r) => {console.log(r);});
                    UsersCharities.insert('test@test.com', idObj2.id_charities, .3, (r) => {console.log(r);});
                  });
                });
              });
            })
            .catch(err => {
              console.log('ERROR',err);
            });
          });
      });
    });


    it('should split donation amount based on percentages and save transactions to database upon successful charge', function(done) {
      Users.getUserFields('test@test.com', function(err, results) {
        var user = results[0];
        worker.distributeDonation(user, .80);
        setTimeout(() => {
          Transactions.getTransactions(user.email, (err, results) => {
            expect(results.length).to.equal(2);
            done();
            });
        }, 400);
      });
    });
  });

  xdescribe('linking together worker functions', function() {
    it('should log transactions in db for recent transactions', function(done) {
      worker.processDailyTransactions();
      //TODO: How to test if it has run correctly?? (depends on real plaid data...)
    });
  })
});
var expect = require('chai').expect;

var worker = require('../server/worker');

var Transactions = require('../server/db/controllers/transactions');
var Users = require('../server/db/controllers/users');
var Charities = require('../server/db/controllers/charities');
var UsersCharities = require('../server/db/controllers/usersCharities');


describe('Worker functions', function() {

  // An example user based on db schema
  var users = [
    {
      id: 2,
      email: 'test@gmail.com',
      plaid_access_token: 'test_wells',
      stripe_bank_account_token: 'btok_9YDoZt3NHiIjun',
      plaid_account_id: 'nban4wnPKEtnmEpaKzbYFYQvA7D7pnCaeDBMy',
      pending_balance: 0.3,
      monthly_total: 24.32,
      monthly_limit: 25,
      last_transaction_id: '1vAj1Eja5BIn4R7V6Mp1hBPQgkryZRHryZ0rDY'
    },
    {
      id: 2,
      email: 'test@gmail.com',
      plaid_access_token: 'test_bofa',
      stripe_bank_account_token: 'btok_9YEdF4atq1rpif',
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

  // xdescribe('charging with stripe', function() {
  //   it('should return without error when charging a user a given amount', function(done) {
  //     var testCharge = function() {
  //       worker.charge(users[0], 0.51);
  //     }
  //     expect(testCharge).to.not.throw(Error);
  //     setTimeout(() => done(), 100);
  //   });
  // });

  describe('distributing donations amongst charities', function() {

    // before(function() {
    //   Users.createUser('test@gmail.com', 'password', 'Test', 'Test', function(response) {
    //     console.log(response);
    //     Users.updateUser('test@gmail.com', {plaid_access_token: 'test_wells', stripe_bank_account_token: 'btok_9YDoZt3NHiIjun'}, () => {});
    //     Charities.createCharity({name: 'Save the Helgas', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
    //       state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'})
    //       .then(function() {
    //         Charities.createCharity({name: 'Save the Whales', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
    //           state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'})
    //       })
    //       .then(function() {
    //         UsersCharities.insert('test@gmail.com', 'Save the Helgas', .8, (r) => {console.log(r);});
    //         UsersCharities.insert('test@gmail.com', 'Save the Whales', .2, (r) => {console.log(r);});
    //       })
    //       .catch(function(err) {
    //         console.log('ERROR',err);
    //       });  
    //   });
    // });

    //NOTE: Need to clear out transactions for test user for this to pass

    it('should split donation amount based on percentages and save transactions to database upon successful charge', function(done) {
      Users.getUserFields('test@gmail.com', function(err, results) {
        var user = results[0];
        worker.distributeDonation(user, .80);
        setTimeout(() => {
          Transactions.getTransactions(user.email, (err, results) => {
          if (err) console.log('error getting transactions');
          expect(results.length).to.equal(2);
          done();
          });
        }, 100);
      });
    });
  });
});
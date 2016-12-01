var expect = require('chai').expect;
var axios = require('axios');

var server = require('../server/config/config');

var Users = require('../server/db/controllers/users');
var db = require('../server/db/config/db');

describe('Server routes', function() {

  describe('/api/session/', function () {


    describe('User login', function() {

      before(function() {
        Users.createUser('test@test.com', 'test', 'Test', 'Test').then(() => {
          Users.updateUser('test@test.com', {plaid_access_token: 'test_wells', plaid_public_token: 'btok_9YDoZt3NHiIjun'}, () => {});
        });
      });

      it('should send response with user data for a user who exists in the db', function(done) {
        axios.post(server + '/api/session/login',
          {
            email: 'test@test.com',
            password: 'test'
          })
          .then(res => {
            expect(res.data.first_name).to.equal('Test');
            expect(res.data.last_name).to.equal('Test');
            expect(res.data.email).to.equal('test@test.com');
            done();
          });
      });

      it('should not send response for user that does not exist in the db', function(done) {
        axios.post(server + '/api/session/login',
          {
            email: 'invalid@gmail.com',
            password: 'test'
          })
          .then(res => {
            expect(res.body).to.be.undefined;
            done();
          });
      });

      //TODO: Update this when we implement real sessions
      xit('should start a new session on successful login', function(done) {
        done();
      });
    });

    describe('User signup', function() {

      before(function() {
        db.query({
          text: 'DELETE FROM users WHERE email=\'notarealemail@test.com\';'
        }).then(() => setTimeout(() => {}, 100));
      });

      it('should log in a user upon successful sign up', function(done) {
        axios.post(server + '/api/session/signup',
          {
            email: 'notarealemail@test.com',
            password: 'test',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then(res => {
            expect(res.data.email).to.equal('notarealemail@test.com');
            done();
          });
      });

      it('should add a user to the database upon successful sign up', function(done) {
        Users.getUserFields('notarealemail@test.com', function(err, resp) {
          expect(resp[0]).to.exist;
          expect(resp[0].email).to.equal('notarealemail@test.com');
          done();
        });
      });

    });

    xdescribe('User logout', function() {
      //TODO: Write when real sessions work
      it('should destroy the session upon logout', function(done) {
        done();
      });
    });

    //TODO: This should be taken out once we get real sessions working
    describe('Session', function() {
      it('should return session variables', function(done) {
        done();
      });
    });

  });

  describe('/api/plaid/', function () {

    describe('Bank authentication through plaid', function () {
      it('should update a users tokens and bank data in db upon successful authentication', function(done) {
        done();
      });
    });

    describe('Fetch plaid transactions', function () {
      it('should return JSON transaction data for a user', function(done) {
        done();
      });
    });

  });

  describe('/api/user/', function () {

    describe('User links a charity to their account', function () {
      it('should add an entry to userscharities table in db', function(done) {
        done();
      });
    });

    describe('User profile page loads user information', function() {
      it('should return charities linked with a users account', function(done) {
        done();
      });

      it('should return transaction information for a given user', function(done) {
        done();
      });
    });

  });

  describe('/api/charities/', function () {

    describe('Charity search', function() {
      it('should return JSON data for all charities relevant to search', function(done) {
        done();
      });
    });

  });

  describe('/api/charity/', function() {

    describe('Charity info', function() {
      it('should return JSON charity data for specified charity', function(done) {
        done();
      });
    });

    describe('Update charity in db', function() {
      it('should update a charity in db', function(done) {
        done();
      });
    });

  });

  describe('/api/customCause/', function() {

    describe('Add custom cause', function() {
      it('should add a custom charity to the db', function(done) {
        done();
      });
    });

    describe('Update custom cause', function() {
      it('should update a custom charity in the db', function(done) {
        done();
      });
    });

  });

});

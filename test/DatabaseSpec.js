var expect = require('chai').expect;

var Users = require('../server/db/controllers/users');
var db = require('../server/db/config/db');

describe('Database Controller Functions', function() {

  describe('Users', function () {
    after(function() {
      // runs after all tests in this block
      // console.log('deleting now');
      db.query({
          text: "DELETE FROM users \
            WHERE email = 'databasetests@gmail.com';"
        }, 
        function(err, results) {
          if (err) {
            console.log(err);
          }
          done();
        });
    });

    it('should add a user to the database and encrypt password', function(done) {
      Users.createUser('databasetests@gmail.com', 'test123#', 'Helga', 'McHelgerson')
      .then(function(response) {
        expect(response).to.equal(true);
        db.query({
            text: "SELECT * FROM users \
              WHERE email = 'databasetests@gmail.com';"
          }, 
          function(err, results) {
            if (err) {
              console.log(err);
            } else {
              expect(results.rowCount).to.equal(1);
              expect(results.rows[0].password).to.not.equal('test123#');
              expect(results.rows[0].first_name).to.equal('Helga');
              expect(results.rows[0].last_name).to.equal('McHelgerson');
              done();
            }
          });
      });

    });

    it('should log in user with correct credentials', function(done) {
      Users.loginUser('databasetests@gmail.com', 'test123#', function(success) {
        expect(success).to.equal(true);
      });
      Users.loginUser('databasetests@gmail.com', 'iloveeggplants5', function(success) {
        expect(success).to.equal(false);
      });
      done();
    });

    it('should update user fields', function(done) {
      Users.updateUser('databasetests@gmail.com', {plaid_access_token: null, password: 'newpasswordyesyesyes', pending_balance: 8}, function(result) {
        expect(result).to.equal('success');
        db.query({
            text: "SELECT * FROM users \
              WHERE email = 'databasetests@gmail.com';"
          }, 
          function(err, results) {
            if (err) {
              console.log(err);
            } else {
              expect(results.rowCount).to.equal(1);
              expect(results.rows[0].plaid_access_token).to.equal(null);
              expect(results.rows[0].pending_balance).to.equal(8);
              Users.loginUser('databasetests@gmail.com', 'newpasswordyesyesyes', function(success) {
                expect(success).to.equal(true);
                done();
              });
            }
          });
      });
    });

    describe('getting user fields', function() {
      it('should get all users when given null as input', function(done) {
        Users.getUserFields(null, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            var filteredData = data.filter(function(element) {
              return (element.email === 'databasetests@gmail.com');
            })
            expect(filteredData.length).to.equal(1);
            done();
          }
        });
      });

      it('should take email or id as an input', function(done) {

        Users.getUserFields('databasetests@gmail.com', function(err, data) {
          if (err) {
            console.log(err);
          } else {
            expect(data[0].email).to.equal('databasetests@gmail.com');
            expect(data[0].pending_balance).to.equal(8);
            Users.getUserFields(data[0].id, function(err, data) {
              if (err) {
                console.log(err);
              } else {
                expect(data[0].email).to.equal('databasetests@gmail.com');
                expect(data[0].pending_balance).to.equal(8);
                done();
              }
            });
          }
        });
      });
    });

  });
});


var db = require('../config/db');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');
var helpers = require('./helpers');

exports.createUser = Promise.promisify(function(email, password, first_name, last_name, callback) {
  db.query({
    text: 'SELECT email, password, first_name, last_name FROM users \
      WHERE email = \'' + email + '\';'
  }, 
  function(err, rows) {
    if (err) {
      console.log(err);
    } else if (rows.rowCount > 0) {
      callback(null, false);
    } else {
      bcrypt.hash(password, 10, function(err, hash) {
        db.query({
          text: 'INSERT INTO users(email, password, first_name, last_name, monthly_limit, monthly_total, pending_balance) \
            VALUES($1, $2, $3, $4, $5, $6, $7)',
          values: [email, hash, first_name, last_name, 0, 0, 0]
        },
        function(err, result) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, true);
          }
        });
      });
    }
  });
});

exports.loginUser = function(email, password, callback) {
  db.query({
    text: 'SELECT email, password FROM users \
      WHERE email = \'' + email + '\';'
  }, 
  function(err, results) {
    if (err) {
      console.log(err);
    } else if (results.rowCount > 0) {
      bcrypt.compare(password, results.rows[0].password, function(err, res) {
          // res == true 
          if (err) {console.log(err);}
          if (res) {
            callback(true);
          } else {
            callback(false);
          }
      }); 
    } else {
      callback(false);
    }
  });
};

exports.updateUser = function(email, updateFields, callback) {
  
  //encrypt new password
  if (updateFields.password) {
    var hash = bcrypt.hashSync(updateFields.password, 10);
    updateFields.password = hash;
  }
  helpers.updateFields(updateFields, 'users', {email: email}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.getUserFields = function(input, callback) {
  if (input) {
    var filterFields = input.indexOf('@') > -1 ? {email: input} : {id: input};
  } else {
    var filterFields = null;
  }
  helpers.getFields(['*'], 'users', filterFields, function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    } 
  });
}

//EXAMPLE USAGE:
// exports.createUser('a@gmail.com', 'test', 'asdf', 'fds')
//   .then(function() {
//     exports.createUser('b@gmail.com', 'test', 'wersf', 'asdbfg');
//   });

// exports.loginUser('herbert@gmail.com', 'test', function(response) {
//   console.log(response);
// });

// exports.updateUser('helga@gmail.com', {plaid_access_token: null, password: '2', pending_balance: 8}, function(result) {
//   console.log(result);
// });

// exports.getUserFields('helga@gmail.com', function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

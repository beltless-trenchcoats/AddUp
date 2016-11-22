var db = require('../config/db');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

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
          text: 'INSERT INTO users(email, password, first_name, last_name) \
            VALUES($1, $2, $3, $4)',
          values: [email, hash, first_name, last_name]
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
  var updateString = '';
  for (var key in updateFields) {
    if (typeof updateFields[key] === 'string') {
      updateString +=  key + " = '" + updateFields[key] + "', "
    } else {
      updateString +=  key + ' = ' + updateFields[key] + ', '
    }
  }
  updateString = updateString.slice(0, updateString.length - 2);
  console.log('UPDATE users SET ' + updateString + ' \
      WHERE email = \'' + email + '\';');
  db.query({
    text: 'UPDATE users SET ' + updateString + ' \
      WHERE email = \'' + email + '\';'
  }, 
  function(err, rows) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.getUserFields = function(email, callback) {
  var queryString = '';
  if (email === '') {
    queryString += 'SELECT * FROM users;';
  } else {
    queryString += 'SELECT * FROM users WHERE email = \'' + email + '\';'
  }
  db.query({
    text: queryString
  }, 
  function(err, results) {
    if (err) {
      callback(err, null);
    } else if (results.rowCount > 0) {
      callback(null, results.rows);
    } else {
      callback('no rows for user ' + email, null);
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

// exports.updateUser('herbert@gmail.com', {plaid_access_token: 'n358sy98ty239582379', password: 'hi', pending_balance: 8}, function(result) {
//   console.log(result);
// });

// exports.getUserFields('herbert@gmail.com', function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

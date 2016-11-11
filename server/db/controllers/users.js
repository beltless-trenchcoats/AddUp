var db = require('../config/db');
var bcrypt = require('bcrypt');

exports.createUser = function(username, password, callback) {
  db.query({
    text: 'SELECT username, password FROM users \
      WHERE username = \'' + username + '\';'
  }, 
  function(err, rows) {
    if (err) {
      console.log(err);
    } else if (rows.rowCount > 0) {
      console.log('user already exists', rows.rows);
      callback('user already exists');
    } else {
      console.log('found nothing');
      bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in your password DB. 
        console.log('hash', hash);
        db.query({
          text: 'INSERT INTO users(username, password) \
            VALUES($1, $2)',
          values: [username, hash]
        },

        function(err, result) {
          if (err) {
            console.log('ERROR IN THE INSERT', err);
          } else {
            console.log('SUCCESS');
            callback('success');
          }
        });
      });
    }
  });
};

exports.loginUser = function(username, password, callback) {
  db.query({
    text: 'SELECT username, password FROM users \
      WHERE username = \'' + username + '\';'
  }, 
  function(err, rows) {
    if (err) {
      console.log(err);
    } else if (rows.rowCount > 0) {
      if (username === rows.rows[0].username) {
        bcrypt.compare(password, rows.rows[0].password, function(err, res) {
            // res == true 
            if (err) {console.log(err);}
            if (res) {
              callback(true);
            }
        }); 
      }
    } else {
      console.log('found nothing');
      callback(false);
    }
  });
};

exports.updateUser = function(username, updateFields, callback) {
  var updateString = '';
  for (var key in updateFields) {
    if (typeof updateFields[key] === 'string') {
      updateString +=  key + " = '" + updateFields[key] + "', "
    } else {
      updateString +=  key + ' = ' + updateFields[key] + ', '
    }
  }
  updateString = updateString.slice(0, updateString.length - 2);
  console.log('update string', updateString);
  console.log('UPDATE users SET ' + updateString + ' \
      WHERE username = \'' + username + '\';');
  db.query({
    text: 'UPDATE users SET ' + updateString + ' \
      WHERE username = \'' + username + '\';'
  }, 
  function(err, rows) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log('success');
      callback('success');
    }
  });
}

// exports.createUser('herbert', 'test', function(response) {
//   console.log(response);
// });
// exports.checkUser('herbert', 'test', function(response) {
//   console.log(response);
// });
// exports.updateUser('helga', {plaid_access_token: 'n358sy98ty239582379',password: 'hi', pending_balance: 8}, function(result) {
//   console.log(result);
// });

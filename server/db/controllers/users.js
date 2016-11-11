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
  // console.log('update string', updateString);
  console.log('UPDATE users SET ' + updateString + ' \
      WHERE username = \'' + username + '\';');
  db.query({
    text: 'UPDATE users SET ' + updateString + ' \
      WHERE username = \'' + username + '\';'
  }, 
  function(err, rows) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.getUserFields = function(username, callback) {
  var queryString = '';
  if (username === '') {
    queryString += 'SELECT * FROM users;';
  } else {
    queryString += 'SELECT * FROM users WHERE username = \'' + username + '\';'
  }
  db.query({
    text: queryString
  }, 
  function(err, rows) {
    if (err) {
      callback(err, null);
    } else if (rows.rowCount > 0) {
      callback(null, rows.rows);
    } else {
      callback('no rows for user ' + username, null);
    }
  });
}

//EXAMPLE USAGE:
// exports.createUser('herbert', 'test', function(response) {
//   console.log(response);
// });

// exports.checkUser('herbert', 'test', function(response) {
//   console.log(response);
// });

// exports.updateUser('helga', {plaid_access_token: 'n358sy98ty239582379',password: 'hi', pending_balance: 8}, function(result) {
//   console.log(result);
// });

// exports.getUserFields('helga', function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

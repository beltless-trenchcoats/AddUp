var db = require('../config/db');
var bcrypt = require('bcrypt');

exports.createUser = function(email, password, first_name, last_name, callback) {
  db.query({
    text: 'SELECT email, password, first_name, last_name FROM users \
      WHERE email = \'' + email + '\';'
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
          text: 'INSERT INTO users(email, password, first_name, last_name) \
            VALUES($1, $2, $3, $4)',
          values: [email, hash, first_name, last_name]
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

exports.loginUser = function(email, password, callback) {
  db.query({
    text: 'SELECT email, password FROM users \
      WHERE email = \'' + email + '\';'
  }, 
  function(err, rows) {
    if (err) {
      console.log(err);
    } else if (rows.rowCount > 0) {
      bcrypt.compare(password, rows.rows[0].password, function(err, res) {
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
  // if (updateFields.password) {
    
  // }
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
  function(err, rows) {
    if (err) {
      callback(err, null);
    } else if (rows.rowCount > 0) {
      callback(null, rows.rows);
    } else {
      callback('no rows for user ' + email, null);
    }
  });
}

//EXAMPLE USAGE:
// exports.createUser('herbert@gmail.com', 'test', 'Herbert', 'Williams', function(response) {
//   console.log(response);
// });

// exports.loginUser('herbert@gmail.com', 'test', function(response) {
//   console.log(response);
// });

// exports.updateUser('herbert@gmail.com', {plaid_access_token: 'n358sy98ty239582379',password: 'hi', pending_balance: 8}, function(result) {
//   console.log(result);
// });

// exports.getUserFields('herbert@gmail.com', function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

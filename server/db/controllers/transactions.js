var db = require('../config/db');
var helpers = require('./helpers');

exports.insert = function(id_users, id_charities, amount, callback) {
  var today = new Date();
  var month = (today.getMonth() + 1) < 10 ? '' + 0 + (today.getMonth() + 1) : '' + (today.getMonth() + 1);
  var day = today.getDate() < 10 ? '' + 0 + today.getDate() : '' + today.getDate();
  var date = '' + today.getFullYear() + '-' + month + '-' + day;
  db.query({
    text: 'INSERT INTO transactions(id_users, id_charities, amount, date_time) \
      VALUES($1, $2, $3, $4)',
    values: [id_users, id_charities, amount, date]
  },
  function(err, result) {
    if (err) {
      console.log('ERROR IN THE INSERT', err);
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.getTransactions = function(email, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    console.log('SELECT * FROM transactions WHERE id_users =\'' + id_users + '\';');
    db.query({
      text: 'SELECT * FROM transactions WHERE id_users =\'' + id_users + '\';'
    },
    function(err, rows) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows.rows);
      }
    });
  });
};

//EXAMPLE USAGE
// exports.insert(4, 1, 90, function(response) {
//   console.log(response);
// })

// exports.getTransactions('herbert@gmail.com', function(err, result) {
//   console.log(err, result);
// });



// CREATE TABLE transactions (
//   id BIGSERIAL   PRIMARY KEY,
//   amount REAL NULL DEFAULT NULL,
//   id_users BIGSERIAL     references users(id),
//   id_charities BIGSERIAL     references charities(id),
//   date_time date      NOT NULL
// );
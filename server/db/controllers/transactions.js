var db = require('../config/db');
var helpers = require('./helpers');

exports.insert = function(id_users, id_charities, amount, callback) {
  var today = new Date();
  var month = (today.getMonth() + 1) < 10 ? '' + 0 + (today.getMonth() + 1) : '' + (today.getMonth() + 1);
  var day = today.getDate() < 10 ? '' + 0 + today.getDate() : '' + today.getDate();
  var date = '' + today.getFullYear() + '-' + month + '-' + day;
  console.log('INSERT INTO transactions(id_users, id_charities, amount, date_time) \
      VALUES(' + id_users + ',' +  id_charities + ',' + amount + ',' + date + ')');
  db.query({
    text: 'INSERT INTO transactions(id_users, id_charities, amount, date_time) \
      VALUES($1, $2, $3, $4)',
    values: [id_users, id_charities, amount, date]
  },
  function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.getTransactions = function(email, callback) {
  console.log('FUCKING EMAIL', email);
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    console.log('SELECT date_time, amount, name FROM (SELECT * FROM transactions WHERE id_users = \'' + id_users + '\') AS t \
      INNER JOIN charities ON charities.id = t.id_charities;');
    db.query({
      text: 'SELECT date_time, amount, name FROM (SELECT * FROM transactions WHERE id_users = \'' + id_users + '\') AS t \
      INNER JOIN charities ON charities.id = t.id_charities;'
    },
    function(err, results) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  });
};

//EXAMPLE USAGE
// exports.insert(4, 1, 90, function(response) {
//   console.log(response);
// })

// exports.getTransactions('test@gmail.com', function(err, result) {
//   console.log(err, result);
// });



// CREATE TABLE transactions (
//   id BIGSERIAL   PRIMARY KEY,
//   amount REAL NULL DEFAULT NULL,
//   id_users BIGSERIAL     references users(id),
//   id_charities BIGSERIAL     references charities(id),
//   date_time date      NOT NULL
// );
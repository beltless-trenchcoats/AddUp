var db = require('../config/db');
var helpers = require('./helpers');

exports.insert = function(email, charity, percentage, callback) {
  helpers.getIDs(email, charity, function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = idObj.id_charities;
    console.log('SELECT * FROM usersCharities \
        WHERE id_users = ' + idObj.id_users + ' AND id_charities = ' + idObj.id_charities + ';');
    db.query({
      text: 'SELECT * FROM usersCharities \
        WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err);
      } else if (rows.rowCount > 0) {
        console.log(rows.rows);
        callback('email and charity are already in database');
      } else {
        console.log('fourth query about to run');
        db.query({
          text: 'INSERT INTO usersCharities(percentage, id_users, id_charities) \
            VALUES($1, $2, $3)',
          values: [percentage, id_users, id_charities]
        },
        function(err, result) {
          if (err) {
            console.log('ERROR IN THE INSERT', err);
            callback(err);
          } else {
            callback('success');
          }
        });
      }
    });
  });
};

exports.updatePercentage = function(email, charity, percentage, callback) {
  helpers.getIDs(email, charity, function(idObj) {
    console.log(idObj);
    var id_users = idObj.id_users;
    var id_charities = idObj.id_charities;
    console.log('SELECT * FROM usersCharities \
        WHERE id_users = ' + idObj.id_users + ' AND id_charities = ' + idObj.id_charities + ';');
    db.query({
      text: 'SELECT * FROM usersCharities \
        WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err);
      } else if (rows.rowCount > 0) {
        console.log(rows.rows);
        db.query({
          text: 'UPDATE usersCharities SET percentage = ' + percentage + ' \
            WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
        }, 
        function(err, rows) {
          if (err) {
            callback(err);
          } else {
            db.query({
              text: 'SELECT * FROM usersCharities \
                WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
            }, 
            function(err, rows) {
              if (err) {
                callback(err);
              } else {
                console.log(rows.rows);
              }
            });
            callback('success');
          }
        });
      } else {
        callback('charity and user not in database');
      }
    });
  });
};

exports.getUserCharityFields = function(email, charity, callback) {
  helpers.getIDs(email, charity, function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = idObj.id_charities;
    var queryString = '';
    if (charity === '' && email === '') {
      queryString += 'SELECT * FROM usersCharities;';
    } else if (charity !== '' && email === '') {
      queryString += 'SELECT * FROM usersCharities WHERE id_charities = \'' + id_charities + '\';'
    } else if (email !== '' && charity === '') {
      queryString += 'SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\';'
    } else {
      queryString += 'SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\' AND id_charities = \'' + id_charities + '\';'
    }
    console.log(queryString);
    db.query({
      text: queryString
    }, 
    function(err, rows) {
      if (err) {
        callback(err, null);
      } else if (rows.rowCount > 0) {
        callback(null, rows.rows);
      } else {
        callback('no records', null);
      }
    });
  });
}

// EXAMPLE USAGE:
// exports.insert('herbert@gmail.com', 'Save the Helgas', .5, function(result) {
//   console.log(result);
// });

// exports.updatePercentage('herbert@gmail.com', 'Save the Helgas', .8, function(result) {
//   console.log(result);
// });

// exports.getUserCharityFields('herbert@gmail.com', 'Save the Helgas', function(err, result) {
//   console.log(err, result);
// });

// -- CREATE TABLE usersCharities (
// --   id BIGSERIAL   PRIMARY KEY,
// --   percentage REAL NULL DEFAULT NULL,
// --   id_users BIGSERIAL     references users(id),
// --   id_charities BIGSERIAL     references charities(id)
// -- );
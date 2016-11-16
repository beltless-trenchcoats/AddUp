var db = require('../config/db');
var helpers = require('./helpers');

exports.insert = function(email, charityID, percentage, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = charityID;
    console.log('SELECT * FROM usersCharities \
        WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';');
    db.query({
      text: 'SELECT * FROM usersCharities \
        WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err);
      } else if (rows.rowCount > 0) {
        callback('email and charity are already in database');
      } else {
        db.query({
          text: 'INSERT INTO usersCharities(percentage, id_users, id_charities) \
            VALUES($1, $2, $3)',
          values: [percentage, id_users, id_charities]
        },
        function(err, result) {
          if (err) {
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
      queryString += 'SELECT * FROM (SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\') AS uc \
      INNER JOIN charities ON charities.id = uc.id_charities;'
      // 'SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\';'
    } else {
      queryString += 'SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\' AND id_charities = \'' + id_charities + '\';'
    }
    console.log(queryString);
    db.query({
      text: queryString
    }, 
    function(err, results) {
      if (err) {
        callback(err, null);
      } else if (results.rowCount > 0) {
        callback(null, results.rows);
      } else {
        callback('no records', null);
      }
    });
  });
};

exports.getUsersCharityDonationsInfo = function(email, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    // console.log('SELECT name, percentage, \
    //     (SELECT SUM(amount) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
    //       AS total_donated,\
    //     (SELECT MIN(date_time) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
    //       AS initial_date \
    //     FROM userscharities INNER JOIN charities ON userscharities.id_charities=charities.id WHERE id_users=\'' + id_users + '\';');
    db.query({
        text: 'SELECT name, percentage, \
          (SELECT SUM(amount) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
            AS total_donated,\
          (SELECT MIN(date_time) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
            AS initial_date \
          FROM userscharities INNER JOIN charities ON userscharities.id_charities=charities.id WHERE id_users=\'' + id_users + '\';'
      }, 
      function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results.rows);
        }
      }
    );
  });
}

// EXAMPLE USAGE:

// exports.getUsersCharityDonationsInfo('test@gmail.com', (err, results) => console.log(results));

exports.insert('test@gmail.com', 14, .5, function(result) {
  console.log(result);
});

// exports.updatePercentage('herbert@gmail.com', 'Save the Helgas', .8, function(result) {
//   console.log(result);
// });

// exports.getUserCharityFields('test@gmail.com', '', function(err, charities) {
//   if (err) {
//     console.log('ERROR getting users charities', err);
//   }
//   // console.log(err, result);
//   if (charities) {
//     console.log('CHARITIES ARE');
//     charities.forEach(charity => console.log(charity));
//   }
// });

// -- CREATE TABLE usersCharities (
// --   id BIGSERIAL   PRIMARY KEY,
// --   percentage REAL NULL DEFAULT NULL,
// --   id_users BIGSERIAL     references users(id),
// --   id_charities BIGSERIAL     references charities(id)
// -- );
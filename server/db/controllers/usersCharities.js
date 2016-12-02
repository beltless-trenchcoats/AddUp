var db = require('../config/db');
var helpers = require('./helpers');
var Promise = require('bluebird');

exports.insert = Promise.promisify(function(email, id_charities, percentage, callback) {
  helpers.getUserID(email, function(id_users) {
    db.query({
      text: 'SELECT * FROM usersCharities \
        WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err, null);
      } else if (rows.rowCount > 0) {
        callback(null, 'email and charity are already in database');
      } else {
        db.query({
          text: 'INSERT INTO usersCharities(percentage, id_users, id_charities) \
            VALUES($1, $2, $3)',
          values: [percentage, id_users, id_charities]
        },
        function(err, result) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, 'success');
          }
        });
      }
    });
  });
});

exports.remove = function(email, id_charities, callback) {
  helpers.getUserID(email, function(id_users) {
    db.query({
      text: 'DELETE FROM usersCharities \
      WHERE id_users =' + id_users + ' AND id_charities = ' + id_charities + ';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err);
      } else {
        callback(rows);
      }
    });
  });
}

exports.updatePercentage = Promise.promisify(function(email, id_charities, percentage, callback) {
  helpers.getUserID(email, function(id_users) {
    db.query({
      text: 'SELECT * FROM usersCharities \
        WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err, null);
      } else if (rows.rowCount > 0) {
        db.query({
          text: 'UPDATE usersCharities SET percentage = ' + percentage + ' \
            WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
        }, 
        function(err, rows) {
          if (err) {
            callback(err, null);
          } else {
            db.query({
              text: 'SELECT * FROM usersCharities \
                WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';'
            }, 
            function(err, rows) {
              if (err) {
                callback(err, null);
              }
            });
            callback(null, 'success');
          }
        });
      } else {
        callback(null, 'charity and user not in database');
      }
    });
  });
});

exports.getUserCharityFields = function(email, id_charities, callback) {
  helpers.getUserID(email, function(id_users) {
    var queryString = '';
    if (id_charities === null && email === '') {
      queryString += 'SELECT * FROM usersCharities;';
    } else if (id_charities !== null && email === '') {
      queryString += 'SELECT * FROM usersCharities WHERE id_charities = \'' + id_charities + '\';'
    } else if (email !== '' && id_charities === null) {
      queryString += 'SELECT * FROM (SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\') AS uc \
      INNER JOIN charities ON charities.id = uc.id_charities;'
      // 'SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\';'
    } else {
      queryString += 'SELECT * FROM usersCharities WHERE id_users = \'' + id_users + '\' AND id_charities = \'' + id_charities + '\';'
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
        callback('no records', null);
      }
    });
  });
};

exports.getUsersCharityDonationsInfo = function(email, callback) {
  helpers.getUserID(email, function(id_users) {
    db.query({
        text: 'SELECT charities.id, name, percentage, ein, type, \
          (SELECT SUM(amount) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
            AS user_donation_total, \
          (SELECT MIN(date_time) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
            AS initial_date, \
          (CASE WHEN total_donated >= dollar_goal THEN \'1\' ELSE \'0\' END) \
            AS goal_reached \
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

// exports.getUsersCharityDonationsInfo('kk@gmail.com', (err, results) => console.log(results));

// exports.insert('kk@gmail.com',  5, 0)
// .then((result) => console.log(result));

// exports.insert('test@gmail.com', 13, 0, function(result) {
//   console.log(result);
// });

// exports.remove('kk@gmail.com', 5, function(result) {
//   console.log(result);
// });

// exports.updatePercentage('kk@gmail.com',  5, .8)
// .then((result) => console.log(result));

// exports.getUserCharityFields('kk@gmail.com', 5, function(err, charities) {
//   if (err) {
//     console.log('ERROR getting users charities', err);
//   }
//   // console.log(err, result);
//   if (charities) {
//     console.log('CHARITIES ARE');
//     charities.forEach(charity => console.log(charity));
//   }
// });

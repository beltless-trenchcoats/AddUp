var db = require('../config/db');
var helpers = require('./helpers');
var Promise = require('bluebird');

exports.insert = Promise.promisify(function(email, charityID, percentage, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = charityID;
    // console.log('SELECT * FROM usersCharities \
    //     WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';');
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
        console.log('INSERT INTO usersCharities(percentage, id_users, id_charities) VALUES(...)');
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

exports.remove = function(email, charityID, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = charityID;
    // console.log('DELETE FROM usersCharities \
    //   WHERE id_users =' + id_users + ' AND id_charities = ' + id_charities + ';');
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

exports.updatePercentage = Promise.promisify(function(email, charityID, percentage, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = charityID;
    // console.log('SELECT * FROM usersCharities \
    //     WHERE id_users = ' + id_users + ' AND id_charities = ' + id_charities + ';');
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

exports.getUserCharityFields = function(email, charityID, callback) {
  helpers.getIDs(email, '', function(idObj) {
    var id_users = idObj.id_users;
    var id_charities = charityID;
    var queryString = '';
    if (charityID === null && email === '') {
      queryString += 'SELECT * FROM usersCharities;';
    } else if (charityID !== null && email === '') {
      queryString += 'SELECT * FROM usersCharities WHERE id_charities = \'' + id_charities + '\';'
    } else if (email !== '' && charityID === null) {
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
    // console.log('SELECT charities.id, name, percentage, ein, type, \
    //       (SELECT SUM(amount) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
    //         AS total_donated, \
    //       (SELECT MIN(date_time) FROM transactions WHERE id_users=\'' + id_users + '\' AND id_charities=charities.id) \
    //         AS initial_date, \
    //       (CASE WHEN dollar_goal >= total_donated THEN '1' ELSE '0' END) \
    //         AS goal_reached \
    //       FROM userscharities INNER JOIN charities ON userscharities.id_charities=charities.id WHERE id_users=\'' + id_users + '\';');
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

// exports.getUsersCharityDonationsInfo('test@gmail.com', (err, results) => console.log(results));

// exports.insert('j@j.com', 3, 0)
// .then(() => exports.insert('j@j.com', 5, 0));

// exports.insert('test@gmail.com', 13, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 12, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 11, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 2, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 3, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 4, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 5, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 8, 0, function(result) {
//   console.log(result);
// });
// exports.insert('test@gmail.com', 9, 0, function(result) {
//   console.log(result);
// });

// exports.remove('test@gmail.com', 14, function(result) {
//   console.log(result);
// });

// exports.updatePercentage('j@j.com', 3, .8)
// .then(() => exports.updatePercentage('j@j.com', 5, .2));

// exports.getUserCharityFields('test@gmail.com', 14, function(err, charities) {
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
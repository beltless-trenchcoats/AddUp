var db = require('../config/db');

var getIDs = function(username, charity, callback) {
  db.query({
    text: 'SELECT id FROM charities \
      WHERE name = \'' + charity + '\';'
  }, 
  function(err, rows) {
    if (err) {
      callback(err);
    } else {
      var id_charities = rows.rows[0].id;
      console.log('second query about to run');
      db.query({
        text: 'SELECT id FROM users \
          WHERE username = \'' + username + '\';'
      }, 
      function(err, rows) {
        if (err) {
          callback(err);
        } else {
          var id_users = rows.rows[0].id;
          callback({id_users: id_users, id_charities: id_charities});
        }
      });
    }
  });
};

exports.insert = function(username, charity, percentage, callback) {
  getIDs(username, charity, function(idObj) {
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
        callback('username and charity are already in database');
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

exports.updatePercentage = function(username, charity, percentage, callback) {
  getIDs(username, charity, function(idObj) {
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

// exports.getUserCharityFields = function(username, charity, callback) {
//   getIDs(username, charity, function(idObj) {
//     var id_users = idObj.id_users;
//     var id_charities = idObj.id_charities;
//     var queryString = '';
//     if (charity === '') {
//       queryString += 'SELECT * FROM charities;';
//     } else {
//       queryString += 'SELECT * FROM charities WHERE name = \'' + charity + '\';'
//     }
//     db.query({
//       text: queryString
//     }, 
//     function(err, rows) {
//       if (err) {
//         callback(err, null);
//       } else if (rows.rowCount > 0) {
//         callback(null, rows.rows);
//       } else {
//         callback('no rows for charity ' + charity, null);
//       }
//     });
//   });
// }
// EXAMPLE USAGE:
// exports.insert('helga', 'Save the Helgas', .5, function(result) {
//   console.log(result);
// });

// exports.updatePercentage('helga', 'Save the Helgas', .3, function(result) {
//   console.log(result);
// });

// -- CREATE TABLE usersCharities (
// --   id BIGSERIAL   PRIMARY KEY,
// --   percentage REAL NULL DEFAULT NULL,
// --   id_users BIGSERIAL     references users(id),
// --   id_charities BIGSERIAL     references charities(id)
// -- );
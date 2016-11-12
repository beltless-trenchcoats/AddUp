var db = require('../config/db');

exports.insert = function(username, charity, percentage, callback) {
  console.log('first query about to run');
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
          console.log('third query about to run');
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
        }
      });
      // if (rows.rowCount > 0) {
      //   callback('charity already in database ' + values.name);
      // } else {
      //   db.query({
      //     text: 'INSERT INTO charities(name, category, ein, donation_url, city, state, zip, balance_owed, mission_statement) \
      //       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      //     values: [values.name, values.category, values.ein, values.donation_url, values.city, 
      //         values.state, values.zip, 0, values.mission_statement]
      //   },

      //   function(err, result) {
      //     if (err) {
      //       console.log('ERROR IN THE INSERT', err);
      //       callback(err);
      //     } else {
      //       callback('success');
      //     }
      //   });
      // }
    }
  });
};

exports.insert('helga', 'Save the Helgas', .5, function(result) {
  console.log(result);
});

// -- CREATE TABLE usersCharities (
// --   id BIGSERIAL   PRIMARY KEY,
// --   percentage REAL NULL DEFAULT NULL,
// --   id_users BIGSERIAL     references users(id),
// --   id_charities BIGSERIAL     references charities(id)
// -- );
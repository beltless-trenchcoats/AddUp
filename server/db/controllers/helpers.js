var db = require('../config/db');

exports.getIDs = function(email, charity, callback) {
  if (email !== '' && charity !== '') {
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
        console.log('email', email, "charity", charity);
        db.query({
          text: 'SELECT id FROM users \
            WHERE email = \'' + email + '\';'
        }, 
        function(err, rows) {
          if (err) {
            callback(err);
          } else {
            console.log('users id', rows.rows);
            var id_users = rows.rows[0].id;
            callback({id_users: id_users, id_charities: id_charities});
          }
        });
      }
    });
  } else if (email !== '') {
    db.query({
      text: 'SELECT id FROM users \
        WHERE email = \'' + email + '\';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err);
      } else {
        console.log('users id', rows.rows);
        var id_users = rows.rows[0].id;
        callback({id_users: id_users, id_charities: ''});
      }
    });
  } else if (charity !== '') {
    db.query({
      text: 'SELECT id FROM charities \
        WHERE name = \'' + charity + '\';'
    }, 
    function(err, rows) {
      if (err) {
        callback(err);
      } else {
        var id_charities = rows.rows[0].id;
        callback({id_users: '', id_charities: id_charities});
      }
    });
  } else {
    callback({id_users: '', id_charities: ''});
  }
};
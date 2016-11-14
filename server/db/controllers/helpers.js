var db = require('../config/db');

exports.getIDs = function(email, charity, callback) {
  if (email !== '' && charity !== '') {
    db.query({
      text: 'SELECT id FROM charities \
        WHERE name = \'' + charity + '\';'
    }, 
    function(err, results) {
      if (err) {
        callback(err);
      } else {
        var id_charities = results.rows[0].id;
        db.query({
          text: 'SELECT id FROM users \
            WHERE email = \'' + email + '\';'
        }, 
        function(err, results) {
          if (err) {
            callback(err);
          } else {
            var id_users = results.rows[0].id;
            callback({id_users: id_users, id_charities: id_charities});
          }
        });
      }
    });
  } else if (email !== '') {
    console.log('SELECT id FROM users \
        WHERE email = \'' + email + '\';');
    db.query({
      text: 'SELECT id FROM users \
        WHERE email = \'' + email + '\';'
    }, 
    function(err, results) {
      if (err) {
        callback(err);
      } else {
        var id_users = results.rows[0].id;
        callback({id_users: id_users, id_charities: ''});
      }
    });
  } else if (charity !== '') {
    db.query({
      text: 'SELECT id FROM charities \
        WHERE name = \'' + charity + '\';'
    }, 
    function(err, results) {
      if (err) {
        callback(err);
      } else {
        var id_charities = results.rows[0].id;
        callback({id_users: '', id_charities: id_charities});
      }
    });
  } else {
    callback({id_users: '', id_charities: ''});
  }
};
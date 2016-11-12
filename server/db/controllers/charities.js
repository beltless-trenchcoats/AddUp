var db = require('../config/db');

exports.createCharity = function(values, callback) {
  db.query({
    text: 'SELECT name FROM charities \
      WHERE name = \'' + values.name + '\';'
  }, 
  function(err, rows) {
    if (err) {
      callback(err);
    } else {
      if (rows.rowCount > 0) {
        callback('charity already in database ' + values.name);
      } else {
        db.query({
          text: 'INSERT INTO charities(name, category, ein, donation_url, city, state, zip, balance_owed, mission_statement) \
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          values: [values.name, values.category, values.ein, values.donation_url, values.city, 
              values.state, values.zip, 0, values.mission_statement]
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
    }
  });
};

exports.updateBalance = function(charity, amount, callback) {
  db.query({
    text: 'SELECT balance_owed FROM charities \
      WHERE name = \'' + charity + '\';'
  }, 
  function(err, rows) {
    if (err) {
      callback(err);
    } else {
      if (rows.rowCount > 0) {
        console.log(rows.rows[0].balance_owed);
        var newAmount = rows.rows[0].balance_owed + amount;
        console.log(newAmount);
        db.query({
          text: 'UPDATE charities SET balance_owed = ' + newAmount + ' \
            WHERE name = \'' + charity + '\';'
        }, 
        function(err, rows) {
          if (err) {
            callback(err);
          } else {
            callback('success');
          }
        });
      } else {
        callback('charity is not in database ' + charity);
      }
    }
  });
};

exports.getCharityFields = function(charity, callback) {
  var queryString = '';
  if (charity === '') {
    queryString += 'SELECT * FROM charities;';
  } else {
    queryString += 'SELECT * FROM charities WHERE name = \'' + charity + '\';'
  }
  db.query({
    text: queryString
  }, 
  function(err, rows) {
    if (err) {
      callback(err, null);
    } else if (rows.rowCount > 0) {
      callback(null, rows.rows);
    } else {
      callback('no rows for charity ' + charity, null);
    }
  });
}

//EXAMPLE USAGE:

// exports.createCharity({name: 'Save the Helgas', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
//   state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'}, function(response) {
//   console.log(response);
// });

// exports.updateBalance('Save the Helgas', 5.02, function(response) {
//   console.log(response);
// });

// exports.getCharityFields('Save the Helgas', function(error, response) {
//   console.log(response);
// });
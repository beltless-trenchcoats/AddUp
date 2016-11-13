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
          text: 'INSERT INTO charities(name, category, ein, donation_url, city, state, zip, balance_owed, total_donated, mission_statement) \
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          values: [values.name, values.category, values.ein, values.donation_url, values.city, 
              values.state, values.zip, 0, 0, values.mission_statement]
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

exports.updateBalance = function(charityId, amountObj, callback) {
  db.query({
    text: 'SELECT balance_owed, total_donated FROM charities \
      WHERE id = \'' + charityId + '\';'
  }, 
  function(err, rows) {
    if (err) {
      callback(err);
    } else {
      if (rows.rowCount > 0) {
        var total_donated_add = amountObj.total_donated;
        var balance_owed_add = amountObj.balance_owed;
        var newBalance = rows.rows[0].balance_owed + balance_owed_add;
        var newTotal = rows.rows[0].total_donated + total_donated_add;
        console.log('UPDATE charities SET balance_owed = ' + newBalance + ', total_donated= ' + newTotal + ' \
            WHERE id = \'' + charityId + '\';');
        db.query({
          text: 'UPDATE charities SET balance_owed = ' + newBalance + ', total_donated= ' + newTotal + ' \
            WHERE id = \'' + charityId + '\';'
        }, 
        function(err, rows) {
          if (err) {
            callback(err);
          } else {
            callback('success');
          }
        });
      } else {
        callback('charityId is not in database ' + charityId);
      }
    }
  });
};

exports.getCharityFields = function(charityId, callback) {
  var queryString = '';
  if (charityId === '') {
    queryString += 'SELECT * FROM charities;';
  } else {
    queryString += 'SELECT * FROM charities WHERE id = \'' + charityId + '\';'
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
      callback('no rows for charityId ' + charityId, null);
    }
  });
}

//EXAMPLE USAGE:

// exports.createCharity({name: 'Save the Helgas', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
//   state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'}, function(response) {
//   console.log(response);
// });

// exports.updateBalance(1, {total_donated: 5.02, balance_owed: 3.04}, function(response) {
//   console.log(response);
// });

// exports.getCharityFields(1, function(error, response) {
//   console.log(response);
// });
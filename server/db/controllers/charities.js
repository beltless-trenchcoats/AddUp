var db = require('../config/db');
var Promise = require('bluebird');

exports.createCharity = Promise.promisify(function(values, callback) {
  db.query({
    text: 'SELECT name FROM charities \
      WHERE name = \'' + values.name + '\';'
  }, 
  function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      if (results.rowCount > 0) {
        console.log('charity already in database: ' + values.name);
        callback(null, null);
      } else {
        db.query({
          text: 'INSERT INTO charities(name, category, ein, donation_url, city, state, zip, balance_owed, total_donated, mission_statement) \
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          values: [values.name, values.category, values.ein, values.donation_url, values.city, 
              values.state, values.zip, 0, 0, values.mission_statement]
        },
        function(err, result) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, 'success');
          }
        });
      }
    }
  });
});

// exports.createCharity = function(values, callback) {
//     var queryAsync = Promise.promisify(db.query);
//     queryAsync({
//       text: 'SELECT name FROM charities \
//         WHERE name = \'' + values.name + '\';'
//     }).then(function(results) {
//       if (results.rowCount > 0) {
//         callback(null, 'charity already in database ' + values.name);
//       } else {
//         db.query({
//           text: 'INSERT INTO charities(name, category, ein, donation_url, city, state, zip, balance_owed, total_donated, mission_statement) \
//             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
//           values: [values.name, values.category, values.ein, values.donation_url, values.city, 
//               values.state, values.zip, 0, 0, values.mission_statement]
//         },
//         function(error, result) {
//           if (error) {
//             callback(error, null);
//           } else {
//             callback(null, 'success');
//           }
//         });
//       }
//     }).catch(function(err) {
//       console.log(err);
//     })
// }

exports.updateBalance = function(charityId, amountObj, callback) {
  console.log('**ABOUT TO UPDATE BALANCE OF CHARITY for', charityId);
  db.query({
    text: 'SELECT balance_owed, total_donated FROM charities \
      WHERE id = \'' + charityId + '\';'
  }, 
  function(err, results) {
    if (err) {
      callback(err);
    } else {
      console.log('***found existing charity', results.rows);
      if (results.rowCount > 0) {
        var total_donated_add = parseFloat(amountObj.total_donated);
        var balance_owed_add = parseFloat(amountObj.balance_owed);
        var newBalance = results.rows[0].balance_owed + balance_owed_add;
        var newTotal = results.rows[0].total_donated + total_donated_add;
        console.log('UPDATE charities SET balance_owed = ' + newBalance + ', total_donated= ' + newTotal + ' \
            WHERE id = \'' + charityId + '\';');
        db.query({
          text: 'UPDATE charities SET balance_owed = ' + newBalance + ', total_donated= ' + newTotal + ' \
            WHERE id = \'' + charityId + '\';'
        }, 
        function(err, results) {
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
  function(err, results) {
    if (err) {
      callback(err, null);
    } else if (results.rowCount > 0) {
      callback(null, results.rows);
    } else {
      callback('no rows for charityId ' + charityId, null);
    }
  });
}

//EXAMPLE USAGE:

// exports.createCharity({name: 'Save the Whales', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
//   state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'})
//   .then(function() {
//     exports.createCharity({name: 'Save the Trees', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
//       state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'});
//   })
//   .catch(function(err) {
//     console.log('ERROR', err);
//   });

// exports.createCharity({name: 'Red Cross', category: 'A', ein: 'gsot23235', donation_url: 'www.eggs.com', city: 'San Francisco',
//   state: 'CA', zip: '94114', mission_statement: 'To eat every egg in the fridge'}, function(err, response) {
//   console.log(response);
// });

// exports.updateBalance(1, {total_donated: 5.02, balance_owed: 3.04}, function(response) {
//   console.log(response);
// });

// exports.getCharityFields(1, function(error, response) {
//   console.log(response);
// });
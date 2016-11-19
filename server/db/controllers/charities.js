var db = require('../config/db');
var Promise = require('bluebird');

exports.createCharity = Promise.promisify(function(values, callback) {
  if (values.id_owner) {
    var queryText = 'SELECT name, id FROM charities \
      WHERE name = \'' + values.name + '\' AND id_owner = \'' + values.id_owner + '\';'
  } else {
    var queryText = 'SELECT name, id FROM charities \
      WHERE name = \'' + values.name + '\';'
  }
  console.log(queryText);
  db.query({
    text: queryText
  }, 
  function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      if (results.rowCount > 0) {
        console.log('charity already in database: ' + values.name);
        callback(null, results.rows);
      } else {
        db.query({
          text: 'INSERT INTO charities(name, category, ein, donation_url, city, state, zip, balance_owed, total_donated, mission_statement, \
            id_owner, dollar_goal, type, private, photo) \
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
          values: [values.name, values.category, values.ein || null, values.donation_url || null, values.city, 
              values.state, values.zip, 0, 0, values.mission_statement, values.id_owner || null, values.dollar_goal || null, values.type || 'charity', values.private || null, values.photo || null]
        },
        function(err, result) {
          if (err) {
            callback(err, null);
          } else {
            db.query({
              text: 'SELECT * FROM charities WHERE ein = \'' + values.ein + '\';'
            },
            function(err, result) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, result.rows);
              }
            });
          }
        });
      }
    }
  });
});

exports.updateCharity = function(charityID, updateFields, callback) {
  var updateString = '';
  for (var key in updateFields) {
    if (typeof updateFields[key] === 'string') {
      updateString +=  key + " = '" + updateFields[key] + "', "
    } else {
      updateString +=  key + ' = ' + updateFields[key] + ', '
    }
  }
  updateString = updateString.slice(0, updateString.length - 2);
  console.log('UPDATE charities SET ' + updateString + ' \
      WHERE id = \'' + charityID + '\';');
  db.query({
    text: 'UPDATE charities SET ' + updateString + ' \
      WHERE id = \'' + charityID + '\';'
  }, function(err, rows) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
};

exports.searchByEIN = function(ein, callback) {
  db.query({
    text: 'SELECT * FROM charities WHERE ein = \'' + ein + '\';'
  },
  function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result.rows);
    }
  });
};

exports.updateBalance = function(charityId, amountObj, callback) {
  db.query({
    text: 'SELECT balance_owed, total_donated FROM charities \
      WHERE id = \'' + charityId + '\';'
  }, 
  function(err, results) {
    if (err) {
      callback(err);
    } else {
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
};

exports.searchCustomCauses = function(searchFields, callback) {
  var searchString = 'SELECT * FROM charities WHERE type=\'custom\' AND ';
  for (var key in searchFields) {
    if (key !== 'name') {
      if (typeof searchFields[key] === 'string') {
        searchString +=  key + " = '" + searchFields[key] + "' AND "
      } else {
        searchString +=  key + ' = ' + searchFields[key] + ' AND '
      }
    }
  }
  searchString = searchString.slice(0, searchString.length - 5) + ';';
  console.log(searchString);
  db.query({
    text: searchString
  }, 
  function(err, results) {
    if (err) {
      callback(err, null);
    } else if (results.rowCount > 0) {
      if (searchFields.name) {
        var sendResults = results.rows.filter(function(item) {
          return (item.name.indexOf(searchFields.name) > -1);
        });
      } else {
        var sendResults = results.rows;     
      }
      callback(null, sendResults);
    } else {
      // no results
      callback(null, null);
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

// exports.createCharity({name: 'SAVE THE CHARITY IDS34', category: 'A', ein: 'po3oppoppp', donation_url: 'www.eggs.com', city: 'San Francisco',
//   state: 'CA', zip: '94114', mission_statement: 'To eat every frog in the fridge'}, function(err, response) {
//   console.log('THIS IS GOING TO BE THE RESPONSE ', response);
// });

//custom cause
// exports.createCharity({name: 'My cats paw grooming6', category: 'D', city: 'San Francisco',
//   state: 'CA', zip: '94114', mission_statement: 'Please help fund my cats pedicures', id_owner: 2, dollar_goal: 500, type:'custom', private:'false'}, function(err, response) {
//   console.log(response);
// });

// exports.updateCharity(14, {category: 'F', mission_statement: 'PLS DONATE I NEED TO EAT MICE NOW THX', dollar_goal: 501}, function(response) {
//   console.log(response);
// });

// exports.updateBalance(1, {total_donated: 5.02, balance_owed: 3.04}, function(response) {
//   console.log(response);
// });

// exports.getCharityFields(1, function(error, response) {
//   console.log(response);
// });

//search
// exports.searchCustomCauses({city: 'San Francisco', private: 'false'}, function(err, results) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(results);
//   }
// });
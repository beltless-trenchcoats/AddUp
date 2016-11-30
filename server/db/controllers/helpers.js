var db = require('../config/db');


exports.getFields = function(searchFields, table, filterFields, callback) {
  var queryString = 'SELECT ';
  for (var item of searchFields) {
    queryString +=  item + ", ";
  }
  queryString = queryString.slice(0, queryString.length - 2);
  queryString += ' FROM ' + table;
  if (filterFields) {
    queryString += ' WHERE ';
    for (var key in filterFields) {
      if (typeof filterFields[key] === 'string') {
        queryString +=  key + " = '" + filterFields[key] + "' AND "
      } else {
        queryString +=  key + ' = ' + filterFields[key] + ' AND '
      }
    }
    queryString = queryString.slice(0, queryString.length - 5);
  }
  queryString += ';'
  db.query(queryString, function(err, rows) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows.rows);
    }
  });
};

exports.updateFields = function(updateFields, table, filterFields, callback) {
  var updateString = '';
  for (var key in updateFields) {
    if (typeof updateFields[key] === 'string') {
      updateString +=  key + " = '" + updateFields[key] + "', "
    } else {
      updateString +=  key + ' = ' + updateFields[key] + ', '
    }
  }
  updateString = updateString.slice(0, updateString.length - 2);
  var filterString = '';
  if (filterFields) {
    filterString += ' WHERE ';
    for (var key in filterFields) {
      if (typeof filterFields[key] === 'string') {
        filterString +=  key + " = '" + filterFields[key] + "' AND "
      } else {
        filterString +=  key + ' = ' + filterFields[key] + ' AND '
      }
    }
    filterString = filterString.slice(0, filterString.length - 5);
  }

  db.query({
    text: 'UPDATE ' + table + ' SET ' + updateString + filterString + ';'
  }, function(err, result) {
    if (err) {
      callback(err);
    } else {
      callback('success');
    }
  });
}

exports.getUserID = function(email, callback) {
  // if (email) {
  exports.getFields(['id'], 'users', {email: email}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      if (result[0]) {
        var id_users = result[0].id;
      } else {
        id_users = '';
      }
      callback(id_users);
    }   
  });
};

// exports.getUserID('kk@gmail.com', function(id_users) {
//   console.log(id_users);
// });

// exports.updateFields({last_name: 'Phillips', monthly_limit: 67}, 'users', {email: 'kk@gmail.com'}, function(err, result) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// });

// exports.getFields(['id', 'name', 'mission_statement', 'total_donated'], 'charities', {id: 66, ein: '454347065'}, function(err, results) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(results);
//   }
// })
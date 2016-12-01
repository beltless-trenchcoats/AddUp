var db = require('../db/config/db');

exports.getAllTransactions = function(req, res) {
  db.query('SELECT * FROM transactions;', function(err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send(results.rows);
    }
  });
};





var db = require('../config/db');

var username='helga';
var password='test';

// pool.connect(function(err, client, done) {
//   if(err) {
//     return console.error('error fetching client from pool', err);
//   }
// pool.query({
//   text: 'INSERT INTO users(username, password) \
//     VALUES($1, $2)',
//   values: [username, password]
// },

// function(err, result) {
//   if (err) {
//     console.log('ERROR IN THE INSERT', err);
//   } else {
//     console.log('SUCCESS');
//   }
// });

db.query({
  text: 'SELECT username, password, plaid_access_token FROM users \
    WHERE username = \'' + username + '\';'
}, 

function(err, rows) {
  if (err) {
    console.log(err);
  }
  else if (rows.rowCount > 0) {
    console.log(rows.rows);
  } else {
    console.log('found nothing');
//   // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
//   //   //call `done()` to release the client back to the pool 
//   //   done();
 
//   //   if(err) {
//   //     return console.error('error running query', err);
//   //   }
//   //   console.log(result.rows[0].number);
//   //   //output: 1 
//   // });
  }
});
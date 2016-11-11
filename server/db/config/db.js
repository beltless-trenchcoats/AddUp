var pg = require('pg');
pg.defaults.ssl = true;
 
var config = {
  host: 'ec2-50-19-117-114.compute-1.amazonaws.com',
  user: 'lzbhhtfknfhwos', //env var: PGUSER 
  database: 'd3q2c5sid5ercl', //env var: PGDATABASE 
  password: 'uUICjs_U6Crc9bT0vd2HosdM46', //env var: PGPASSWORD 
  port: 5432 //env var: PGPORT 
  // max: 10, // max number of clients in the pool 
  // idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};
 
module.exports = new pg.Pool(config);

module.exports.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
});

// var pg = require('pg');

// pg.defaults.ssl = true;
// var database = 'postgres://lzbhhtfknfhwos:uUICjs_U6Crc9bT0vd2HosdM46@ec2-50-19-117-114.compute-1.amazonaws.com:5432/d3q2c5sid5ercl';
// // pg.connect(process.env.DATABASE_URL, function(err, client) {
// pg.connect(database, function(err, client) {
//   // console.log('database url ', process.env.DATABASE_URL);
//   if (err) throw err;
//   console.log('Connected to postgres! Getting schemas...');

// });

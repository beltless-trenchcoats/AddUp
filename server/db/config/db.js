var pg = require('pg');

// pg.defaults.ssl = true;
// var database = 'postgres://lzbhhtfknfhwos:uUICjs_U6Crc9bT0vd2HosdM46@ec2-50-19-117-114.compute-1.amazonaws.com:5432/d3q2c5sid5ercl';
pg.connect(process.env.DATABASE_URL, function(err, client) {
// pg.connect(database, function(err, client) {
  // console.log('database url ', process.env.DATABASE_URL);
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('CREATE DATABASE addup;');
});
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds135577.mlab.com:35577/heroku_p2gjxxlq');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('db is open!');
});


module.exports = db;
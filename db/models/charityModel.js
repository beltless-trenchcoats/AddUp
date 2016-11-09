var db = require('../config/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var charitySchema = new Schema({
  name: String,
  balanceOwed: Number
});

module.exports = mongoose.model('Charity', charitySchema);


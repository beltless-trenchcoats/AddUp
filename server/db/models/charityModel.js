var db = require('../config/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//we can add any other relevant categories based on orghunter api output
var charitySchema = new Schema({
  name: String,
  category: String, 
  ein: String,
  donationUrl: String,
  city: String,
  state: String,
  zipCode: String,
  balanceOwed: Number
});

module.exports = mongoose.model('Charity', charitySchema);


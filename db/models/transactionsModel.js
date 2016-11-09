var db = require('../config/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionsSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  charityId: {type: Schema.Types.ObjectId, ref: 'Charity'},
  amount: Number
});

module.exports = mongoose.model('Transaction', transactionsSchema);
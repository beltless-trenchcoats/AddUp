var db = require('../config/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  charities: [{
    type: Schema.Types.ObjectId,
    ref: 'Charity'
  }],
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  plaidAccessToken: String,
  stripeBankAccountToken: String,
  pendingBalance: Number,
  monthlyTotal: Number,
  limit: Number
});

module.exports = mongoose.model('User', userSchema);


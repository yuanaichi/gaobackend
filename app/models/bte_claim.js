const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BteClaimSchema = new Schema({
  miner: {
    type: String,
    required: true
  },
  blockNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true
  },
  attemptValue: {
    type: Number,
    required: true
  },
  reward: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BteClaim', BteClaimSchema);

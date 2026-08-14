const mongoose = require('mongoose');

const pairingSchema = new mongoose.Schema({
  pairingId: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  pairingCodeHash: {
    type: String,
    required: true,
    index: true
  },
  rawCode: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  usedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAIRED', 'EXPIRED', 'CANCELLED'],
    default: 'PENDING',
    index: true
  }
});

module.exports = mongoose.model('Pairing', pairingSchema);

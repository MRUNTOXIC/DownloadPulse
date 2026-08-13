const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: null,
    index: true
  },
  deviceName: {
    type: String,
    required: true
  },
  hostname: {
    type: String,
    default: 'Localhost'
  },
  platform: {
    type: String,
    default: 'win32'
  },
  OS: {
    type: String,
    default: 'Windows'
  },
  agentVersion: {
    type: String,
    default: '1.0.0'
  },
  pushToken: {
    type: String,
    default: null
  },
  lastHeartbeat: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  pairingCode: {
    type: String,
    default: null
  },
  isPaired: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);

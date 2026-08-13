const mongoose = require('mongoose');

const mobileDeviceSchema = new mongoose.Schema({
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
  expoPushToken: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'unknown'],
    default: 'unknown'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('MobileDevice', mobileDeviceSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    default: 'DownloadPulse User'
  },
  picture: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ['google', 'local'],
    default: 'google'
  },
  passwordHash: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

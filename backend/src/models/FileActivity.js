const mongoose = require('mongoose');

const fileActivitySchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: null,
    index: true
  },
  deviceId: {
    type: String,
    default: null,
    index: true
  },
  activityType: {
    type: String,
    enum: ['DOWNLOAD', 'FILE_COPY', 'FILE_MOVE', 'FILE_CREATE', 'FILE_EXTRACT', 'USB_TRANSFER', 'UNKNOWN'],
    default: 'UNKNOWN'
  },
  status: {
    type: String,
    enum: ['STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'STALLED', 'UNKNOWN'],
    default: 'STARTED'
  },
  filename: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  },
  fileSize: {
    type: String,
    default: '0 B'
  },
  source: {
    type: String,
    default: null
  },
  destination: {
    type: String,
    default: null
  },
  sourceDrive: {
    type: String,
    default: null
  },
  destinationDrive: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  device: {
    type: String,
    default: 'Windows PC'
  },
  reason: {
    type: String,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('FileActivity', fileActivitySchema);

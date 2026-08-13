const mongoose = require('mongoose');

const fileActivitySchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    unique: true
  },
  activityType: {
    type: String,
    enum: ['DOWNLOAD', 'FILE_COPY', 'FILE_MOVE', 'FILE_CREATE', 'FILE_EXTRACT', 'UNKNOWN'],
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
  }
}, { timestamps: true });

module.exports = mongoose.model('FileActivity', fileActivitySchema);

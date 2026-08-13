const FileActivity = require('../models/FileActivity');
const { sendPushNotification } = require('../services/pushNotificationService');

// In-Memory Activity Store Fallback
const memoryActivities = new Map();

async function syncActivity(req, res) {
  try {
    const {
      activityId,
      activityType,
      status,
      filename,
      extension,
      size,
      fileSize,
      source,
      destination,
      sourceDrive,
      destinationDrive,
      timestamp,
      device,
      reason,
      failureReason,
      metadata
    } = req.body;

    if (!activityId || !filename) {
      return res.status(400).json({ success: false, error: 'activityId and filename are required' });
    }

    const userId = req.userId || null;
    const deviceId = req.body.deviceId || null;

    const payload = {
      activityId,
      userId,
      deviceId,
      activityType: activityType || 'UNKNOWN',
      status: status || 'STARTED',
      filename,
      extension: extension || (filename.includes('.') ? filename.split('.').pop() : ''),
      size: size || 0,
      fileSize: fileSize || '0 B',
      source: source || null,
      destination: destination || null,
      sourceDrive: sourceDrive || null,
      destinationDrive: destinationDrive || null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      device: device || 'Windows PC',
      reason: reason || failureReason || null,
      failureReason: failureReason || reason || null,
      metadata: metadata || {}
    };

    let activityRecord;
    try {
      activityRecord = await FileActivity.findOneAndUpdate(
        { activityId },
        payload,
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      memoryActivities.set(activityId, payload);
      activityRecord = payload;
    }

    // Trigger Mobile Push Notification asynchronously
    sendPushNotification(payload).catch(() => {});

    console.log(`[BACKEND ACTIVITY SYNC] [${payload.status}] ${payload.filename} (${payload.fileSize})`);

    res.status(200).json({
      success: true,
      message: 'Activity synced successfully',
      data: activityRecord
    });
  } catch (error) {
    console.error('[Activity Sync Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getActivities(req, res) {
  try {
    const { type, status, q } = req.query;
    const filter = {};

    if (req.userId) {
      filter.$or = [{ userId: req.userId }, { userId: null }];
    }

    if (type && type !== 'ALL') {
      filter.activityType = type;
    }

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (q) {
      filter.filename = { $regex: q, $options: 'i' };
    }

    try {
      const activities = await FileActivity.find(filter).sort({ timestamp: -1 }).limit(100);
      return res.status(200).json({
        success: true,
        data: activities
      });
    } catch (dbErr) {
      let list = Array.from(memoryActivities.values());

      if (type && type !== 'ALL') {
        list = list.filter(a => a.activityType === type);
      }
      if (status && status !== 'ALL') {
        list = list.filter(a => a.status === status);
      }
      if (q) {
        list = list.filter(a => a.filename.toLowerCase().includes(q.toLowerCase()));
      }

      list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return res.status(200).json({
        success: true,
        data: list
      });
    }
  } catch (error) {
    console.error('[Get Activities Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  syncActivity,
  getActivities
};

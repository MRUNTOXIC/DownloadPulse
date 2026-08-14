const FileActivity = require('../models/FileActivity');
const Device = require('../models/Device');
const { sendPushNotification } = require('../services/pushNotificationService');

const memoryActivities = new Map();

async function syncActivity(req, res) {
  try {
    const {
      activityId,
      deviceId,
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

    if (!filename || (!activityId && !destination)) {
      return res.status(400).json({ success: false, error: 'filename and activityId/destination are required' });
    }

    const targetDeviceId = deviceId || req.body.device || 'desktop_default';

    // Verify Device Ownership (Strict Trust Boundary)
    let pairedUserId = null;
    try {
      const deviceRecord = await Device.findOne({ deviceId: targetDeviceId });
      if (deviceRecord && deviceRecord.userId && deviceRecord.isPaired) {
        pairedUserId = deviceRecord.userId;
      }
    } catch (e) {}

    // Logical Activity Key to deduplicate database records
    const normalizedPath = (destination || filename).toLowerCase();
    const activityKey = `${targetDeviceId}:${normalizedPath}:${activityType || 'UNKNOWN'}`;

    const payload = {
      activityId: activityId || `act_${Date.now()}`,
      activityKey,
      userId: pairedUserId || 'unpaired_temp',
      deviceId: targetDeviceId,
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
      device: device || 'Desktop Agent',
      reason: reason || failureReason || null,
      metadata: metadata || {}
    };

    let activityRecord;
    try {
      // Upsert by activityKey to update single document record per download/transfer
      activityRecord = await FileActivity.findOneAndUpdate(
        { activityKey },
        payload,
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      memoryActivities.set(activityKey, payload);
      activityRecord = payload;
    }

    // Trigger Mobile Push Notification ONLY if device is paired to a user account
    if (pairedUserId) {
      sendPushNotification(payload, pairedUserId).catch(() => {});
    }

    console.log(`[BACKEND ACTIVITY SYNC] [${payload.status}] ${payload.filename} (${payload.fileSize}) [Paired User: ${pairedUserId || 'NONE'}]`);

    return res.status(200).json({
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
    const userId = req.userId || 'usr_hardcoded_user_001';

    const { type, status, q } = req.query;
    const filter = { $or: [{ userId }, { userId: 'unpaired_temp' }, { userId: null }] };

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
      let list = Array.from(memoryActivities.values()).filter(a => a.userId === userId);

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

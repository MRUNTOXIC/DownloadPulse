const FileActivity = require('../models/FileActivity');
const { getIsConnected } = require('../config/db');
const { sendMobilePushNotification } = require('../services/pushService');

// In-memory fallback repository when MongoDB daemon is not running locally
const inMemoryActivities = new Map();

/**
 * Creates or updates a file activity state
 */
exports.createOrUpdateActivity = async (req, res) => {
  try {
    const activityData = req.body;
    const { activityId } = activityData;

    if (!activityId) {
      return res.status(400).json({ success: false, message: 'activityId is required' });
    }

    let savedActivity = null;

    if (getIsConnected()) {
      savedActivity = await FileActivity.findOneAndUpdate(
        { activityId },
        { $set: activityData },
        { upsert: true, new: true }
      );
    } else {
      const existing = inMemoryActivities.get(activityId) || {};
      savedActivity = { ...existing, ...activityData, updatedAt: new Date().toISOString() };
      inMemoryActivities.set(activityId, savedActivity);
    }

    // Trigger Mobile Push Notification if state complete/failed
    sendMobilePushNotification(savedActivity);

    return res.status(200).json({
      success: true,
      message: 'Activity synced successfully',
      data: savedActivity
    });
  } catch (error) {
    console.error('[Activity Controller Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves file activity feed with searching and filtering support
 */
exports.getActivities = async (req, res) => {
  try {
    const { q, type, status, limit = 50 } = req.query;

    let activities = [];

    if (getIsConnected()) {
      const filter = {};
      if (type && type !== 'ALL') filter.activityType = type;
      if (status && status !== 'ALL') filter.status = status;
      if (q) {
        filter.filename = { $regex: q, $options: 'i' };
      }

      activities = await FileActivity.find(filter)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit, 10));
    } else {
      activities = Array.from(inMemoryActivities.values());
      if (type && type !== 'ALL') {
        activities = activities.filter(a => a.activityType === type);
      }
      if (status && status !== 'ALL') {
        activities = activities.filter(a => a.status === status);
      }
      if (q) {
        const queryLower = q.toLowerCase();
        activities = activities.filter(a => a.filename && a.filename.toLowerCase().includes(queryLower));
      }
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      activities = activities.slice(0, parseInt(limit, 10));
    }

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error('[Activity Controller Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single activity by ID
 */
exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    let activity = null;

    if (getIsConnected()) {
      activity = await FileActivity.findOne({ activityId: id });
    } else {
      activity = inMemoryActivities.get(id);
    }

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    return res.status(200).json({ success: true, data: activity });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

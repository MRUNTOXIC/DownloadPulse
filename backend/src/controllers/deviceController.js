const Device = require('../models/Device');
const { getIsConnected } = require('../config/db');

const inMemoryDevices = new Map();

/**
 * Handle heartbeat from Windows Desktop Agent
 */
exports.registerHeartbeat = async (req, res) => {
  try {
    const { deviceId, name, platform } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    const lastSeen = new Date();
    let device = null;

    if (getIsConnected()) {
      device = await Device.findOneAndUpdate(
        { deviceId },
        {
          $set: {
            name: name || deviceId,
            platform: platform || 'win32',
            lastSeen,
            isOnline: true
          }
        },
        { upsert: true, new: true }
      );
    } else {
      const existing = inMemoryDevices.get(deviceId) || {};
      device = {
        ...existing,
        deviceId,
        name: name || deviceId,
        platform: platform || 'win32',
        lastSeen: lastSeen.toISOString(),
        isOnline: true
      };
      inMemoryDevices.set(deviceId, device);
    }

    return res.status(200).json({ success: true, data: device });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Register mobile Expo push token
 */
exports.registerPushToken = async (req, res) => {
  try {
    const { deviceId = 'mobile_device', pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ success: false, message: 'pushToken is required' });
    }

    let device = null;
    if (getIsConnected()) {
      device = await Device.findOneAndUpdate(
        { deviceId },
        { $set: { pushToken, platform: 'mobile', lastSeen: new Date(), isOnline: true } },
        { upsert: true, new: true }
      );
    } else {
      const existing = inMemoryDevices.get(deviceId) || {};
      device = { ...existing, deviceId, pushToken, platform: 'mobile', lastSeen: new Date().toISOString(), isOnline: true };
      inMemoryDevices.set(deviceId, device);
    }

    console.log(`[Push Token Registered]:`, pushToken);
    return res.status(200).json({ success: true, data: device });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get registered devices status
 */
exports.getDevices = async (req, res) => {
  try {
    let devices = [];

    if (getIsConnected()) {
      devices = await Device.find().sort({ lastSeen: -1 });
    } else {
      devices = Array.from(inMemoryDevices.values());
    }

    // Mark device as offline if lastSeen > 45 seconds ago
    const now = Date.now();
    const formattedDevices = devices.map(d => {
      const devObj = d.toObject ? d.toObject() : { ...d };
      const lastSeenMs = new Date(devObj.lastSeen).getTime();
      devObj.isOnline = (now - lastSeenMs) < 45000;
      return devObj;
    });

    return res.status(200).json({ success: true, count: formattedDevices.length, data: formattedDevices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

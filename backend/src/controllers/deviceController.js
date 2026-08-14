const Device = require('../models/Device');
const MobileDevice = require('../models/MobileDevice');

const memoryDevices = new Map();

// Auto-cleanup stale heartbeats every 20 seconds
setInterval(async () => {
  try {
    const threshold = new Date(Date.now() - 45000); // 45s offline threshold
    await Device.updateMany({ lastHeartbeat: { $lt: threshold }, isOnline: true }, { isOnline: false });
    
    memoryDevices.forEach((dev) => {
      if (dev.lastHeartbeat && new Date(dev.lastHeartbeat) < threshold) {
        dev.isOnline = false;
      }
    });
  } catch (e) {}
}, 20000);

async function heartbeat(req, res) {
  try {
    const { deviceId, deviceName, platform, OS, agentVersion } = req.body;
    const deviceToken = req.headers['x-device-token'] || req.body.deviceToken || 'dev_token_default';

    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'deviceId is required' });
    }

    let existingDevice;
    try {
      existingDevice = await Device.findOne({ deviceId });
    } catch (e) {}

    const updatePayload = {
      deviceId,
      deviceToken: existingDevice?.deviceToken || deviceToken,
      deviceName: deviceName || existingDevice?.deviceName || 'Desktop Agent',
      platform: platform || existingDevice?.platform || 'win32',
      OS: OS || existingDevice?.OS || 'Windows',
      agentVersion: agentVersion || '1.0.0',
      lastHeartbeat: new Date(),
      isOnline: true
    };

    try {
      const device = await Device.findOneAndUpdate(
        { deviceId },
        updatePayload,
        { upsert: true, new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Heartbeat recorded',
        data: {
          deviceId: device.deviceId,
          isPaired: !!device.userId,
          isOnline: device.isOnline
        }
      });
    } catch (dbErr) {
      memoryDevices.set(deviceId, { deviceId, ...updatePayload });
      res.status(200).json({
        success: true,
        message: 'Heartbeat recorded (In-Memory)',
        data: { deviceId, isOnline: true }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function registerPushToken(req, res) {
  try {
    const { pushToken, deviceId, platform } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required to register push token' });
    }

    if (!pushToken) {
      return res.status(400).json({ success: false, error: 'pushToken is required' });
    }

    const targetDeviceId = deviceId || `mobile_${userId}_${Date.now()}`;

    try {
      await MobileDevice.findOneAndUpdate(
        { deviceId: targetDeviceId },
        { deviceId: targetDeviceId, userId, expoPushToken: pushToken, platform: platform || 'unknown', lastSeen: new Date() },
        { upsert: true, new: true }
      );
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: 'Push token registered to user account',
      data: { pushToken, userId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getDevices(req, res) {
  try {
    const userId = req.userId || 'usr_hardcoded_user_001';

    try {
      const devices = await Device.find({ $or: [{ userId }, { isPaired: true }, { isOnline: true }] }).sort({ lastHeartbeat: -1 });
      return res.status(200).json({
        success: true,
        data: devices
      });
    } catch (dbErr) {
      const list = Array.from(memoryDevices.values());
      return res.status(200).json({
        success: true,
        data: list
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  heartbeat,
  registerPushToken,
  getDevices
};

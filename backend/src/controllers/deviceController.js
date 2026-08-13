const Device = require('../models/Device');
const MobileDevice = require('../models/MobileDevice');

// Memory store fallback
const memoryDevices = new Map();
const memoryPairingCodes = new Map(); // pairingCode -> { userId, expiresAt }

// Auto-cleanup stale heartbeats every 20 seconds
setInterval(async () => {
  try {
    const threshold = new Date(Date.now() - 45000); // 45 seconds timeout
    await Device.updateMany({ lastHeartbeat: { $lt: threshold }, isOnline: true }, { isOnline: false });
    
    memoryDevices.forEach((dev) => {
      if (dev.lastHeartbeat && new Date(dev.lastHeartbeat) < threshold) {
        dev.isOnline = false;
      }
    });
  } catch (e) {}
}, 20000);

async function generatePairingCode(req, res) {
  try {
    const userId = req.userId || 'default_user';
    const pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    memoryPairingCodes.set(pairingCode, { userId, expiresAt });

    res.status(200).json({
      success: true,
      message: 'Pairing code generated',
      data: { pairingCode, expiresAt, expiresInMinutes: 10 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function pairDevice(req, res) {
  try {
    const { deviceId, deviceName, platform, OS, pairingCode } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'deviceId is required' });
    }

    let assignedUserId = req.userId || null;

    if (pairingCode) {
      const codeRecord = memoryPairingCodes.get(pairingCode);
      if (!codeRecord || codeRecord.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, error: 'Invalid or expired pairing code' });
      }
      assignedUserId = codeRecord.userId;
    }

    const updateData = {
      deviceId,
      deviceName: deviceName || 'Desktop Agent',
      platform: platform || 'win32',
      OS: OS || (platform === 'darwin' ? 'macOS' : 'Windows'),
      userId: assignedUserId,
      isOnline: true,
      isPaired: true,
      lastHeartbeat: new Date()
    };

    try {
      const device = await Device.findOneAndUpdate(
        { deviceId },
        updateData,
        { upsert: true, new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Device paired successfully',
        data: device
      });
    } catch (dbErr) {
      memoryDevices.set(deviceId, updateData);
      res.status(200).json({
        success: true,
        message: 'Device paired successfully (In-Memory)',
        data: updateData
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function heartbeat(req, res) {
  try {
    const { deviceId, deviceName, platform, OS, agentVersion } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'deviceId is required' });
    }

    const updatePayload = {
      name: deviceName || 'Desktop Agent',
      deviceName: deviceName || 'Desktop Agent',
      platform: platform || 'win32',
      OS: OS || 'Windows',
      agentVersion: agentVersion || '1.0.0',
      lastHeartbeat: new Date(),
      lastSeen: new Date(),
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
        data: device
      });
    } catch (dbErr) {
      memoryDevices.set(deviceId, { deviceId, ...updatePayload });
      res.status(200).json({
        success: true,
        message: 'Heartbeat recorded (In-Memory)',
        data: { deviceId, ...updatePayload }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function registerPushToken(req, res) {
  try {
    const { pushToken, deviceId, platform } = req.body;
    if (!pushToken) {
      return res.status(400).json({ success: false, error: 'pushToken is required' });
    }

    const targetDeviceId = deviceId || `mobile_${Date.now()}`;
    const userId = req.userId || null;

    try {
      await MobileDevice.findOneAndUpdate(
        { deviceId: targetDeviceId },
        { deviceId: targetDeviceId, userId, expoPushToken: pushToken, platform: platform || 'unknown', lastSeen: new Date() },
        { upsert: true, new: true }
      );
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: 'Push token registered successfully',
      data: { pushToken, deviceId: targetDeviceId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getDevices(req, res) {
  try {
    const filter = {};
    if (req.userId) {
      filter.$or = [{ userId: req.userId }, { userId: null }];
    }

    try {
      const devices = await Device.find(filter).sort({ lastHeartbeat: -1 });
      res.status(200).json({
        success: true,
        data: devices
      });
    } catch (dbErr) {
      const list = Array.from(memoryDevices.values());
      res.status(200).json({
        success: true,
        data: list
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function removeDevice(req, res) {
  try {
    const { id } = req.params;
    try {
      await Device.deleteOne({ $or: [{ deviceId: id }, { _id: id }] });
    } catch (e) {
      memoryDevices.delete(id);
    }

    res.status(200).json({ success: true, message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  generatePairingCode,
  pairDevice,
  heartbeat,
  registerPushToken,
  getDevices,
  removeDevice
};

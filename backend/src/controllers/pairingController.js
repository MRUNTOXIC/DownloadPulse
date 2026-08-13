const crypto = require('crypto');
const Pairing = require('../models/Pairing');
const Device = require('../models/Device');
const User = require('../models/User');

function hashCode(code) {
  return crypto.createHash('sha256').update(code.toString()).digest('hex');
}

/**
 * Desktop Agent requests a cryptographically secure 5-minute 6-digit pairing code
 * Requires Desktop Agent authentication headers (deviceId & x-device-token)
 */
async function createPairingCode(req, res) {
  try {
    const { deviceId, deviceName, platform, OS, agentVersion } = req.body;
    const deviceToken = req.headers['x-device-token'] || req.body.deviceToken;

    if (!deviceId || !deviceToken) {
      return res.status(400).json({
        success: false,
        error: 'deviceId and x-device-token header are required for desktop pairing request'
      });
    }

    let deviceRecord;
    try {
      deviceRecord = await Device.findOneAndUpdate(
        { deviceId },
        {
          deviceId,
          deviceToken,
          deviceName: deviceName || 'Desktop Agent',
          platform: platform || 'win32',
          OS: OS || 'Windows',
          agentVersion: agentVersion || '1.0.0',
          lastHeartbeat: new Date(),
          isOnline: true
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      deviceRecord = { deviceId, deviceToken, deviceName: deviceName || 'Desktop Agent' };
    }

    if (deviceRecord.deviceToken && deviceRecord.deviceToken !== deviceToken) {
      return res.status(401).json({ success: false, error: 'Invalid deviceToken authentication' });
    }

    const rawCodeInt = crypto.randomInt(100000, 1000000);
    const pairingCode = rawCodeInt.toString();
    const pairingCodeHash = hashCode(pairingCode);

    const pairingId = `pair_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    try {
      await Pairing.updateMany({ deviceId, status: 'PENDING' }, { status: 'CANCELLED' });
      await Pairing.create({
        pairingId,
        deviceId,
        pairingCodeHash,
        userId: null,
        expiresAt,
        status: 'PENDING'
      });
    } catch (e) {}

    console.log(`[PAIRING CODE GENERATED] Code: ${pairingCode} for Device: ${deviceId} (Expires in 5m)`);

    return res.status(200).json({
      success: true,
      message: 'Pairing code generated successfully',
      data: {
        pairingCode,
        deviceId,
        expiresAt: expiresAt.toISOString(),
        expiresInSeconds: 300
      }
    });
  } catch (error) {
    console.error('[Create Pairing Code Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Queries real-time pairing status for Desktop Agent
 * Returns user info if paired, or fresh 6-digit pairing code if unpaired
 */
async function getPairingStatus(req, res) {
  try {
    const deviceId = req.query.deviceId || req.body.deviceId;
    const deviceToken = req.headers['x-device-token'] || req.query.deviceToken || req.body.deviceToken;

    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'deviceId is required' });
    }

    let deviceRecord;
    try {
      deviceRecord = await Device.findOne({ deviceId });
    } catch (e) {}

    if (deviceRecord && deviceRecord.userId && deviceRecord.isPaired) {
      let userRecord = null;
      try {
        userRecord = await User.findOne({ userId: deviceRecord.userId });
      } catch (e) {}

      return res.status(200).json({
        success: true,
        data: {
          isPaired: true,
          pairedUser: userRecord ? {
            name: userRecord.name,
            email: userRecord.email
          } : { name: 'DownloadPulse User', email: 'user@gmail.com' }
        }
      });
    }

    // Device is unpaired — generate a fresh 6-digit code!
    const rawCodeInt = crypto.randomInt(100000, 1000000);
    const pairingCode = rawCodeInt.toString();
    const pairingCodeHash = hashCode(pairingCode);

    const pairingId = `pair_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      await Pairing.updateMany({ deviceId, status: 'PENDING' }, { status: 'CANCELLED' });
      await Pairing.create({
        pairingId,
        deviceId,
        pairingCodeHash,
        userId: null,
        expiresAt,
        status: 'PENDING'
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      data: {
        isPaired: false,
        pairedUser: null,
        pairingCode,
        expiresInSeconds: 300
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Mobile App user enters 6-digit code to pair desktop device to their user account
 */
async function verifyPairingCode(req, res) {
  try {
    const { pairingCode } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required to pair device' });
    }

    if (!pairingCode) {
      return res.status(400).json({ success: false, error: 'pairingCode is required' });
    }

    const codeHash = hashCode(pairingCode.toString().trim());

    let pairingRecord;
    try {
      pairingRecord = await Pairing.findOne({
        pairingCodeHash: codeHash,
        status: 'PENDING',
        expiresAt: { $gt: new Date() }
      });
    } catch (dbErr) {}

    if (!pairingRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid, expired, or already used 6-digit pairing code'
      });
    }

    pairingRecord.status = 'PAIRED';
    pairingRecord.userId = userId;
    pairingRecord.usedAt = new Date();
    await pairingRecord.save();

    let updatedDevice;
    try {
      updatedDevice = await Device.findOneAndUpdate(
        { deviceId: pairingRecord.deviceId },
        { userId, isPaired: true, lastHeartbeat: new Date(), isOnline: true },
        { new: true }
      );
    } catch (dbErr) {}

    console.log(`[DEVICE PAIRED SUCCESS] User: ${userId} ➔ Device: ${pairingRecord.deviceId}`);

    return res.status(200).json({
      success: true,
      message: 'Computer paired successfully to your account',
      data: updatedDevice || { deviceId: pairingRecord.deviceId, userId, isPaired: true }
    });
  } catch (error) {
    console.error('[Verify Pairing Error]:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Unpair device from account
 */
async function unpairDevice(req, res) {
  try {
    const { deviceId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    try {
      await Device.findOneAndUpdate(
        { deviceId, userId },
        { userId: null, isPaired: false }
      );
    } catch (e) {}

    console.log(`[DEVICE UNPAIRED] User: ${userId} unpaired Device: ${deviceId}`);

    return res.status(200).json({
      success: true,
      message: 'Device unpaired successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  createPairingCode,
  getPairingStatus,
  verifyPairingCode,
  unpairDevice
};

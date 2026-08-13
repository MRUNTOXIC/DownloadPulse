const { Expo } = require('expo-server-sdk');
const MobileDevice = require('../models/MobileDevice');

const expo = new Expo();

async function sendPushNotification(activity) {
  const { activityId, activityType, status, filename, fileSize, device, reason } = activity;

  // Only trigger push notifications for COMPLETED, FAILED, or USB transfers
  const isImportant =
    status === 'COMPLETED' ||
    status === 'FAILED' ||
    activityType === 'USB_TRANSFER' ||
    activityType === 'FILE_COPY';

  if (!isImportant) return;

  try {
    // Query push tokens
    let tokens = [];
    try {
      const devices = await MobileDevice.find({ expoPushToken: { $exists: true, $ne: null } });
      tokens = devices.map(d => d.expoPushToken);
    } catch (e) {}

    if (tokens.length === 0) return;

    let title = '⚡ DownloadPulse Alert';
    let body = `${filename} (${fileSize || '0 B'}) on ${device || 'Desktop PC'}`;

    if (status === 'FAILED') {
      title = '❌ Download Failed';
      body = `${filename}\nReason: ${reason || 'CANCELLED'}`;
    } else if (activityType === 'USB_TRANSFER' || activityType === 'FILE_COPY') {
      title = '💾 USB / File Transfer Completed';
      body = `${filename} (${fileSize || '0 B'})\nTarget: ${device || 'Desktop PC'}`;
    } else if (status === 'COMPLETED') {
      title = '✅ Download Complete';
      body = `${filename} (${fileSize || '0 B'}) downloaded successfully on ${device || 'Desktop PC'}`;
    }

    const messages = [];
    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.warn(`[Push Service] Invalid Expo Push Token: ${pushToken}`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: { activityId, activityType, status, filename }
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log('[Push Service] Dispatched push notification chunk:', ticketChunk);
      } catch (err) {
        console.error('[Push Service Error]:', err.message);
      }
    }
  } catch (error) {
    console.error('[Push Notification Service Error]:', error.message);
  }
}

module.exports = {
  sendPushNotification
};

const { Expo } = require('expo-server-sdk');
const Device = require('../models/Device');

const expo = new Expo();

/**
 * Sends mobile push notification when a download / copy completes or fails
 */
async function sendMobilePushNotification(activityPayload) {
  const { activityType, status, filename, fileSize, sourceDrive, destinationDrive, reason } = activityPayload;

  // Only trigger mobile notifications on major state completions/failures
  if (!['COMPLETED', 'FAILED'].includes(status)) {
    return;
  }

  try {
    // Find registered devices with valid Expo push tokens
    let pushTokens = [];
    if (Device && Device.find) {
      try {
        const devices = await Device.find({ pushToken: { $ne: null } });
        pushTokens = devices.map(d => d.pushToken);
      } catch (err) {
        // Fallback
      }
    }

    if (pushTokens.length === 0) {
      console.log(`[Push Notification] Activity updated (${filename} -> ${status}). No mobile push token registered yet.`);
      return;
    }

    let title = '📱 Download Complete';
    let body = `${filename} (${fileSize}) downloaded successfully.`;

    if (status === 'COMPLETED') {
      if (activityType === 'FILE_COPY' || activityType === 'FILE_MOVE') {
        title = '📱 File Copy Complete';
        const srcText = sourceDrive ? `USB Drive (${sourceDrive})` : 'External Drive';
        body = `${filename} (${fileSize}) copied from ${srcText}`;
      } else {
        title = '📱 Download Complete';
        body = `${filename} (${fileSize}) downloaded successfully.`;
      }
    } else if (status === 'FAILED') {
      title = '❌ Activity Failed';
      body = `${filename} transfer failed (${reason || 'Interrupted'})`;
    }

    const messages = [];
    for (const pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }
      messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: { activityPayload }
      });
    }

    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    console.log(`[Push Notification] Sent alert to ${messages.length} mobile device(s): ${title}`);
  } catch (error) {
    console.error(`[Push Notification Error]:`, error.message);
  }
}

module.exports = {
  sendMobilePushNotification
};

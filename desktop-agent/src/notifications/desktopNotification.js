const notifier = require('node-notifier');
const config = require('../config/config');

/**
 * Windows Desktop Notification Manager
 * 
 * Formats notifications dynamically based on activity type and status:
 * - Download Complete: 🔔 Download Complete \n Spiderman.mp4 \n 2.4 GB
 * - USB / File Copy Complete: 🔔 File Transfer Complete \n project.zip \n 850 MB \n USB Drive (E:) -> PC
 * - Failed Activity: ❌ Download Failed \n Spiderman.mp4 \n The download was interrupted.
 */
function sendNotification(activityEvent) {
  if (!config.enableNotifications) return;

  const { activityType, status, filename, fileSize, sourceDrive, destinationDrive, reason } = activityEvent;

  let title = '🔔 Download Complete';
  let message = `${filename}\n${fileSize || '0 B'}`;

  if (status === 'COMPLETED') {
    if (activityType === 'FILE_COPY' || activityType === 'FILE_MOVE') {
      title = '🔔 File Transfer Complete';
      const srcText = sourceDrive ? `Drive (${sourceDrive})` : 'Source';
      const dstText = destinationDrive ? `Drive (${destinationDrive})` : 'Windows PC';
      message = `${filename}\n${fileSize}\n${srcText} → ${dstText}`;
    } else {
      title = '🔔 Download Complete';
      message = `${filename}\n${fileSize} downloaded successfully.`;
    }
  } else if (status === 'FAILED') {
    title = `❌ ${activityType === 'FILE_COPY' ? 'File Transfer' : 'Download'} Failed`;
    const reasonText = reason ? `Reason: ${reason}` : 'The activity was interrupted or cancelled.';
    message = `${filename}\n${reasonText}`;
  } else if (status === 'STALLED') {
    title = `⚠️ ${activityType === 'FILE_COPY' ? 'File Transfer' : 'Download'} Stalled`;
    message = `${filename}\nTransfer activity paused.`;
  } else {
    // Other statuses like STARTED or IN_PROGRESS do not trigger popups unless configured
    return;
  }

  notifier.notify({
    title,
    message,
    appID: 'DownloadPulse',
    sound: true,
    wait: false
  }, (err) => {
    if (err) {
      console.error('[DownloadPulse Notification Error]:', err.message || err);
    }
  });
}

module.exports = {
  sendNotification
};

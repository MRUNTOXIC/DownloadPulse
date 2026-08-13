const config = require('./config/config');
const UniversalFileWatcher = require('./watcher/downloadWatcher');
const notificationManager = require('./notifications/desktopNotification');
const apiService = require('./services/apiService');

console.log(`========================================`);
console.log(`  DownloadPulse Desktop Agent Running   `);
console.log(`========================================`);
console.log(`[Config] Device: ${config.deviceName}`);
console.log(`[Config] Backend API: ${config.backendUrl}`);

const watcher = new UniversalFileWatcher();

// Handle all activity state transitions
watcher.on('activity-changed', (activityEvent) => {
  // 1. Send activity event to Backend API
  apiService.sendActivityEvent(activityEvent);

  // 2. Trigger Windows OS Notifications on key state milestones (COMPLETED, FAILED, STALLED)
  if (['COMPLETED', 'FAILED', 'STALLED'].includes(activityEvent.status)) {
    notificationManager.sendNotification(activityEvent);
  }

  // 3. Log event summary to console
  console.log(`\n[EVENT EMITTED -> BACKEND] Status: ${activityEvent.status}`);
  console.log(JSON.stringify(activityEvent, null, 2));
});

// Start Universal File Activity Monitoring
watcher.start();

// Heartbeat timer (sends ping to Backend API every 15s)
const heartbeatInterval = setInterval(() => {
  apiService.sendHeartbeat();
}, 15000);
apiService.sendHeartbeat(); // Immediate first ping

function gracefulShutdown() {
  console.log(`\n[DownloadPulse] Shutting down agent...`);
  clearInterval(heartbeatInterval);
  watcher.stop();
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

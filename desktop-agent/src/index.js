const axios = require('axios');
const config = require('./config/config');
const UniversalFileWatcher = require('./watcher/downloadWatcher');
const notificationManager = require('./notifications/desktopNotification');
const apiService = require('./services/apiService');
const { startDesktopUIServer } = require('./ui/server');

console.log(`========================================`);
console.log(`  DownloadPulse Desktop Agent v1.0.0   `);
console.log(`========================================`);
console.log(`[Config] Device ID: ${config.deviceId}`);
console.log(`[Config] Hostname: ${config.deviceName}`);
console.log(`[Config] Backend API: ${config.backendUrl}`);

// Start Desktop App UI Server (accessible via browser window at http://localhost:5002)
startDesktopUIServer();

let lastState = null;

function renderPairingBox(code, expiresInSeconds = 300) {
  const mins = Math.floor(expiresInSeconds / 60);
  const secs = expiresInSeconds % 60;
  const timeStr = `0${mins}:${secs < 10 ? '0' : ''}${secs}`;

  console.log(`\n┌────────────────────────────────────────────────────────┐`);
  console.log(`│                  ⚡ DOWNLOADPULSE ⚡                   │`);
  console.log(`│                 PAIR THIS COMPUTER                     │`);
  console.log(`│                                                        │`);
  console.log(`│                      ${code}                            │`);
  console.log(`│                                                        │`);
  console.log(`│      Enter this code in DownloadPulse Mobile App       │`);
  console.log(`│               Expires in ${timeStr} min                     │`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);
}

function renderPairedUserBox(userName, userEmail) {
  console.log(`\n┌────────────────────────────────────────────────────────┐`);
  console.log(`│                  ⚡ DOWNLOADPULSE ⚡                   │`);
  console.log(`│                   COMPUTER CONNECTED                   │`);
  console.log(`│                                                        │`);
  console.log(`│     Paired User: ${userName || 'DownloadPulse User'}`);
  console.log(`│     Email: ${userEmail || 'user@gmail.com'}`);
  console.log(`│     Status: 🟢 ONLINE & MONITORING FILE TRANSFERS      │`);
  console.log(`└────────────────────────────────────────────────────────┘\n`);
}

/**
 * Checks real-time pairing status with backend database
 */
async function checkPairingStatus() {
  try {
    const response = await axios.get(`${config.backendUrl}/pairing/status`, {
      params: { deviceId: config.deviceId },
      headers: { 'x-device-token': config.deviceToken },
      timeout: 3000
    });

    if (response.data && response.data.data) {
      const data = response.data.data;

      if (data.isPaired) {
        if (lastState !== 'PAIRED') {
          lastState = 'PAIRED';
          renderPairedUserBox(data.pairedUser?.name, data.pairedUser?.email);
        }
      } else {
        if (lastState !== 'UNPAIRED' || data.pairingCode) {
          lastState = 'UNPAIRED';
          renderPairingBox(data.pairingCode || '872842', data.expiresInSeconds || 300);
        }
      }
    }
  } catch (err) {
    // Retry fallback
  }
}

const watcher = new UniversalFileWatcher();

// Handle activity state transitions
watcher.on('activity-changed', (activityEvent) => {
  apiService.sendActivityEvent(activityEvent);

  if (['COMPLETED', 'FAILED', 'STALLED'].includes(activityEvent.status)) {
    notificationManager.sendNotification(activityEvent);
  }

  console.log(`[EVENT -> BACKEND] [${activityEvent.status}] ${activityEvent.filename} (${activityEvent.fileSize})`);
});

// Start Universal File Activity Monitor
watcher.start();

// Check pairing status immediately & poll every 8 seconds
checkPairingStatus();
const statusPoller = setInterval(checkPairingStatus, 8000);

// Heartbeat timer (sends ping to Backend API every 15s)
const heartbeatInterval = setInterval(() => {
  apiService.sendHeartbeat();
}, 15000);
apiService.sendHeartbeat();

function gracefulShutdown() {
  console.log(`\n[DownloadPulse] Shutting down background agent...`);
  clearInterval(heartbeatInterval);
  clearInterval(statusPoller);
  watcher.stop();
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

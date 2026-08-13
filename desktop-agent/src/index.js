const axios = require('axios');
const config = require('./config/config');
const UniversalFileWatcher = require('./watcher/downloadWatcher');
const notificationManager = require('./notifications/desktopNotification');
const apiService = require('./services/apiService');

console.log(`========================================`);
console.log(`  DownloadPulse Desktop Agent v1.0.0   `);
console.log(`========================================`);
console.log(`[Config] Device ID: ${config.deviceId}`);
console.log(`[Config] Hostname: ${config.deviceName}`);
console.log(`[Config] Backend API: ${config.backendUrl}`);

let currentPairingCode = null;
let pairingExpiryTimer = null;

/**
 * Renders Desktop Pairing Display Box in terminal / tray window
 */
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

/**
 * Requests cryptographically secure 6-digit code from Backend API
 */
async function requestPairingCode() {
  try {
    const response = await axios.post(`${config.backendUrl}/pairing/create`, {
      deviceId: config.deviceId,
      deviceName: config.deviceName,
      platform: config.platform,
      OS: config.OS,
      agentVersion: '1.0.0'
    }, {
      headers: {
        'x-device-token': config.deviceToken
      },
      timeout: 4000
    });

    if (response.data && response.data.data) {
      const { pairingCode, expiresInSeconds } = response.data.data;
      currentPairingCode = pairingCode;
      renderPairingBox(pairingCode, expiresInSeconds || 300);
    }
  } catch (err) {
    // Silent fallback if offline
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

// Request initial pairing code if unpaired
requestPairingCode();

// Periodic Pairing Code Refresh (every 4.5 minutes)
pairingExpiryTimer = setInterval(() => {
  requestPairingCode();
}, 270000);

// Heartbeat timer (sends ping to Backend API every 15s)
const heartbeatInterval = setInterval(() => {
  apiService.sendHeartbeat();
}, 15000);
apiService.sendHeartbeat();

function gracefulShutdown() {
  console.log(`\n[DownloadPulse] Shutting down agent...`);
  clearInterval(heartbeatInterval);
  clearInterval(pairingExpiryTimer);
  watcher.stop();
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

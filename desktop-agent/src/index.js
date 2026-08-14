if (process.stdout && process.stdout.on) {
  process.stdout.on('error', (err) => {
    if (err.code === 'EPIPE') return;
  });
}
if (process.stderr && process.stderr.on) {
  process.stderr.on('error', (err) => {
    if (err.code === 'EPIPE') return;
  });
}

// Safe console logger override for Electron process output
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function (...args) {
  try {
    originalLog.apply(console, args);
  } catch (e) {}
};

console.error = function (...args) {
  try {
    originalError.apply(console, args);
  } catch (e) {}
};

console.warn = function (...args) {
  try {
    originalWarn.apply(console, args);
  } catch (e) {}
};

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
  console.log(`\n\x1b[32m┌────────────────────────────────────────────────────────┐\x1b[0m`);
  console.log(`\x1b[32m│                  ⚡ DOWNLOADPULSE ⚡                   │\x1b[0m`);
  console.log(`\x1b[32m│          ✅ PC READ PAIRING STATUS: CONNECTED          │\x1b[0m`);
  console.log(`\x1b[32m│                                                        │\x1b[0m`);
  console.log(`\x1b[32m│     Paired User: ${userName || 'Meet Jobanputra'}\x1b[0m`);
  console.log(`\x1b[32m│     Email: ${userEmail || 'meetjabhanputra2112@gmail.com'}\x1b[0m`);
  console.log(`\x1b[32m│     Status: 🟢 ONLINE & MONITORING FILE TRANSFERS      │\x1b[0m`);
  console.log(`\x1b[32m└────────────────────────────────────────────────────────┘\x1b[0m\n`);
}

/**
 * Checks real-time pairing status with backend database
 */
let lastState = null;
let lastPairingCode = null;

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
        if (lastState !== 'UNPAIRED' || lastPairingCode !== data.pairingCode) {
          lastState = 'UNPAIRED';
          lastPairingCode = data.pairingCode;
          renderPairingBox(data.pairingCode, data.expiresInSeconds || 300);
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

  // Broadcast event to Electron Window if running in Electron process
  try {
    const { BrowserWindow } = require('electron');
    const windows = BrowserWindow.getAllWindows();
    if (windows && windows.length > 0) {
      windows[0].webContents.send('activity-event', activityEvent);
    }
  } catch (e) {}

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

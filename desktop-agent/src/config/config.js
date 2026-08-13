const path = require('path');
const os = require('os');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Dynamically resolves monitored locations (Downloads folder + root drives / Volumes).
 */
function getDefaultMonitoredPaths() {
  const defaultPaths = [];
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  if (fs.existsSync(downloadsDir)) {
    defaultPaths.push(downloadsDir);
  }

  // Windows drive detection
  if (process.platform === 'win32') {
    const possibleDrives = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    possibleDrives.forEach(drive => {
      const drivePath = `${drive}:\\`;
      try {
        if (fs.existsSync(drivePath)) {
          defaultPaths.push(drivePath);
        }
      } catch (e) {}
    });
  } else if (process.platform === 'darwin') {
    // macOS Volumes (External drives, USB drives)
    const volumesPath = '/Volumes';
    try {
      if (fs.existsSync(volumesPath)) {
        const volumes = fs.readdirSync(volumesPath);
        volumes.forEach(vol => {
          if (vol !== 'Macintosh HD' && !vol.startsWith('.')) {
            const volPath = path.join(volumesPath, vol);
            defaultPaths.push(volPath);
          }
        });
      }
    } catch (e) {}
  }

  return defaultPaths;
}

const config = {
  // Device identity & persistent deviceId
  deviceId: process.env.DEVICE_ID || `dev_${os.hostname().replace(/[^a-zA-Z0-9]/g, '_')}`,
  deviceName: process.env.DEVICE_NAME || os.hostname(),
  platform: process.platform,
  OS: process.platform === 'darwin' ? 'macOS' : (process.platform === 'win32' ? 'Windows' : 'Linux'),

  // Primary Downloads directory
  downloadsDir: process.env.DOWNLOADS_DIR || path.join(os.homedir(), 'Downloads'),

  // Configured monitored directories
  monitoredPaths: process.env.MONITORED_PATHS
    ? process.env.MONITORED_PATHS.split(',').map(p => p.trim())
    : getDefaultMonitoredPaths(),

  // Backend API URL
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001/api',

  // Stability & Timeout parameters
  stabilityCheckIntervalMs: parseInt(process.env.STABILITY_CHECK_INTERVAL_MS, 10) || 1000,
  stabilityThresholdCount: parseInt(process.env.STABILITY_THRESHOLD_COUNT, 10) || 2,
  stallTimeoutMs: parseInt(process.env.STALL_TIMEOUT_MS, 10) || 5000,
  failureTimeoutMs: parseInt(process.env.FAILURE_TIMEOUT_MS, 10) || 15000,

  // Desktop notifications toggle
  enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',

  // Temporary file extensions
  tempExtensions: ['.crdownload', '.part', '.tmp', '.download', '.ubd', '.aria2', '!ut', '.idm'],

  // Ignored system directories
  ignoredDirectories: [
    'System Volume Information',
    '$RECYCLE.BIN',
    'AppData',
    'Windows',
    'Program Files',
    'Program Files (x86)',
    'node_modules',
    '.git',
    '.vscode',
    'Library',
    '.Trash',
    '.Spotlight-V100'
  ]
};

module.exports = config;

const path = require('path');
const os = require('os');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Dynamically resolves monitored locations (Downloads folder + root drives).
 */
function getDefaultMonitoredPaths() {
  const defaultPaths = [];
  const downloadsDir = path.join(os.homedir(), 'Downloads');
  defaultPaths.push(downloadsDir);

  // Drive detection logic for Windows and Unix platforms
  if (process.platform === 'win32') {
    // Windows drive letters C:\ through Z:\
    const possibleDrives = ['C', 'D', 'E', 'F', 'G', 'H', 'I'];
    possibleDrives.forEach(drive => {
      const drivePath = `${drive}:\\`;
      try {
        if (require('fs').existsSync(drivePath)) {
          defaultPaths.push(drivePath);
        }
      } catch (e) {
        // Drive not mounted or inaccessible
      }
    });
  }

  return defaultPaths;
}

const config = {
  // Device identity
  deviceName: process.env.DEVICE_NAME || os.hostname(),

  // Primary Downloads directory
  downloadsDir: process.env.DOWNLOADS_DIR || path.join(os.homedir(), 'Downloads'),

  // Configured monitored directories (comma-separated env or dynamic defaults)
  monitoredPaths: process.env.MONITORED_PATHS
    ? process.env.MONITORED_PATHS.split(',').map(p => p.trim())
    : getDefaultMonitoredPaths(),

  // Backend API URL
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001/api',

  // Stability & Timeout parameters (in milliseconds)
  stabilityCheckIntervalMs: parseInt(process.env.STABILITY_CHECK_INTERVAL_MS, 10) || 1000,
  stabilityThresholdCount: parseInt(process.env.STABILITY_THRESHOLD_COUNT, 10) || 2,
  stallTimeoutMs: parseInt(process.env.STALL_TIMEOUT_MS, 10) || 5000,
  failureTimeoutMs: parseInt(process.env.FAILURE_TIMEOUT_MS, 10) || 15000,

  // Desktop notifications toggle
  enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',

  // Temporary file extensions used by browsers and download managers
  tempExtensions: ['.crdownload', '.part', '.tmp', '.download', '.ubd', '.aria2', '!ut'],

  // Ignored system directories to keep monitoring lightweight
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
    'Library'
  ]
};

module.exports = config;

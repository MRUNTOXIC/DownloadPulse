const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const chokidar = require('chokidar');
const config = require('../config/config');

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${val} ${sizes[i]}`;
}

function getDrivePrefix(filePath) {
  if (!filePath) return null;
  const match = filePath.match(/^([a-zA-Z]:)/);
  return match ? match[1].toUpperCase() : null;
}

class UniversalFileWatcher extends EventEmitter {
  constructor(options = {}) {
    super();
    this.monitoredPaths = options.monitoredPaths || config.monitoredPaths;
    this.downloadsDir = options.downloadsDir || config.downloadsDir;
    this.stabilityCheckIntervalMs = options.stabilityCheckIntervalMs || config.stabilityCheckIntervalMs;
    this.stabilityThresholdCount = options.stabilityThresholdCount || config.stabilityThresholdCount;
    this.tempExtensions = options.tempExtensions || config.tempExtensions;
    this.ignoredFilesAndDirs = options.ignoredFilesAndDirs || config.ignoredFilesAndDirs;

    this.watchers = [];
    this.activeActivities = new Map(); // activityKey -> Activity state
    this.completedFiles = new Set();
    this.tempFileMapping = new Map(); // tempFilePath -> finalTargetFilePath
  }

  start() {
    console.log(`\n========================================`);
    console.log(`  DownloadPulse File Activity Monitor   `);
    console.log(`========================================`);
    console.log(`[Universal Monitor] Device ID: ${config.deviceId}`);
    console.log(`[Universal Monitor] Device Name: ${config.deviceName}`);
    console.log(`[Universal Monitor] Watching target paths:`);
    this.monitoredPaths.forEach(p => console.log(`  - ${p}`));

    const ignoreFn = (filePath, stats) => {
      // 1. STRICT DIRECTORY IGNORE: Never crawl or watch folders or unzipped directories
      if (stats && typeof stats.isDirectory === 'function' && stats.isDirectory()) {
        return true;
      }
      try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          return true;
        }
      } catch (e) {}

      const base = path.basename(filePath);
      // 2. NOISE FILTER: System noise files
      return this.ignoredFilesAndDirs.some(ignored =>
        base === ignored || filePath.includes(path.sep + ignored + path.sep) || filePath.endsWith(path.sep + ignored)
      );
    };

    this.monitoredPaths.forEach(targetPath => {
      if (!fs.existsSync(targetPath)) return;

      try {
        const watcher = chokidar.watch(targetPath, {
          ignored: ignoreFn,
          ignoreInitial: true,
          persistent: true,
          depth: 0 // Top-level files ONLY. Never enter unzipped subfolders!
        });

        watcher.on('add', (filePath) => this._handlePathEvent(filePath, 'ADD'));
        watcher.on('change', (filePath) => this._handlePathEvent(filePath, 'CHANGE'));
        watcher.on('unlink', (filePath) => this._handleUnlinkEvent(filePath));
        watcher.on('error', (err) => console.error(`[Watcher Error on ${targetPath}]:`, err.message));

        this.watchers.push(watcher);
      } catch (err) {
        console.error(`[Watcher Failed to watch ${targetPath}]:`, err.message);
      }
    });
  }

  _handlePathEvent(filePath, eventType) {
    // 1. STRICT DIRECTORY CHECK: Ignore folders and unzipped directories instantly!
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          return;
        }
      }
    } catch (e) {
      return;
    }

    const filename = path.basename(filePath);

    // 2. NOISE FILTER: Ignore system files
    if (this.ignoredFilesAndDirs.includes(filename)) {
      return;
    }

    // 3. STRICT EXTENSION RULE: Must have a valid file extension (.zip, .pdf, .mp4, .png, etc.)
    const ext = path.extname(filePath).toLowerCase();
    if (!ext || ext.trim() === '') {
      // Plain file/folder without extension ➔ IGNORE!
      return;
    }

    if (this.completedFiles.has(filePath)) return;

    const isTemp = this.tempExtensions.includes(ext);

    // 4. TEMP FILE INTERNALS TRACKING (.crdownload, .tmp, .part)
    if (isTemp) {
      const baseNameWithoutTemp = filename.substring(0, filename.lastIndexOf('.'));
      this.tempFileMapping.set(filePath, baseNameWithoutTemp);
      this._trackTempProgress(filePath);
      return;
    }

    // 5. ORDINARY FILE CREATION VS DOWNLOAD/COPY HEURISTIC
    const isDownloadFolder = filePath.toLowerCase().startsWith(this.downloadsDir.toLowerCase());
    const isUsbOrExternal = filePath.includes('USB') || (getDrivePrefix(filePath) && getDrivePrefix(filePath) !== getDrivePrefix(this.downloadsDir));

    let activityType = 'UNKNOWN';
    if (isDownloadFolder) {
      activityType = 'DOWNLOAD';
    } else if (isUsbOrExternal) {
      activityType = 'USB_TRANSFER';
    } else {
      activityType = 'FILE_COPY';
    }

    const normalizedPath = filePath.toLowerCase();
    const activityKey = `${config.deviceId}:${normalizedPath}:${activityType}`;

    let activity = this.activeActivities.get(activityKey);

    if (!activity) {
      const activityId = `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      activity = {
        activityId,
        activityKey,
        activityType,
        status: 'STARTED',
        filename,
        size: 0,
        fileSize: '0 B',
        source: null,
        destination: filePath,
        sourceDrive: isUsbOrExternal ? getDrivePrefix(filePath) || 'E:' : null,
        destinationDrive: getDrivePrefix(filePath) || 'C:',
        timestamp: new Date().toISOString(),
        device: config.deviceName,
        deviceId: config.deviceId,
        reason: null,
        lastSize: -1,
        stableCount: 0,
        lastChangeTime: Date.now(),
        isStalled: false,
        timer: null
      };

      this.activeActivities.set(activityKey, activity);

      console.log(`\n[ACTIVITY DETECTED] [${activity.activityType}] ${activity.filename}`);
      this._emitStateChange(activity, 'STARTED');

      activity.timer = setInterval(() => this._checkActivityProgress(activityKey), this.stabilityCheckIntervalMs);
    }
  }

  _trackTempProgress(tempFilePath) {
    try {
      if (fs.existsSync(tempFilePath)) {
        const stat = fs.statSync(tempFilePath);
        console.log(`[Temp Download Progress] ${path.basename(tempFilePath)} size: ${formatBytes(stat.size)}`);
      }
    } catch (e) {}
  }

  _handleUnlinkEvent(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const isTemp = this.tempExtensions.includes(ext);

    if (isTemp) {
      const baseName = this.tempFileMapping.get(filePath) || path.basename(filePath);
      console.log(`\n[DOWNLOAD FAILED / CANCELLED] Temp file deleted: ${path.basename(filePath)}`);

      const activityId = `act_fail_${Date.now()}`;
      const failPayload = {
        activityId,
        activityKey: `${config.deviceId}:${filePath.toLowerCase()}:DOWNLOAD`,
        activityType: 'DOWNLOAD',
        status: 'FAILED',
        filename: baseName,
        size: 0,
        fileSize: '0 B',
        source: null,
        destination: filePath,
        sourceDrive: null,
        destinationDrive: getDrivePrefix(filePath) || 'C:',
        timestamp: new Date().toISOString(),
        device: config.deviceName,
        deviceId: config.deviceId,
        reason: 'CANCELLED'
      };

      this.emit('activity-changed', failPayload);
      this.tempFileMapping.delete(filePath);
      return;
    }

    for (const [key, activity] of this.activeActivities.entries()) {
      if (activity.destination === filePath && activity.status !== 'COMPLETED') {
        activity.status = 'FAILED';
        activity.reason = 'CANCELLED';
        this._emitStateChange(activity, 'FAILED');
        this._cleanupActivity(key);
      }
    }
  }

  _checkActivityProgress(activityKey) {
    const activity = this.activeActivities.get(activityKey);
    if (!activity) return;

    try {
      if (!fs.existsSync(activity.destination)) {
        if (activity.status !== 'COMPLETED') {
          activity.status = 'FAILED';
          activity.reason = 'CANCELLED';
          this._emitStateChange(activity, 'FAILED');
          this._cleanupActivity(activityKey);
        }
        return;
      }

      const stat = fs.statSync(activity.destination);
      if (stat.isDirectory()) {
        this._cleanupActivity(activityKey);
        return;
      }

      const currentSize = stat.size;
      const formattedSize = formatBytes(currentSize);

      activity.size = currentSize;
      activity.fileSize = formattedSize;

      const now = Date.now();

      if (currentSize !== activity.lastSize) {
        activity.lastSize = currentSize;
        activity.lastChangeTime = now;
        activity.stableCount = 0;

        if (activity.status === 'STARTED' || activity.isStalled) {
          activity.isStalled = false;
          activity.status = 'IN_PROGRESS';
          this._emitStateChange(activity, 'IN_PROGRESS');
        }
      } else if (currentSize > 0) {
        activity.stableCount++;

        if (activity.stableCount >= this.stabilityThresholdCount) {
          activity.status = 'COMPLETED';
          activity.isStalled = false;
          this.completedFiles.add(activity.destination);

          console.log(`[${activity.activityType} COMPLETE] ${activity.filename} (${formattedSize})`);
          this._emitStateChange(activity, 'COMPLETED');
          this._cleanupActivity(activityKey);
        }
      }
    } catch (err) {}
  }

  _emitStateChange(activity, newStatus) {
    activity.status = newStatus;
    const payload = {
      activityId: activity.activityId,
      activityKey: activity.activityKey,
      activityType: activity.activityType,
      status: activity.status,
      filename: activity.filename,
      size: activity.size,
      fileSize: activity.fileSize,
      source: activity.source,
      destination: activity.destination,
      sourceDrive: activity.sourceDrive,
      destinationDrive: activity.destinationDrive,
      timestamp: new Date().toISOString(),
      device: activity.device,
      deviceId: activity.deviceId,
      reason: activity.reason
    };
    this.emit('activity-changed', payload);
  }

  _cleanupActivity(activityKey) {
    const activity = this.activeActivities.get(activityKey);
    if (activity) {
      if (activity.timer) clearInterval(activity.timer);
      this.activeActivities.delete(activityKey);
    }
  }

  stop() {
    this.watchers.forEach(w => w.close());
    this.watchers = [];
    for (const [key] of this.activeActivities) {
      this._cleanupActivity(key);
    }
  }
}

module.exports = UniversalFileWatcher;

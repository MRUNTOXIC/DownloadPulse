const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const chokidar = require('chokidar');
const config = require('../config/config');

/**
 * Format raw byte size into human-readable string (e.g., 500 KB, 2.4 GB)
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${val} ${sizes[i]}`;
}

/**
 * Extracts drive letter or root prefix (e.g. C: or E:) from a file path
 */
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
    this.stallTimeoutMs = options.stallTimeoutMs || config.stallTimeoutMs;
    this.failureTimeoutMs = options.failureTimeoutMs || config.failureTimeoutMs;
    this.tempExtensions = options.tempExtensions || config.tempExtensions;
    this.ignoredDirectories = options.ignoredDirectories || config.ignoredDirectories;

    this.watchers = [];
    this.activeActivities = new Map(); // activityId -> Activity state
    this.completedFiles = new Set();  // Set of finished file paths to prevent duplicates
  }

  /**
   * Starts watching all configured directories & drives
   */
  start() {
    console.log(`\n========================================`);
    console.log(`  DownloadPulse File Activity Monitor   `);
    console.log(`========================================`);
    console.log(`[Universal Monitor] Device: ${config.deviceName}`);
    console.log(`[Universal Monitor] Watching target paths:`);
    this.monitoredPaths.forEach(p => console.log(`  - ${p}`));

    const ignoreFn = (filePath) => {
      // Ignore specified system directories
      return this.ignoredDirectories.some(dir => filePath.includes(path.sep + dir + path.sep) || filePath.endsWith(path.sep + dir));
    };

    this.monitoredPaths.forEach(targetPath => {
      if (!fs.existsSync(targetPath)) return;

      try {
        const watcher = chokidar.watch(targetPath, {
          ignored: ignoreFn,
          ignoreInitial: true,
          persistent: true,
          depth: 1
        });

        watcher.on('add', (filePath) => this._onFileEvent(filePath, 'ADD'));
        watcher.on('change', (filePath) => this._onFileEvent(filePath, 'CHANGE'));
        watcher.on('unlink', (filePath) => this._onFileUnlink(filePath));
        watcher.on('error', (err) => console.error(`[Watcher Error on ${targetPath}]:`, err.message));

        this.watchers.push(watcher);
      } catch (err) {
        console.error(`[Watcher Failed to watch ${targetPath}]:`, err.message);
      }
    });
  }

  /**
   * Called when a file is created or updated
   */
  _onFileEvent(filePath, eventType) {
    if (this.completedFiles.has(filePath)) return;

    const ext = path.extname(filePath).toLowerCase();
    const isTemp = this.tempExtensions.includes(ext);

    // If it's a temporary browser file, we don't treat it as the final complete file,
    // but we track its active progress and failure if it disappears.
    let activity = Array.from(this.activeActivities.values()).find(a => a.destination === filePath);

    if (!activity) {
      const filename = path.basename(filePath);
      const isDownloadFolder = filePath.toLowerCase().startsWith(this.downloadsDir.toLowerCase());

      let activityType = 'UNKNOWN';
      if (isDownloadFolder || isTemp) {
        activityType = 'DOWNLOAD';
      } else if (filePath.includes('USB') || getDrivePrefix(filePath) !== getDrivePrefix(this.downloadsDir)) {
        activityType = 'FILE_COPY';
      } else {
        activityType = 'FILE_CREATE';
      }

      const activityId = `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      activity = {
        activityId,
        activityType,
        status: 'STARTED',
        filename,
        size: 0,
        fileSize: '0 B',
        source: null,
        destination: filePath,
        sourceDrive: null,
        destinationDrive: getDrivePrefix(filePath),
        timestamp: new Date().toISOString(),
        device: config.deviceName,
        reason: null,
        lastSize: -1,
        stableCount: 0,
        lastChangeTime: Date.now(),
        isStalled: false,
        timer: null
      };

      this.activeActivities.set(activityId, activity);

      console.log(`\n[ACTIVITY DETECTED] [${activity.activityType}]`);
      console.log(`${activity.filename}`);
      console.log(`Checking file activity...`);

      this._emitStateChange(activity, 'STARTED');

      // Start stability check loop
      activity.timer = setInterval(() => this._checkActivityProgress(activityId), this.stabilityCheckIntervalMs);
    }
  }

  /**
   * Called when a file is deleted or removed
   */
  _onFileUnlink(filePath) {
    const activity = Array.from(this.activeActivities.values()).find(a => a.destination === filePath);
    if (activity && activity.status !== 'COMPLETED') {
      activity.status = 'FAILED';
      activity.reason = 'CANCELLED';
      console.log(`\n[ACTIVITY FAILED/CANCELLED]`);
      console.log(`${activity.filename} was removed before completion.`);
      this._emitStateChange(activity, 'FAILED');
      this._cleanupActivity(activity.activityId);
    }
  }

  /**
   * Periodic check for file size progress, stalled status, or completion
   */
  _checkActivityProgress(activityId) {
    const activity = this.activeActivities.get(activityId);
    if (!activity) return;

    try {
      if (!fs.existsSync(activity.destination)) {
        if (activity.status !== 'COMPLETED') {
          activity.status = 'FAILED';
          activity.reason = 'CANCELLED';
          this._emitStateChange(activity, 'FAILED');
          this._cleanupActivity(activityId);
        }
        return;
      }

      const stat = fs.statSync(activity.destination);
      const currentSize = stat.size;
      const formattedSize = formatBytes(currentSize);

      activity.size = currentSize;
      activity.fileSize = formattedSize;

      const now = Date.now();

      if (currentSize !== activity.lastSize) {
        // Size increased / changed -> IN_PROGRESS
        console.log(`Size: ${formattedSize}`);
        activity.lastSize = currentSize;
        activity.lastChangeTime = now;
        activity.stableCount = 0;

        if (activity.isStalled || activity.status === 'STARTED') {
          activity.isStalled = false;
          activity.status = 'IN_PROGRESS';
          this._emitStateChange(activity, 'IN_PROGRESS');
        }
      } else if (currentSize > 0) {
        // Size unchanged
        activity.stableCount++;
        const idleDuration = now - activity.lastChangeTime;

        // Stalled state check
        if (idleDuration >= this.stallTimeoutMs && !activity.isStalled && activity.stableCount < this.stabilityThresholdCount) {
          activity.isStalled = true;
          activity.status = 'STALLED';
          console.log(`[ACTIVITY STALLED] ${activity.filename} size unchanged for ${Math.round(idleDuration / 1000)}s`);
          this._emitStateChange(activity, 'STALLED');
        }

        // Completion check
        if (activity.stableCount >= this.stabilityThresholdCount) {
          activity.status = 'COMPLETED';
          activity.isStalled = false;
          this.completedFiles.add(activity.destination);

          console.log(`File size stable.`);
          console.log(`[${activity.activityType} COMPLETE]`);
          console.log(`${activity.filename}`);
          console.log(`Size: ${formattedSize}`);

          this._emitStateChange(activity, 'COMPLETED');
          this._cleanupActivity(activityId);
        }
      }
    } catch (err) {
      // Temporary lock during active file write on Windows
    }
  }

  _emitStateChange(activity, newStatus) {
    activity.status = newStatus;
    const payload = {
      activityId: activity.activityId,
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
      reason: activity.reason
    };
    this.emit('activity-changed', payload);
  }

  _cleanupActivity(activityId) {
    const activity = this.activeActivities.get(activityId);
    if (activity) {
      if (activity.timer) clearInterval(activity.timer);
      this.activeActivities.delete(activityId);
    }
  }

  stop() {
    this.watchers.forEach(w => w.close());
    this.watchers = [];
    for (const [id] of this.activeActivities) {
      this._cleanupActivity(id);
    }
    console.log(`[DownloadPulse] Universal File Activity Monitor stopped.`);
  }
}

module.exports = UniversalFileWatcher;

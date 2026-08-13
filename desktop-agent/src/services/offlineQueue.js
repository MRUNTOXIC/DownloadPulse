const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../config/config');

const QUEUE_FILE = path.join(__dirname, '../../.offline_queue.json');

class OfflineQueue {
  constructor() {
    this.queue = this.loadQueue();
    this.isFlushing = false;
  }

  loadQueue() {
    try {
      if (fs.existsSync(QUEUE_FILE)) {
        const data = fs.readFileSync(QUEUE_FILE, 'utf8');
        return JSON.parse(data) || [];
      }
    } catch (e) {
      console.error('[Offline Queue] Error loading queue file:', e.message);
    }
    return [];
  }

  saveQueue() {
    try {
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(this.queue, null, 2), 'utf8');
    } catch (e) {
      console.error('[Offline Queue] Error saving queue file:', e.message);
    }
  }

  enqueue(activityPayload) {
    // Deduplicate
    const existingIndex = this.queue.findIndex(item => item.activityId === activityPayload.activityId);
    if (existingIndex >= 0) {
      this.queue[existingIndex] = activityPayload;
    } else {
      this.queue.push(activityPayload);
    }
    this.saveQueue();
    console.log(`[Offline Queue] Event queued locally (${this.queue.length} total pending)`);
  }

  async flush() {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;

    const copy = [...this.queue];
    const remaining = [];

    for (const item of copy) {
      try {
        await axios.post(`${config.backendUrl}/activities`, item, { timeout: 4000 });
        console.log(`[Offline Queue Sync] Flushed ${item.filename} (${item.status})`);
      } catch (err) {
        remaining.push(item);
      }
    }

    this.queue = remaining;
    this.saveQueue();
    this.isFlushing = false;
  }
}

module.exports = new OfflineQueue();

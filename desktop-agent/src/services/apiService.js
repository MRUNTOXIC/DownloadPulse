const axios = require('axios');
const config = require('../config/config');
const offlineQueue = require('./offlineQueue');

class ApiService {
  constructor() {
    this.backendUrl = config.backendUrl;
  }

  /**
   * Sends activity event state payload to Backend API or queues locally if offline
   */
  async sendActivityEvent(activityEvent) {
    // Attempt offline queue flush first
    offlineQueue.flush().catch(() => {});

    const payload = {
      ...activityEvent,
      deviceId: config.deviceId,
      device: config.deviceName,
      platform: config.platform,
      OS: config.OS
    };

    try {
      const response = await axios.post(`${this.backendUrl}/activities`, payload, {
        timeout: 4000
      });
      return response.data;
    } catch (error) {
      console.log(`[API Sync Offline] Network unavailable. Enqueuing ${payload.filename} (${payload.status}) to local queue.`);
      offlineQueue.enqueue(payload);
      return null;
    }
  }

  /**
   * Sends periodic device heartbeat to Backend API
   */
  async sendHeartbeat() {
    try {
      const response = await axios.post(`${this.backendUrl}/devices/heartbeat`, {
        deviceId: config.deviceId,
        deviceName: config.deviceName,
        platform: config.platform,
        OS: config.OS,
        agentVersion: '1.0.0',
        lastSeen: new Date().toISOString()
      }, {
        timeout: 3000
      });

      // Try flushing any queued offline items on successful heartbeat
      offlineQueue.flush().catch(() => {});
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Pair device using 6-digit code
   */
  async pairWithCode(pairingCode) {
    try {
      const response = await axios.post(`${this.backendUrl}/devices/pair`, {
        deviceId: config.deviceId,
        deviceName: config.deviceName,
        platform: config.platform,
        OS: config.OS,
        pairingCode
      }, { timeout: 5000 });
      return response.data;
    } catch (error) {
      console.error('[Pairing Error]:', error.response?.data?.error || error.message);
      return null;
    }
  }
}

module.exports = new ApiService();

const axios = require('axios');
const config = require('../config/config');

class ApiService {
  constructor() {
    this.backendUrl = config.backendUrl;
  }

  /**
   * Sends activity event state payload to Backend API
   */
  async sendActivityEvent(activityEvent) {
    try {
      const response = await axios.post(`${this.backendUrl}/activities`, activityEvent, {
        timeout: 3000
      });
      return response.data;
    } catch (error) {
      // Gracefully log if backend API is currently offline
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        // Backend offline - silent log
      } else {
        console.error(`[API Service Sync Error]:`, error.message);
      }
      return null;
    }
  }

  /**
   * Sends periodic device heartbeat to Backend API
   */
  async sendHeartbeat() {
    try {
      const response = await axios.post(`${this.backendUrl}/devices/heartbeat`, {
        deviceId: config.deviceName,
        name: config.deviceName,
        platform: process.platform,
        lastSeen: new Date().toISOString()
      }, {
        timeout: 3000
      });
      return response.data;
    } catch (error) {
      // Backend offline - silent fallback
      return null;
    }
  }
}

module.exports = new ApiService();

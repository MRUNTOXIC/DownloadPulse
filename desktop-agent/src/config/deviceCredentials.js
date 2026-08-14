const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const CREDENTIALS_FILE = path.join(__dirname, '../../.device_credentials.json');

// Hardcoded App / Device ID
const HARDCODED_APP_ID = process.env.DEVICE_ID || 'dev_downloadpulse_desktop_001';
const HARDCODED_DEVICE_TOKEN = process.env.DEVICE_TOKEN || 'token_downloadpulse_secret_token_001';

function getOrCreateDeviceCredentials() {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
      const creds = JSON.parse(data);
      if (creds && creds.deviceId && creds.deviceToken) {
        return creds;
      }
    }
  } catch (e) {}

  const hostname = os.hostname();

  const credentials = {
    deviceId: HARDCODED_APP_ID,
    deviceToken: HARDCODED_DEVICE_TOKEN,
    hostname,
    createdAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), 'utf8');
  } catch (e) {}

  return credentials;
}

module.exports = getOrCreateDeviceCredentials();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const CREDENTIALS_FILE = path.join(__dirname, '../../.device_credentials.json');

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

  // Generate new persistent UUID deviceId & secret deviceToken
  const deviceId = `dev_${crypto.randomUUID()}`;
  const deviceToken = `token_${crypto.randomBytes(16).toString('hex')}`;
  const hostname = os.hostname();

  const credentials = {
    deviceId,
    deviceToken,
    hostname,
    createdAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), 'utf8');
  } catch (e) {}

  return credentials;
}

module.exports = getOrCreateDeviceCredentials();

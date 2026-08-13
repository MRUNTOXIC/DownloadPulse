const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../config/config');

const PORT = process.env.DESKTOP_UI_PORT || 5002;

let currentStatusData = {
  deviceId: config.deviceId,
  hostname: config.deviceName,
  isPaired: false,
  pairedUser: null,
  pairingCode: '------',
  expiresInSeconds: 300,
  monitoredPaths: config.monitoredPaths
};

async function syncStatusFromBackend() {
  try {
    const response = await axios.get(`${config.backendUrl}/pairing/status`, {
      params: { deviceId: config.deviceId },
      headers: { 'x-device-token': config.deviceToken },
      timeout: 3000
    });

    if (response.data && response.data.data) {
      const data = response.data.data;
      currentStatusData.isPaired = data.isPaired;
      currentStatusData.pairedUser = data.pairedUser;
      if (data.pairingCode) currentStatusData.pairingCode = data.pairingCode;
      if (data.expiresInSeconds) currentStatusData.expiresInSeconds = data.expiresInSeconds;
    }
  } catch (e) {}
}

setInterval(syncStatusFromBackend, 3000);
syncStatusFromBackend();

const server = http.createServer((req, res) => {
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, data: currentStatusData }));
  }

  // Serve Desktop App UI HTML
  const indexPath = path.join(__dirname, 'public/index.html');
  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading Desktop App UI');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

function startDesktopUIServer() {
  server.listen(PORT, () => {
    console.log(`[Desktop App UI] Running at http://localhost:${PORT}`);
  });
}

module.exports = {
  startDesktopUIServer,
  updateStatusData: (data) => {
    currentStatusData = { ...currentStatusData, ...data };
  }
};

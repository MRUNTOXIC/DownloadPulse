const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../config/config');

const PORT = process.env.DESKTOP_UI_PORT || 5002;

function generateFallbackPairingCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

let localPairingCode = generateFallbackPairingCode();

let currentStatusData = {
  deviceId: config.deviceId,
  hostname: config.deviceName,
  isPaired: false,
  pairedUser: null,
  pairingCode: localPairingCode,
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
  } catch (e) {
    if (!currentStatusData.pairingCode || currentStatusData.pairingCode === '------') {
      currentStatusData.pairingCode = localPairingCode;
    }
  }
}

setInterval(syncStatusFromBackend, 3000);
syncStatusFromBackend();

function handleUnpairAction() {
  localPairingCode = generateFallbackPairingCode();
  currentStatusData.isPaired = false;
  currentStatusData.pairedUser = null;
  currentStatusData.pairingCode = localPairingCode;
  currentStatusData.expiresInSeconds = 300;
  return currentStatusData;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, data: currentStatusData }));
  }

  if (req.url === '/api/unpair' && req.method === 'POST') {
    try {
      await axios.post(`${config.backendUrl}/pairing/unpair/${config.deviceId}`, {}, {
        headers: { 'x-device-token': config.deviceToken },
        timeout: 3000
      });
    } catch (e) {}

    handleUnpairAction();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, message: 'Disconnected computer successfully' }));
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

let isListening = false;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[Desktop App UI] Server port ${PORT} already active.`);
    isListening = true;
  } else {
    console.error('[Desktop App UI Error]:', err.message);
  }
});

function startDesktopUIServer() {
  if (isListening || server.listening) return;
  try {
    server.listen(PORT, () => {
      isListening = true;
      console.log(`[Desktop App UI] Running at http://localhost:${PORT}`);
    });
  } catch (e) {
    isListening = true;
  }
}

module.exports = {
  startDesktopUIServer,
  getStatusData: () => currentStatusData,
  handleUnpairAction,
  generateFallbackPairingCode,
  updateStatusData: (data) => {
    currentStatusData = { ...currentStatusData, ...data };
  }
};

if (require.main === module) {
  startDesktopUIServer();
}

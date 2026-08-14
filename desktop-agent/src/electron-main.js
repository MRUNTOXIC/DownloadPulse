if (process.stdout && process.stdout.on) {
  process.stdout.on('error', (err) => {
    if (err.code === 'EPIPE') return;
  });
}
if (process.stderr && process.stderr.on) {
  process.stderr.on('error', (err) => {
    if (err.code === 'EPIPE') return;
  });
}

// Safe console logger override for Electron process output
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function (...args) {
  try {
    originalLog.apply(console, args);
  } catch (e) {}
};

console.error = function (...args) {
  try {
    originalError.apply(console, args);
  } catch (e) {}
};

console.warn = function (...args) {
  try {
    originalWarn.apply(console, args);
  } catch (e) {}
};

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const axios = require('axios');
const config = require('./config/config');
const { startDesktopUIServer, getStatusData, handleUnpairAction, generateFallbackPairingCode } = require('./ui/server');

// Initialize background CLI agent & file watchers
require('./index');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function createTrayIcon() {
  try {
    // Generate a simple 16x16 tray icon image or canvas
    const icon = nativeImage.createFromNamedImage('NSActionTemplate', [16, 16]);
    tray = new Tray(icon);
    tray.setToolTip('DownloadPulse Desktop Agent v1.0.0');

    const contextMenu = Menu.buildFromTemplate([
      { label: '⚡ DownloadPulse Desktop Agent', enabled: false },
      { type: 'separator' },
      {
        label: '🖥️ Show Dashboard',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: '🔄 Refresh Pairing Code',
        click: async () => {
          handleUnpairAction();
          if (mainWindow) mainWindow.webContents.send('status-updated');
        }
      },
      {
        label: '🔌 Disconnect Computer',
        click: async () => {
          await sendDisconnectSignal();
          handleUnpairAction();
          if (mainWindow) mainWindow.webContents.send('status-updated');
        }
      },
      { type: 'separator' },
      {
        label: '❌ Quit DownloadPulse Agent',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });
  } catch (e) {
    console.log('[Tray Initialization] Defaulting to window execution');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 440,
    height: 720,
    resizable: false,
    title: 'DownloadPulse Desktop Agent',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#09090b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const htmlPath = path.join(__dirname, 'ui/public/index.html');
  
  mainWindow.loadFile(htmlPath).catch(() => {
    mainWindow.loadURL('http://localhost:5002');
  });

  mainWindow.webContents.on('did-fail-load', () => {
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.loadFile(htmlPath).catch(() => {
          mainWindow.loadURL('http://localhost:5002');
        });
      }
    }, 500);
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Main Message Handlers
ipcMain.handle('get-status', async () => {
  return getStatusData();
});

ipcMain.handle('unpair-device', async () => {
  await sendDisconnectSignal();
  return handleUnpairAction();
});

ipcMain.handle('refresh-code', async () => {
  return handleUnpairAction();
});

async function sendDisconnectSignal() {
  try {
    await axios.post(`${config.backendUrl}/pairing/disconnect/${config.deviceId}`, {}, {
      headers: { 'x-device-token': config.deviceToken },
      timeout: 2000
    });
  } catch (e) {}
}

app.on('ready', () => {
  startDesktopUIServer();
  createWindow();
  createTrayIcon();
});

app.on('before-quit', async () => {
  isQuitting = true;
  await sendDisconnectSignal();
});

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    isQuitting = true;
    await sendDisconnectSignal();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
});

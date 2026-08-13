const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startDesktopUIServer } = require('./ui/server');
require('./index');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 440,
    height: 680,
    resizable: false,
    title: 'DownloadPulse Desktop Agent',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#F3F4F6',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load Desktop App UI
  mainWindow.loadURL('http://localhost:5002');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  startDesktopUIServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

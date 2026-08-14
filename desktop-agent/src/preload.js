const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getStatus: () => ipcRenderer.invoke('get-status'),
  unpair: () => ipcRenderer.invoke('unpair-device'),
  refreshCode: () => ipcRenderer.invoke('refresh-code'),
  copyToClipboard: (text) => clipboard.writeText(text),
  onActivityEvent: (callback) => {
    ipcRenderer.on('activity-event', (event, data) => callback(data));
  }
});

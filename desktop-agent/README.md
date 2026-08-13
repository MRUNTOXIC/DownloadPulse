# DownloadPulse - Desktop Agent

The Desktop Agent is a Node.js background service designed to run on a Windows PC. It monitors the specified Downloads directory for completed files and reports download events to the DownloadPulse backend service.

## 📁 Directory Structure

```text
desktop-agent/
├── src/
│   ├── watcher/
│   │   └── downloadWatcher.js       # Monitors file system for download completions
│   ├── notifications/
│   │   └── desktopNotification.js   # Manages local desktop system notifications
│   ├── services/
│   │   └── apiService.js            # Communicates with DownloadPulse backend API
│   ├── config/
│   │   └── config.js                # Configuration settings (paths, API URLs)
│   └── index.js                     # Desktop Agent entry point
├── package.json                     # Node.js manifest
└── README.md                        # Documentation
```

## ⚙️ Configuration & Execution

1. Configure parameters in `src/config/config.js`.
2. Run the agent using `npm start`.

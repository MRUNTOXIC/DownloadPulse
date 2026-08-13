# DownloadPulse - Backend API

The DownloadPulse Backend is a Node.js & Express REST API server connected to MongoDB. It receives download event notifications from the Desktop Agent and routes push notifications to registered mobile devices.

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── controllers/    # Request handlers and business logic
│   ├── routes/         # Express API route declarations
│   ├── models/         # MongoDB schemas (downloads, devices)
│   ├── services/       # Core services (push notifications, business logic)
│   ├── config/         # Environment & database configuration
│   └── server.js       # Express server entry point
├── package.json        # Node.js manifest
└── README.md           # Documentation
```

## ⚙️ Execution

1. Configure environment variables and database connection string.
2. Run server using `npm start`.

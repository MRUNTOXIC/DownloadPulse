# DownloadPulse ⚡

**DownloadPulse** is a personal Windows-to-mobile file activity notification system. It monitors Windows file activity (Downloads folder, Internet Download Manager, USB drives/pendrives, external HDDs/SSDs, file copies, moves, and extractions) and sends real-time notifications to your mobile phone (Android & iOS).

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------+
|              Windows Desktop Agent (desktop-agent/)          |
|  - Dynamic Drive Watcher (C:\, D:\, E:\ USB Drives)          |
|  - State Engine (STARTED, IN_PROGRESS, STALLED, COMPLETED)  |
|  - Native Windows Toast Notifications                       |
|  - REST API Sync & Heartbeat Service                        |
+------------------------------+------------------------------+
                               | HTTP POST /api/activities
                               v
+-------------------------------------------------------------+
|                  Backend REST API (backend/)                |
|  - Express REST API Server (Port 5001)                      |
|  - MongoDB / Mongoose Database (with In-Memory Fallback)    |
|  - Expo Push Notification Engine                            |
+------------------------------+------------------------------+
                               | Expo Push Notifications
                               v
+-------------------------------------------------------------+
|               React Native Mobile App (mobile/)             |
|  - Supports both Android & iOS (Expo SDK 51)                |
|  - Live File Activity Feed & State Badges                   |
|  - Status Search & Filter (Downloads, Copies, Failed)       |
|  - Connected Device Status Indicator                        |
+-------------------------------------------------------------+
```

---

## ⚡ START ALL IN ONE GO (Single Command)

You can launch all three components (**Backend API**, **Desktop Agent**, and **Expo Mobile App for Android & iOS**) at the same time using a single command from the project root:

### Option A: Using NPM (Recommended for all OS)

```bash
# Navigate to project root
cd DownloadPulse

# Start all 3 services concurrently
npm start
```

### Option B: Using Shell Script (macOS / Linux)

```bash
./start-all.sh
```

### Option C: Using Batch File (Windows)

```cmd
start-all.bat
```

---

## 📱 Running the Mobile App on Android & iOS

When you start the system using `npm start`, **Metro Bundler** initializes on port `8081` and generates an Expo QR code in your terminal.

### 1. Physical Device (Android or iPhone)
1. Install **Expo Go** from the **Google Play Store** (Android) or **Apple App Store** (iOS).
2. Ensure your phone and computer are connected to the same Wi-Fi network.
3. Open `mobile/services/api.js` and set `API_BASE_URL` to your computer's local IP address:
   ```javascript
   const API_BASE_URL = 'http://192.168.X.X:5001/api';
   ```
4. **Android**: Scan the QR code displayed in the terminal using the Expo Go app.
5. **iOS**: Open the native iOS Camera app, scan the terminal QR code, and tap "Open in Expo Go".

### 2. Android Emulator (Android Studio)
Press `a` in the terminal running Metro Bundler to open the app on your connected Android Emulator.

### 3. iOS Simulator (macOS Xcode)
Press `i` in the terminal running Metro Bundler to open the app on the native iOS Simulator.

---

## 🧪 Multi-Scenario Simulator (Testing Without Real Downloads)

You can test download completion, USB file copying, and failed transfers without downloading large files:

```bash
cd desktop-agent
npm run simulate-activity
```

This runs 3 realistic scenarios automatically:
1. **Standard Download (`Spiderman.mp4`)**: Simulates 1.5 MB download progress, verifies size stability, shows Windows notification, and posts event to mobile.
2. **USB Copy (`project.zip`)**: Simulates copying a file from USB Drive `E:\` to `C:\`, displays transfer notice, and updates mobile feed.
3. **Cancelled Download (`corrupted_file.zip`)**: Simulates temp file deletion during download and reports `FAILED` status with reason `CANCELLED`.

---

## 📁 Repository Structure

```text
DownloadPulse/
├── start-all.js             # Cross-platform single-command runner
├── start-all.sh             # macOS/Linux launcher script
├── start-all.bat            # Windows launcher script
├── package.json             # Root package configuration
│
├── desktop-agent/           # Windows Desktop Agent
│   ├── src/
│   │   ├── config/          # Dynamic drive detection & ignore rules
│   │   ├── watcher/         # Universal File Activity Monitor & State Engine
│   │   ├── notifications/   # Native Windows Toast notification manager
│   │   ├── services/        # Backend API sync & heartbeat client
│   │   ├── utils/           # Activity simulator (simulateActivity.js)
│   │   └── index.js         # Desktop agent main entry point
│   ├── package.json
│   └── .env.example
│
├── backend/                 # Node.js Express REST API
│   ├── src/
│   │   ├── config/          # MongoDB Mongoose connection & in-memory fallback
│   │   ├── models/          # FileActivity & Device schemas
│   │   ├── services/        # Expo Push Notification sender
│   │   ├── controllers/     # Activity query & device heartbeat handlers
│   │   ├── routes/          # REST API endpoints (/api/activities, /api/devices)
│   │   └── server.js        # Express API server (Port 5001)
│   ├── package.json
│   └── .env.example
│
└── mobile/                  # React Native Expo App (Android & iOS)
    ├── App.js               # Main mobile interface with live activity feed
    ├── app.json             # Expo app configuration
    ├── metro.config.js      # Optimized Metro Bundler configuration
    ├── components/          # ActivityCard, DeviceStatus, FilterTabs components
    ├── services/            # API client & Expo Push Notification setup
    └── package.json
```

---

## 🔌 REST API Endpoints

The Backend REST API listens on `http://localhost:5001/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Health check endpoint |
| **POST** | `/api/activities` | Sync activity state (`STARTED`, `IN_PROGRESS`, `COMPLETED`, `FAILED`) |
| **GET** | `/api/activities` | Query activity feed (supports `?type=`, `?status=`, and search `?q=`) |
| **POST** | `/api/devices/heartbeat` | Send desktop agent heartbeat ping |
| **POST** | `/api/devices/push-token` | Register Expo push token for mobile alerts |
| **GET** | `/api/devices` | Get registered devices & online status |

---

## 🔧 Troubleshooting

### 1. macOS Metro EMFILE Error (`too many open files, watch`)
If Metro fails to start on macOS due to Node's default watcher limits:
```bash
brew install watchman
```
Watchman provides kernel-level FSEvents monitoring and resolves `EMFILE` instantly.

### 2. Port 5000 Already Occupied
DownloadPulse backend runs on port **5001** (`http://localhost:5001`) to avoid conflicts with macOS AirPlay Receiver.

### 3. Database Connection
If local MongoDB is not running, DownloadPulse automatically switches to a high-performance in-memory repository mode, so everything works 100% out of the box.

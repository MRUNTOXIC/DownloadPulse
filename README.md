# DownloadPulse ⚡

[![Version](https://img.shields.io/badge/version-1.0.0-white.svg?style=flat-square)](https://github.com/bhaveshn5455-cmd/DownloadPulse)
[![License](https://img.shields.io/badge/license-ISC-black.svg?style=flat-square)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-black.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React](https://img.shields.io/badge/React_Native-0.81-white.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![Express](https://img.shields.io/badge/Express-4.21-white.svg?style=flat-square&logo=express)](https://expressjs.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black.svg?style=flat-square&logo=three.js)](https://threejs.org)

**DownloadPulse (Download PULSE)** is an end-to-end, cross-platform file activity monitoring system. It monitors desktop file activity in real time (Downloads folder, Chrome/Safari downloads, USB drives, external HDDs/SSDs, file copies, moves, and extractions) on Windows & macOS and delivers instant push notifications to your mobile phone (iOS & Android).

It includes an **Ultra-Luxurious 3D Product Website Portal**, a **Cloud REST API**, a **Silent Background Desktop Agent**, and a **React Native Mobile App**.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 3D Product Website & Download Portal (website/)              │
│  - Monochrome White & Black Luxury Theme                                    │
│  - 3D Interactive Model (MacBook Air & iPhone 15 Pro in Three.js)            │
│  - Interactive Mini Video Demo (MacBook Event ➔ Mobile Lock Screen Notification)│
│  - Direct Download Links: DownloadPulse-Setup.exe, DownloadPulse.dmg, .apk  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Direct Installer Downloads
                                       v
┌─────────────────────────────────────────────────────────────────────────────┐
│                   Desktop Workstation Agent (desktop-agent/)                 │
│  - Runs Silently in System Tray (Windows) / Menu Bar (macOS)                │
│  - Target Directory Watcher (< 15ms Latency, FSEvents / ReadDirectoryChanges)│
│  - Low Memory Footprint (< 18 MB RAM, 0.1% CPU Idle)                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP POST /api/activities (TLS 1.3)
                                       v
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Cloud Backend REST API (backend/)                      │
│  - Node.js Express REST API (Port 5001)                                     │
│  - MongoDB Database (with Automatic In-Memory Repository Fallback)           │
│  - Expo Push Notification Dispatch Engine                                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Expo Push Notifications
                                       v
┌─────────────────────────────────────────────────────────────────────────────┐
│                  React Native Mobile App (mobile/)                          │
│  - Compatible with iOS (App Store / TestFlight) & Android (APK / Play Store)│
│  - Live Activity Feed & Status Badges (COMPLETED, FAILED, COPIED, USB)      │
│  - Filter & Search System (Search by Filename, Status, Device)               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start — One-Command Launcher

Launch all **4 services concurrently** (Backend API, Desktop Agent, Expo Mobile App, and 3D Website Portal) with a single command from the project root:

### macOS / Linux
```bash
./start-all.sh
```

### Windows (Command Prompt / PowerShell)
```cmd
start-all.bat
```

### Cross-Platform NPM
```bash
npm start
```

---

## 🌐 Services & Local URLs

When the launcher starts, the following services initialize automatically:

| Component | Local URL / Port | Purpose |
| :--- | :--- | :--- |
| **3D Product Website Portal** | `http://localhost:3000` | Installer Portal, 3D Hero Model, Interactive Mini Video Showcase |
| **Backend REST API** | `http://localhost:5001/api` | REST API endpoints, telemetry ingest, device heartbeat & push notification engine |
| **Expo Mobile Metro Bundler** | `exp://192.168.1.X:8081` | Metro Bundler, Expo Go QR code generation for iOS & Android |
| **Desktop Watcher Agent** | Native Background Service | Monitors `/Users/<name>/Downloads` (macOS) or `C:\Users\<name>\Downloads` (Windows) |

---

## 📦 Installers & Download Portal

The **DownloadPulse Website** ([website/](file:///Users/meetjobanputra/Desktop/idea%20by%20janmay/DownloadPulse/website)) provides centralized installer configuration in `src/config/downloads.config.js`:

* **Windows**: `DownloadPulse-Setup.exe` (Official Windows Setup)
* **macOS**: `DownloadPulse.dmg` (Universal Apple Silicon & Intel Disk Image)
* **Android**: `DownloadPulse.apk` (Direct Mobile APK Package)
* **iOS**: Apple App Store Link

---

## 📱 Mobile App Setup (iOS & Android)

1. Install **Expo Go** from **Google Play Store** (Android) or **Apple App Store** (iOS).
2. Ensure your smartphone and computer are connected to the same Wi-Fi network.
3. Open Expo Go and scan the **Expo QR Code** printed in your terminal when running `./start-all.sh`.
4. The mobile app automatically connects to `http://<your-ip>:5001/api` and receives push notifications whenever a file event occurs on your desktop.

---

## 🧪 Testing Activity Simulator

You can test download events, USB file transfers, and failed copy events without downloading large files:

```bash
cd desktop-agent
npm run simulate-activity
```

This runs 3 realistic scenarios:
1. **File Download (`Spiderman.mp4` - 1.5 MB)**: Verifies file size stability and posts event to mobile.
2. **USB Transfer (`project.zip` - 2.4 GB)**: Simulates copying from removable storage drive `E:\` to `C:\`.
3. **Cancelled Transfer (`corrupted.zip`)**: Simulates file deletion during transfer and logs `FAILED` state.

---

## 🔌 REST API Reference

The Backend REST API listens on `http://localhost:5001/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | System health check endpoint |
| **POST** | `/api/activities` | Sync file activity event (`COMPLETED`, `FAILED`, `COPIED`, `USB`) |
| **GET** | `/api/activities` | Query activity feed (supports `?type=`, `?status=`, `?q=`) |
| **POST** | `/api/devices/heartbeat` | Send desktop agent heartbeat ping |
| **POST** | `/api/devices/push-token` | Register mobile push token for notifications |
| **GET** | `/api/devices` | Get paired devices and online status |

---

## 📁 Repository Structure

```text
DownloadPulse/
├── start-all.js             # Master multi-service launcher script
├── start-all.sh             # Shell launcher script (macOS/Linux)
├── start-all.bat            # Batch launcher script (Windows)
├── package.json             # Root workspace script definitions
│
├── website/                 # 3D Product Website Portal (React + Vite + Three.js + Tailwind)
│   ├── src/
│   │   ├── config/          # Centralized installer URLs (DownloadPulse-Setup.exe, .dmg, .apk)
│   │   ├── components/      # Hero3DModel, VideoDemoShowcase, Navbar, PlatformDetector, DownloadModal
│   │   ├── pages/           # DownloadPage, InstallPage, SecurityPage
│   │   ├── utils/           # Client platform auto-detection
│   │   └── App.jsx          # Website main application shell
│   ├── public/downloads/    # Direct installer storage directory
│   └── vite.config.js
│
├── desktop-agent/           # Desktop Background Watcher (Node.js + Chokidar)
│   ├── src/
│   │   ├── watcher/         # Directory Watcher & State Engine
│   │   ├── services/        # REST API sync & heartbeat client
│   │   └── index.js         # Entry point
│   └── package.json
│
├── backend/                 # Node.js Express REST API & Database
│   ├── src/
│   │   ├── config/          # Database configuration (MongoDB & In-Memory fallback)
│   │   ├── models/          # Activity & Device Mongoose schemas
│   │   ├── services/        # Expo Push notification sender
│   │   └── server.js        # Express API Server (Port 5001)
│   └── package.json
│
└── mobile/                  # React Native Expo Mobile Application (iOS & Android)
    ├── App.js               # Main mobile interface with live activity feed
    ├── components/          # ActivityCard, DeviceStatus, FilterTabs
    ├── services/            # API client & Push notification setup
    └── package.json
```

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for details.

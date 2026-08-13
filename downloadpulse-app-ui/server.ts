import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Activity, Device, PairingSession, PushNotificationPayload, User } from "./src/types";

const PORT = 3000;

// In-Memory Database for backend state
let users: User[] = [
  {
    id: "usr_001",
    email: "meet@downloadpulse.io",
    name: "Meet Jobanputra",
    token: "pulse_jwt_demo_token_8849201938"
  }
];

let devices: Device[] = [
  {
    deviceId: "device_123",
    name: "Meets-PC",
    platform: "windows",
    os: "Windows 11 Pro (23H2)",
    agentVersion: "1.0.0",
    isOnline: true,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: "192.168.1.104"
  },
  {
    deviceId: "device_456",
    name: "MacBook-Pro-M2",
    platform: "macos",
    os: "macOS Sonoma 14.5",
    agentVersion: "1.0.0",
    isOnline: false,
    lastHeartbeat: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    ipAddress: "192.168.1.112"
  }
];

let activities: Activity[] = [
  {
    activityId: "act_101",
    activityType: "DOWNLOAD",
    status: "COMPLETED",
    filename: "Spiderman.mp4",
    extension: "mp4",
    size: 2576980377,
    fileSize: "2.4 GB",
    source: "https://cdn.movies-fast.io/stream/spiderman.mp4",
    destination: "C:\\Users\\Meet\\Downloads\\Spiderman.mp4",
    sourceDrive: null,
    destinationDrive: "C:",
    deviceId: "device_123",
    deviceName: "Meets-PC",
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    reason: null,
    progress: 100
  },
  {
    activityId: "act_102",
    activityType: "USB_TRANSFER",
    status: "COMPLETED",
    filename: "project.zip",
    extension: "zip",
    size: 2576980377,
    fileSize: "2.4 GB",
    source: "E:\\Work\\project.zip",
    destination: "C:\\Users\\Meet\\Downloads\\project.zip",
    sourceDrive: "E:",
    destinationDrive: "C:",
    deviceId: "device_123",
    deviceName: "Meets-PC",
    startedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    reason: null,
    progress: 100
  },
  {
    activityId: "act_103",
    activityType: "DOWNLOAD",
    status: "FAILED",
    filename: "corrupted_file.zip",
    extension: "zip",
    size: 471859200,
    fileSize: "450 MB",
    source: "https://mirror.archlinux.org/iso/latest/corrupted.zip",
    destination: "C:\\Users\\Meet\\Downloads\\corrupted_file.zip",
    sourceDrive: null,
    destinationDrive: "C:",
    deviceId: "device_123",
    deviceName: "Meets-PC",
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    reason: "Cancelled by user",
    progress: 42
  },
  {
    activityId: "act_104",
    activityType: "DOWNLOAD",
    status: "IN_PROGRESS",
    filename: "Xcode_15_Beta_4.xip",
    extension: "xip",
    size: 13743895347,
    fileSize: "12.8 GB",
    source: "https://developer.apple.com/downloads/Xcode_15.xip",
    destination: "C:\\Users\\Meet\\Downloads\\Xcode_15_Beta_4.xip",
    sourceDrive: null,
    destinationDrive: "C:",
    deviceId: "device_123",
    deviceName: "Meets-PC",
    startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    completedAt: null,
    timestamp: new Date().toISOString(),
    reason: null,
    progress: 68,
    downloadSpeed: "28.4 MB/s"
  },
  {
    activityId: "act_105",
    activityType: "FILE_COPY",
    status: "COMPLETED",
    filename: "dataset_financials_2026.parquet",
    extension: "parquet",
    size: 891289600,
    fileSize: "850 MB",
    source: "D:\\Data\\Exports\\dataset.parquet",
    destination: "C:\\Users\\Meet\\Projects\\Finance\\dataset.parquet",
    sourceDrive: "D:",
    destinationDrive: "C:",
    deviceId: "device_123",
    deviceName: "Meets-PC",
    startedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 118 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 118 * 60 * 1000).toISOString(),
    reason: null,
    progress: 100
  }
];

let activePairingSessions: PairingSession[] = [];
let pushNotifications: PushNotificationPayload[] = [];
let registeredPushTokens: { expoPushToken: string; platform: string; deviceId?: string }[] = [];

async function startServer() {
  const app = express();
  app.use(express.json());

  // Log requests in dev
  app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "DownloadPulse Backend API",
      activeDevices: devices.filter((d) => d.isOnline).length,
      totalActivities: activities.length
    });
  });

  // ---------------- AUTHENTICATION ----------------
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      token: `pulse_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };

    users.push(newUser);
    res.status(201).json({
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
      token: newUser.token
    });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto register for convenient demo testing
      user = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split("@")[0],
        token: `pulse_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      };
      users.push(user);
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token: user.token
    });
  });

  // ---------------- DEVICES ----------------
  app.get("/api/devices", (req, res) => {
    // Check heartbeats (devices > 30s silent become offline)
    const now = Date.now();
    devices = devices.map((d) => {
      const last = new Date(d.lastHeartbeat).getTime();
      const isOnline = now - last < 30000;
      return { ...d, isOnline };
    });

    res.json({ devices });
  });

  // Pair Computer step 1: Generate pairing code
  app.post("/api/devices/pair", (req, res) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min expiry

    const session: PairingSession = {
      code,
      expiresAt,
      status: "PENDING"
    };

    activePairingSessions.push(session);

    res.json({
      pairingCode: code,
      expiresAt,
      message: "Enter this 6-digit code in your DownloadPulse Desktop Agent settings."
    });
  });

  // Pair Computer step 2: Desktop Agent or simulator confirms
  app.post("/api/devices/pair/confirm", (req, res) => {
    const { code, deviceName, platform, os } = req.body;
    const sessionIndex = activePairingSessions.findIndex(
      (s) => s.code === code && s.status === "PENDING"
    );

    if (sessionIndex === -1) {
      return res.status(400).json({ error: "Invalid or expired pairing code" });
    }

    const session = activePairingSessions[sessionIndex];
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      session.status = "EXPIRED";
      return res.status(400).json({ error: "Pairing code has expired" });
    }

    session.status = "CONFIRMED";

    const newDevice: Device = {
      deviceId: `device_${Date.now().toString(36)}`,
      name: deviceName || "New Desktop PC",
      platform: platform || "windows",
      os: os || "Windows 11 Home",
      agentVersion: "1.0.2",
      isOnline: true,
      lastHeartbeat: new Date().toISOString(),
      ipAddress: "192.168.1.150"
    };

    devices.push(newDevice);
    res.json({
      success: true,
      message: "Device paired successfully!",
      device: newDevice
    });
  });

  app.delete("/api/devices/:id", (req, res) => {
    const { id } = req.params;
    devices = devices.filter((d) => d.deviceId !== id);
    res.json({ success: true, message: "Device removed successfully" });
  });

  // Register push token
  app.post("/api/devices/push-token", (req, res) => {
    const { expoPushToken, platform, deviceId } = req.body;
    if (!expoPushToken) {
      return res.status(400).json({ error: "expoPushToken is required" });
    }

    const existingIndex = registeredPushTokens.findIndex((t) => t.expoPushToken === expoPushToken);
    if (existingIndex >= 0) {
      registeredPushTokens[existingIndex] = { expoPushToken, platform, deviceId };
    } else {
      registeredPushTokens.push({ expoPushToken, platform, deviceId });
    }

    res.json({ success: true, registeredCount: registeredPushTokens.length });
  });

  // ---------------- ACTIVITIES ----------------
  app.get("/api/activities", (req, res) => {
    const q = (req.query.q as string || "").toLowerCase();
    const status = req.query.status as string || "ALL";
    const type = req.query.type as string || "ALL";
    const page = parseInt(req.query.page as string || "1", 10);
    const limit = parseInt(req.query.limit as string || "30", 10);

    let filtered = [...activities];

    if (q) {
      filtered = filtered.filter(
        (a) =>
          a.filename.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.extension.toLowerCase().includes(q) ||
          (a.source && a.source.toLowerCase().includes(q))
      );
    }

    if (status !== "ALL") {
      filtered = filtered.filter((a) => a.status === status);
    }

    if (type !== "ALL") {
      filtered = filtered.filter((a) => a.activityType === type);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    res.json({
      activities: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  });

  app.get("/api/activities/:id", (req, res) => {
    const { id } = req.params;
    const activity = activities.find((a) => a.activityId === id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json({ activity });
  });

  // ---------------- DESKTOP AGENT SIMULATION ----------------
  app.post("/api/simulate/activity", (req, res) => {
    const {
      activityType,
      status,
      filename,
      fileSize,
      size,
      source,
      destination,
      sourceDrive,
      destinationDrive,
      reason,
      progress,
      downloadSpeed
    } = req.body;

    const targetDevice: Device = devices[0] || {
      deviceId: "device_123",
      name: "Meets-PC",
      platform: "windows",
      os: "Windows 11 Pro",
      agentVersion: "1.2.0",
      isOnline: true,
      lastHeartbeat: new Date().toISOString()
    };
    // Update target device heartbeat
    targetDevice.lastHeartbeat = new Date().toISOString();
    targetDevice.isOnline = true;

    // Check if an activity with this filename already exists to update or create
    let existingIndex = activities.findIndex(
      (a) => a.filename === filename && a.status !== "COMPLETED" && a.status !== "FAILED"
    );

    let activity: Activity;

    if (existingIndex >= 0) {
      activity = {
        ...activities[existingIndex],
        status: status || activities[existingIndex].status,
        progress: progress !== undefined ? progress : activities[existingIndex].progress,
        reason: reason || activities[existingIndex].reason,
        timestamp: new Date().toISOString(),
        downloadSpeed: downloadSpeed || activities[existingIndex].downloadSpeed
      };
      if (status === "COMPLETED" || status === "FAILED" || status === "CANCELLED") {
        activity.completedAt = new Date().toISOString();
      }
      activities[existingIndex] = activity;
    } else {
      const ext = filename.includes(".") ? filename.split(".").pop() || "file" : "file";
      activity = {
        activityId: `act_${Date.now()}`,
        activityType: activityType || "DOWNLOAD",
        status: status || "STARTED",
        filename: filename || "new_download.iso",
        extension: ext,
        size: size || 1073741824,
        fileSize: fileSize || "1.0 GB",
        source: source || null,
        destination: destination || `C:\\Users\\Meet\\Downloads\\${filename}`,
        sourceDrive: sourceDrive || null,
        destinationDrive: destinationDrive || "C:",
        deviceId: targetDevice.deviceId,
        deviceName: targetDevice.name,
        startedAt: new Date().toISOString(),
        completedAt: status === "COMPLETED" || status === "FAILED" ? new Date().toISOString() : null,
        timestamp: new Date().toISOString(),
        reason: reason || null,
        progress: progress !== undefined ? progress : status === "COMPLETED" ? 100 : 0,
        downloadSpeed: downloadSpeed || "22.1 MB/s"
      };
      activities.unshift(activity);
    }

    // Trigger Expo Push Notification if COMPLETED, FAILED, CANCELLED, or USB_TRANSFER
    if (["COMPLETED", "FAILED", "CANCELLED"].includes(activity.status) || activity.activityType === "USB_TRANSFER") {
      let title = "Download Complete";
      let body = `${activity.filename} · ${activity.fileSize}`;

      if (activity.status === "FAILED" || activity.status === "CANCELLED") {
        title = "Download Failed";
        body = `${activity.filename} · ${activity.reason || "Cancelled"}`;
      } else if (activity.activityType === "USB_TRANSFER") {
        title = "USB Transfer Complete";
        body = `${activity.filename} · ${activity.sourceDrive || "E:"} ➔ ${activity.destinationDrive || "C:"}`;
      }

      const pushNotif: PushNotificationPayload = {
        id: `notif_${Date.now()}`,
        activityId: activity.activityId,
        title,
        body,
        timestamp: new Date().toISOString(),
        type: activity.activityType,
        read: false
      };

      pushNotifications.unshift(pushNotif);
    }

    res.json({ success: true, activity });
  });

  // Get notifications
  app.get("/api/notifications", (req, res) => {
    res.json({ notifications: pushNotifications });
  });

  // Toggle device online/offline
  app.post("/api/simulate/device-toggle", (req, res) => {
    const { deviceId, isOnline } = req.body;
    const dev = devices.find((d) => d.deviceId === (deviceId || "device_123"));
    if (dev) {
      dev.isOnline = isOnline;
      dev.lastHeartbeat = isOnline
        ? new Date().toISOString()
        : new Date(Date.now() - 15 * 60 * 1000).toISOString();
    }
    res.json({ success: true, device: dev });
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DownloadPulse Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

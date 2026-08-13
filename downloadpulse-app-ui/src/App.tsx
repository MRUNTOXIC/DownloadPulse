import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Laptop,
  Search,
  Bell,
  Settings as SettingsIcon,
  Plus,
  Monitor,
  RefreshCw,
  Usb,
  Download,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Trash2,
  HardDrive,
  Shield,
  Smartphone,
  LogOut,
  UserCheck,
  Send,
  Zap,
  ChevronRight,
  Sliders,
  X
} from "lucide-react";

import { MobileFrame } from "./components/MobileFrame";
import { ExpoHeader } from "./components/ExpoHeader";
import { ExpoTabBar, TabType } from "./components/ExpoTabBar";
import { ActivityCard } from "./components/ActivityCard";
import { ActivityDetailModal } from "./components/ActivityDetailModal";
import { PairingModal } from "./components/PairingModal";

import { activityService } from "./services/activityService";
import { deviceService } from "./services/deviceService";
import { authService } from "./services/authService";
import { simulatorService } from "./services/simulatorService";
import { Activity as ActivityType, Device, NotificationItem, User } from "./types";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  
  // Data States
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // UI Modal States
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSimulatorDrawer, setShowSimulatorDrawer] = useState(false);

  // Filtering & Search
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Settings Toggles
  const [notifyOnUsb, setNotifyOnUsb] = useState(true);
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [notifyOnFail, setNotifyOnFail] = useState(true);

  // Auth form state
  const [authEmail, setAuthEmail] = useState("user@downloadpulse.io");
  const [authPassword, setAuthPassword] = useState("password123");
  const [authName, setAuthName] = useState("Alex Rivers");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Simulator Form State
  const [simFilename, setSimFilename] = useState("ubuntu-24.04-desktop-amd64.iso");
  const [simType, setSimType] = useState<"DOWNLOAD" | "FILE_COPY" | "USB_TRANSFER">("DOWNLOAD");
  const [simSize, setSimSize] = useState("4.8 GB");
  const [simStatus, setSimStatus] = useState<"COMPLETED" | "IN_PROGRESS" | "FAILED">("COMPLETED");

  // Fetch all initial app data
  const fetchData = useCallback(async () => {
    try {
      const [actData, devData, notifData, userData] = await Promise.all([
        activityService.getActivities(),
        deviceService.getDevices(),
        activityService.getNotifications(),
        authService.getProfile()
      ]);
      setActivities(actData);
      setDevices(devData);
      setNotifications(notifData);
      if (userData) setUser(userData);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-polling for real-time file transfer updates every 3 seconds
    const interval = setInterval(() => {
      activityService.getActivities().then(setActivities).catch(() => {});
      deviceService.getDevices().then(setDevices).catch(() => {});
      activityService.getNotifications().then(setNotifications).catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Auth Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isRegistering) {
        const u = await authService.register(authEmail, authPassword, authName);
        setUser(u);
      } else {
        const u = await authService.login(authEmail, authPassword);
        setUser(u);
      }
      setShowAuthModal(false);
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setShowAuthModal(false);
  };

  // Simulator Event Triggers
  const handleTriggerSimulatedEvent = async (statusOverride?: "COMPLETED" | "IN_PROGRESS" | "FAILED") => {
    const activeStatus = statusOverride || simStatus;
    try {
      const newAct = await simulatorService.triggerActivity({
        filename: simFilename,
        activityType: simType,
        fileSize: simSize,
        status: activeStatus,
        reason: activeStatus === "FAILED" ? "Network Connection Reset by Peer" : undefined,
        sourceDrive: simType === "USB_TRANSFER" ? "E:" : undefined,
        destinationDrive: "C:"
      });
      setActivities((prev) => [newAct, ...prev]);
      
      // Refresh notifications
      const newNotifs = await activityService.getNotifications();
      setNotifications(newNotifs);
    } catch (err) {
      console.error("Failed to trigger simulation:", err);
    }
  };

  const handleToggleDeviceStatus = async (deviceId: string, currentOnline: boolean) => {
    try {
      await simulatorService.toggleDeviceStatus(deviceId, !currentOnline);
      setDevices((prev) =>
        prev.map((d) => (d.deviceId === deviceId ? { ...d, isOnline: !currentOnline } : d))
      );
    } catch (err) {
      console.error("Failed to toggle device:", err);
    }
  };

  const handleMarkNotificationsRead = async () => {
    await activityService.markNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Filtered Activities
  const filteredActivities = activities.filter((act) => {
    // Type Filter
    if (filterType !== "ALL" && act.activityType !== filterType) return false;
    // Status Filter
    if (filterStatus !== "ALL" && act.status !== filterStatus) return false;
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFile = act.filename.toLowerCase().includes(q);
      const matchExt = act.extension?.toLowerCase().includes(q);
      const matchDevice = act.deviceName?.toLowerCase().includes(q);
      const matchDest = act.destination.toLowerCase().includes(q);
      if (!matchFile && !matchExt && !matchDevice && !matchDest) return false;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const activeDevice = devices.find((d) => d.isOnline) || devices[0];

  return (
    <MobileFrame
      activeDeviceName={activeDevice?.name}
      isDeviceOnline={activeDevice?.isOnline}
      onToggleSimulator={() => setShowSimulatorDrawer(!showSimulatorDrawer)}
    >
      <div className="flex flex-col h-full bg-[#F3F4F6] text-gray-900 relative overflow-hidden font-sans">
        {/* Main Header */}
        <ExpoHeader
          user={user}
          devices={devices}
          unreadNotificationCount={unreadCount}
          onOpenNotifications={() => setActiveTab("notifications")}
          onOpenAuth={() => setShowAuthModal(true)}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />

        {/* Scrollable Screen Content Body */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: ACTIVITY FEED */}
          {activeTab === "feed" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Quick Summary Banner */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Live Activity Feed</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Monitoring <span className="font-semibold text-black">{devices.length} desktop device{devices.length === 1 ? "" : "s"}</span>
                  </p>
                </div>

                <button
                  onClick={() => setShowPairingModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pair PC</span>
                </button>
              </div>

              {/* Filter Chips Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-gray-500" /> Filter Activity
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Showing {filteredActivities.length} of {activities.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {[
                    { id: "ALL", label: "All Types" },
                    { id: "DOWNLOAD", label: "Downloads" },
                    { id: "USB_TRANSFER", label: "USB Drives" },
                    { id: "FILE_COPY", label: "Local Copies" }
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setFilterType(chip.id)}
                      className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                        filterType === chip.id
                          ? "bg-black text-white font-bold shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Status Filter Sub-Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {[
                    { id: "ALL", label: "All Statuses" },
                    { id: "COMPLETED", label: "Completed" },
                    { id: "IN_PROGRESS", label: "In Progress" },
                    { id: "FAILED", label: "Failed/Cancelled" }
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setFilterStatus(chip.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                        filterStatus === chip.id
                          ? "bg-gray-800 text-white font-bold"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Cards List */}
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-black" />
                  <span className="text-xs font-mono">Loading activity feed...</span>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-gray-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">No Matching Activity</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                      No desktop file operations match your selected filter criteria. Try clearing filters or trigger a simulated download.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFilterType("ALL");
                      setFilterStatus("ALL");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onClick={() => setSelectedActivity(act)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAIRED DEVICES */}
          {activeTab === "devices" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Paired Computers</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Desktop background agents syncing activity in real-time
                  </p>
                </div>
                <button
                  onClick={() => setShowPairingModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pair PC</span>
                </button>
              </div>

              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.deviceId}
                    className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-gray-900">{device.name}</h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                device.isOnline
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {device.isOnline ? "Online" : "Offline"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">
                            OS: {device.os.toUpperCase()} • v{device.agentVersion || "1.2.0"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleDeviceStatus(device.deviceId, device.isOnline)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold cursor-pointer"
                        title="Simulate online/offline heartbeat"
                      >
                        {device.isOnline ? "Simulate Offline" : "Simulate Online"}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Last Activity: {new Date(device.lastSeen).toLocaleTimeString()}</span>
                      <span className="font-mono text-[10px] text-gray-400">ID: {device.deviceId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-gray-900">Search Activity Records</h2>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by filename, extension (.zip, .mp4), destination..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-500 px-1">
                  {searchQuery
                    ? `Found ${filteredActivities.length} matching result(s)`
                    : "Recent Desktop Activities"}
                </div>

                {filteredActivities.length === 0 ? (
                  <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center text-gray-500 text-xs">
                    No matching file records found for "{searchQuery}".
                  </div>
                ) : (
                  filteredActivities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onClick={() => setSelectedActivity(act)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PUSH NOTIFICATIONS / ALERTS */}
          {activeTab === "notifications" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Mobile Push Alerts</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Expo Push Notification delivery history
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkNotificationsRead}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer"
                  >
                    Mark All Read
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {notifications.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-gray-200 text-center text-gray-400 text-xs">
                    No push alerts received yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        notif.isRead
                          ? "bg-white border-gray-100 opacity-80"
                          : "bg-blue-50/50 border-blue-200 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              notif.type === "USB_TRANSFER"
                                ? "bg-purple-100 text-purple-700"
                                : notif.type === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            <Bell className="w-4 h-4" />
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                            <p className="text-xs text-gray-600 mt-0.5">{notif.body}</p>
                            <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                              {new Date(notif.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black text-white font-bold flex items-center justify-center text-lg">
                    {user ? user.name.charAt(0) : "A"}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{user?.name || "Alex Rivers"}</h3>
                    <p className="text-xs text-gray-500 font-mono">{user?.email || "user@downloadpulse.io"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer"
                >
                  Account
                </button>
              </div>

              {/* Push Notification Preferences */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                  Mobile Push Preferences
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">USB Drive Transfers</span>
                      <span className="text-[11px] text-gray-500">Alert when USB storage device is mounted</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyOnUsb}
                      onChange={(e) => setNotifyOnUsb(e.target.checked)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Transfer Completion</span>
                      <span className="text-[11px] text-gray-500">Alert on successful download or copy</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyOnComplete}
                      onChange={(e) => setNotifyOnComplete(e.target.checked)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Transfer Failures</span>
                      <span className="text-[11px] text-gray-500">Alert on network disconnects or errors</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyOnFail}
                      onChange={(e) => setNotifyOnFail(e.target.checked)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Expo System Credentials info */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                  Expo Device Configuration
                </h3>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs space-y-1 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Push Token:</span>
                    <span className="font-bold text-black truncate ml-2">ExponentPushToken[992x18a]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Backend Host:</span>
                    <span className="text-gray-800">https://api.downloadpulse.io</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Desktop Agent Simulation Drawer / Overlay */}
        {showSimulatorDrawer && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-white border-t-2 border-gray-900 p-4 shadow-2xl rounded-t-3xl space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-black" />
                <h3 className="font-bold text-sm text-gray-900">Desktop Agent Event Simulator</h3>
              </div>
              <button
                onClick={() => setShowSimulatorDrawer(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Instantly trigger file events from the simulated Desktop Agent to test real-time mobile retrieval and push notifications.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Filename</label>
                <input
                  type="text"
                  value={simFilename}
                  onChange={(e) => setSimFilename(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Activity Type</label>
                <select
                  value={simType}
                  onChange={(e: any) => setSimType(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                >
                  <option value="DOWNLOAD">DOWNLOAD</option>
                  <option value="USB_TRANSFER">USB TRANSFER</option>
                  <option value="FILE_COPY">FILE COPY</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleTriggerSimulatedEvent("COMPLETED")}
                className="flex-1 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
              >
                Trigger Completed
              </button>

              <button
                onClick={() => handleTriggerSimulatedEvent("FAILED")}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
              >
                Trigger Failure
              </button>
            </div>
          </div>
        )}

        {/* Bottom Expo Navigation Bar */}
        <ExpoTabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          unreadCount={unreadCount}
        />

        {/* Detail Modal */}
        {selectedActivity && (
          <ActivityDetailModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}

        {/* Pairing Modal */}
        {showPairingModal && (
          <PairingModal
            onClose={() => setShowPairingModal(false)}
            onDevicePaired={(device) => {
              setDevices((prev) => [...prev, device]);
            }}
          />
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative text-gray-900 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base">
                  {user ? "Account Profile" : isRegistering ? "Create Account" : "Log In to Pulse"}
                </h3>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {user ? (
                <div className="space-y-4 py-2">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-xs text-gray-500 font-bold uppercase">Logged in User</span>
                    <h4 className="font-bold text-sm text-gray-900">{user.name}</h4>
                    <p className="text-xs text-gray-600 font-mono">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs cursor-pointer hover:bg-red-700"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                  {isRegistering && (
                    <div>
                      <label className="text-[11px] font-bold text-gray-600">Full Name</label>
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full p-2.5 mt-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Email Address</label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full p-2.5 mt-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-black font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Password</label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full p-2.5 mt-1 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-black font-mono"
                      required
                    />
                  </div>

                  {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-black text-white font-semibold text-xs cursor-pointer hover:bg-gray-800 shadow-sm mt-2"
                  >
                    {isRegistering ? "Register Account" : "Log In"}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-xs text-gray-500 hover:text-black font-medium cursor-pointer"
                    >
                      {isRegistering ? "Already have an account? Log In" : "Need an account? Register"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

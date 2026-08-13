import React from "react";
import { Bell, Laptop, User, RefreshCw } from "lucide-react";
import { Device, User as UserType } from "../types";

interface ExpoHeaderProps {
  user: UserType | null;
  devices: Device[];
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const ExpoHeader: React.FC<ExpoHeaderProps> = ({
  user,
  devices,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenAuth,
  onRefresh,
  isRefreshing
}) => {
  const activeDevice = devices.find((d) => d.isOnline) || devices[0];

  return (
    <div className="pt-2.5 px-4 pb-3 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between">
      {/* Brand & Active Device Chip */}
      <div className="flex items-center gap-2.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-gray-900">
              DownloadPulse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>

          {/* Device Online/Offline Badge */}
          {activeDevice ? (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Laptop className="w-3 h-3 text-gray-400" />
              <span className="font-semibold text-gray-700">{activeDevice.name}</span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                  activeDevice.isOnline
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeDevice.isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {activeDevice.isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-gray-400">No Computer Paired</span>
          )}
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-black transition-all cursor-pointer active:scale-90"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-black" : ""}`} />
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-black transition-all cursor-pointer active:scale-90"
          title="Push Notifications"
        >
          <Bell className="w-4 h-4 text-gray-700" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenAuth}
          className="p-1 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 transition-all cursor-pointer active:scale-90 flex items-center gap-1.5"
          title={user ? `Logged in as ${user.email}` : "Log In"}
        >
          <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {user ? user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>
    </div>
  );
};


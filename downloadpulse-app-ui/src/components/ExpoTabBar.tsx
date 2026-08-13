import React from "react";
import { Activity, Laptop, Search, Bell, Settings } from "lucide-react";

export type TabType = "feed" | "devices" | "search" | "notifications" | "settings";

interface ExpoTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadCount?: number;
}

export const ExpoTabBar: React.FC<ExpoTabBarProps> = ({
  activeTab,
  onChangeTab,
  unreadCount = 0
}) => {
  const tabs: { id: TabType; label: string; icon: any; badge?: number }[] = [
    { id: "feed", label: "Activities", icon: Activity },
    { id: "devices", label: "Devices", icon: Laptop },
    { id: "search", label: "Search", icon: Search },
    { id: "notifications", label: "Alerts", icon: Bell, badge: unreadCount },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-t border-gray-100 py-2 px-3 sticky bottom-0 z-40 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as TabType)}
            className={`relative flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
              isActive
                ? "text-black font-bold"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110 text-black" : ""
                }`}
              />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-600 text-white font-mono text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {tab.badge > 9 ? "9+" : tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] tracking-tight font-sans">
              {tab.label}
            </span>

            {/* Active Indicator Bar */}
            {isActive && (
              <span className="absolute -bottom-1 w-5 h-0.5 bg-black rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};


import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal, Smartphone, Maximize2, Monitor } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  activeDeviceName?: string;
  isDeviceOnline?: boolean;
  onToggleSimulator?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeDeviceName = "Meets-PC",
  isDeviceOnline = true,
  onToggleSimulator
}) => {
  const [time, setTime] = useState("");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col items-center justify-start p-2 sm:p-6 select-none overflow-x-hidden font-sans">
      {/* Top Banner Control Header */}
      <header className="w-full max-w-5xl mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white font-bold text-lg shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                DownloadPulse
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                Expo Mobile
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block font-medium">
              Real-time Mobile Client & Desktop Monitoring Bridge
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={onToggleSimulator}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Open Desktop Agent Controls"
          >
            <Monitor className="w-4 h-4 text-green-400" />
            <span>Desktop Agent Controls</span>
          </button>

          <button
            onClick={() => setIsStandalone(!isStandalone)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-semibold transition-all cursor-pointer active:scale-95"
            title="Toggle View Mode"
          >
            {isStandalone ? <Smartphone className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">
              {isStandalone ? "Frame View" : "Full View"}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Device Frame Container */}
      <main
        className={`transition-all duration-300 w-full flex justify-center ${
          isStandalone ? "max-w-4xl" : "max-w-[420px]"
        }`}
      >
        <div
          className={`relative w-full transition-all duration-300 ${
            isStandalone
              ? "rounded-3xl border border-gray-200 bg-white p-2 sm:p-6 min-h-[800px] shadow-xl"
              : "rounded-[48px] border-[10px] sm:border-[12px] border-black bg-black p-1 shadow-2xl ring-1 ring-gray-900/10 overflow-hidden"
          }`}
        >
          {/* Hardware Frame Elements (In Frame View) */}
          {!isStandalone && (
            <>
              {/* Top Dynamic Island / Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 mt-2.5 w-28 h-6 bg-black rounded-full flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900" />
                </div>
                <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />
                </div>
              </div>

              {/* Status Bar */}
              <div className="relative z-40 pt-3.5 pb-1 px-7 flex items-center justify-between text-[11px] font-mono text-white bg-black">
                <span className="font-semibold tracking-tight">{time || "09:41"}</span>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </>
          )}

          {/* Screen Display Area */}
          <div className="relative w-full h-full min-h-[740px] max-h-[820px] flex flex-col bg-white text-gray-900 rounded-[36px] overflow-hidden border border-gray-100">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          {!isStandalone && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-32 h-1 bg-gray-700/80 rounded-full" />
          )}
        </div>
      </main>
    </div>
  );
};


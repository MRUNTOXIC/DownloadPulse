import React, { useState, useEffect } from 'react';
import { Monitor, HardDrive, Usb, ArrowDown, Copy, FolderArchive, Activity, RefreshCw } from 'lucide-react';

export default function LiveMonitoringDemo() {
  const [activities, setActivities] = useState([
    { id: 1, name: 'project.zip', type: 'Downloaded', size: '2.4 GB', time: 'Just now', icon: ArrowDown, color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 border-cyan-500/30' },
    { id: 2, name: 'photos.zip', type: 'Extracted', size: '1.8 GB', time: '2 mins ago', icon: FolderArchive, color: 'text-indigo-400', badgeBg: 'bg-indigo-500/10 border-indigo-500/30' },
    { id: 3, name: 'backup_drive', type: 'Copied', size: '640 MB', time: '5 mins ago', icon: Copy, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' },
    { id: 4, name: 'SanDisk_128GB', type: 'USB Connected', size: '128 GB', time: '12 mins ago', icon: Usb, color: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30' }
  ]);

  const pool = [
    { name: 'sdk_update.tar.gz', type: 'Downloaded', size: '420 MB', icon: ArrowDown, color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 border-cyan-500/30' },
    { name: 'design_assets.fig', type: 'Copied', size: '850 MB', icon: Copy, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' },
    { name: 'Kingston_SSD_1TB', type: 'USB Connected', size: '1 TB', icon: Usb, color: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30' },
    { name: 'raw_recordings.mov', type: 'Extracted', size: '4.2 GB', icon: FolderArchive, color: 'text-indigo-400', badgeBg: 'bg-indigo-500/10 border-indigo-500/30' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      const newEntry = {
        ...randomItem,
        id: Date.now(),
        time: 'Just now'
      };
      setActivities((prev) => [newEntry, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#070A11] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="badge-glow mb-4">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Activity Feed Demo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Real-Time Monitoring Interface
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Here is a live simulation of the DownloadPulse application dashboard tracking active desktop connected devices and file events.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="glass-panel max-w-5xl mx-auto overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
          
          {/* Dashboard Window Bar */}
          <div className="bg-[#0C1220] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400 font-semibold tracking-wider">
                DOWNLOADPULSE DASHBOARD v1.0.0
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE SYSTEM SYNC</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Connected Devices */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-3">
                  CONNECTED DEVICES (3)
                </h4>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Meet's MacBook</div>
                        <div className="text-[11px] text-slate-400">macOS Monterey • Agent v1.0</div>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Windows PC</div>
                        <div className="text-[11px] text-slate-400">Windows 11 • Agent v1.0</div>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HardDrive className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">External SSD 1TB</div>
                        <div className="text-[11px] text-slate-400">ExFAT Volume</div>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
                  </div>
                </div>
              </div>

              {/* USB Device Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
                  <Usb className="w-4 h-4" /> USB STORAGE MONITORED
                </div>
                <div className="text-sm font-bold text-white">SanDisk Ultra 128GB</div>
                <div className="text-[11px] text-slate-400 mt-1">Plugged into USB 3.2 Port (Windows PC)</div>
              </div>
            </div>

            {/* Right Column: Real-Time Activity Feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-2">
                  <span>RECENT FILE ACTIVITIES</span>
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                </h4>
                <span className="text-xs text-slate-400">Auto-refreshing live</span>
              </div>

              <div className="space-y-3">
                {activities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-lg ${item.badgeBg} border flex items-center justify-center ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({item.size})</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Status: <span className="text-slate-200 font-semibold">{item.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-cyan-400 font-medium">{item.time}</span>
                        <div className="text-[10px] text-slate-400">Event #{item.id.toString().slice(-4)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

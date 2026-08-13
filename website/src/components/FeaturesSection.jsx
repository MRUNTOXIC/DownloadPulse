import React from 'react';
import { ArrowDownToLine, Usb, HardDrive, Copy, Move, FolderArchive, BellRing, Laptop } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: ArrowDownToLine,
      title: "Downloads Monitoring",
      description: "Instantly detect new files downloaded via Chrome, Edge, Safari, Firefox, or torrent clients.",
      tag: "Real-time Watcher",
      color: "text-cyan-400",
      border: "hover:border-cyan-500/50"
    },
    {
      icon: Usb,
      title: "USB & Removable Storage",
      description: "Detect when USB flash drives or memory cards are plugged in or files are written to them.",
      tag: "Device Control",
      color: "text-amber-400",
      border: "hover:border-amber-500/50"
    },
    {
      icon: HardDrive,
      title: "External HDDs & SSDs",
      description: "Monitor connected external hard drives, high-speed SSDs, and network shares seamlessly.",
      tag: "Volume Tracker",
      color: "text-indigo-400",
      border: "hover:border-indigo-500/50"
    },
    {
      icon: Copy,
      title: "File Copy Activity",
      description: "Track important file copy actions to prevent accidental loss or monitor data duplication.",
      tag: "Data Integrity",
      color: "text-emerald-400",
      border: "hover:border-emerald-500/50"
    },
    {
      icon: Move,
      title: "File Moves & Renames",
      description: "Log file movement and renaming events across monitored workspace directories.",
      tag: "Path Tracking",
      color: "text-blue-400",
      border: "hover:border-blue-500/50"
    },
    {
      icon: FolderArchive,
      title: "Archive Extractions",
      description: "Detect when .zip, .rar, .7z, or .tar.gz archives are unpacked into local folders.",
      tag: "Archive Inspector",
      color: "text-purple-400",
      border: "hover:border-purple-500/50"
    },
    {
      icon: BellRing,
      title: "Instant Push Alerts",
      description: "Receive push notifications directly on your iPhone or Android phone within milliseconds.",
      tag: "Mobile Sync",
      color: "text-rose-400",
      border: "hover:border-rose-500/50"
    },
    {
      icon: Laptop,
      title: "Multi-Device Pairing",
      description: "Connect multiple MacBooks, Windows PCs, and laptops to a unified central dashboard.",
      tag: "Fleet Management",
      color: "text-teal-400",
      border: "hover:border-teal-500/50"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-glow mb-4">
            Powerful Feature Suite
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Complete File Activity Intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            DownloadPulse provides end-to-end visibility into every file event happening on your computers and external drives.
          </p>
        </div>

        {/* 3D Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className={`glass-panel glass-card-interactive p-6 flex flex-col justify-between group transition-all duration-300 transform hover:-translate-y-2 ${feat.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center ${feat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/5">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Included in Agent v1.0</span>
                  <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ArrowDownToLine, Usb, HardDrive, Copy, Move, FolderArchive, BellRing, Laptop } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: ArrowDownToLine,
      title: "Downloads Watcher",
      description: "Detects new files downloaded via Chrome, Safari, Firefox, Edge, or torrent clients in milliseconds.",
      tag: "Real-Time Monitoring"
    },
    {
      icon: Usb,
      title: "USB & Removable Media",
      description: "Detects USB flash drives or SD cards plugged into your Mac or Windows computer.",
      tag: "Removable Storage"
    },
    {
      icon: HardDrive,
      title: "External HDDs & SSDs",
      description: "Monitors connected external hard drives, high-speed NVMe SSDs, and network volumes.",
      tag: "Volume Intelligence"
    },
    {
      icon: Copy,
      title: "File Copy Tracking",
      description: "Tracks file copying actions across local folders and connected external drives.",
      tag: "Data Integrity"
    },
    {
      icon: Move,
      title: "File Move & Renames",
      description: "Logs file movement and renaming events across monitored workspace directories.",
      tag: "Path Tracking"
    },
    {
      icon: FolderArchive,
      title: "Archive Extractions",
      description: "Detects when .zip, .dmg, .rar, or .tar.gz archives are extracted into local folders.",
      tag: "Archive Inspector"
    },
    {
      icon: BellRing,
      title: "Instant Push Notifications",
      description: "Delivers push notification alerts directly to your iPhone or Android phone in real time.",
      tag: "Mobile Alert"
    },
    {
      icon: Laptop,
      title: "Multi-Device Pairing",
      description: "Pairs multiple MacBooks, iMacs, and Windows workstations to a unified mobile dashboard.",
      tag: "Fleet Control"
    }
  ];

  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-monochrome mb-4">
            Product Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight">
            Complete File Activity Intelligence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            DownloadPulse provides complete visibility into file events occurring on your computers and external drives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="luxury-card p-6 flex flex-col justify-between group hover:border-white/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold shadow-xl group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-white/10">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-slate-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Included in Agent v1.0</span>
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    Explore →
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

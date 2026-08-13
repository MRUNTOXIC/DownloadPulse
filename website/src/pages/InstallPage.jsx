import React, { useState } from 'react';
import { DOWNLOADS } from '../config/downloads.config';
import { Monitor, Apple, Smartphone, ArrowDownToLine, Cpu } from 'lucide-react';

export default function InstallPage({ onOpenDownload }) {
  const [selectedPlatform, setSelectedPlatform] = useState('windows');
  const activeConfig = DOWNLOADS[selectedPlatform] || DOWNLOADS.windows;

  const platformTabs = [
    { id: 'windows', name: 'Windows Guide', icon: Monitor, ext: '.exe' },
    { id: 'macos', name: 'macOS Guide', icon: Apple, ext: '.dmg' },
    { id: 'android', name: 'Android Guide', icon: Smartphone, ext: '.apk' },
    { id: 'ios', name: 'iOS Guide', icon: Smartphone, ext: 'App Store' }
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge-monochrome mb-4">
            Installation & Pair Instructions
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
            How to Install DownloadPulse
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Follow the instructions below to install the Desktop Agent or Mobile Application and link your devices.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {platformTabs.map((tab) => {
            const Icon = tab.icon;
            const active = selectedPlatform === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedPlatform(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full border font-heading font-bold text-sm transition-all ${
                  active
                    ? 'bg-white text-black border-white shadow-xl scale-105'
                    : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
                <span className="text-xs font-mono">({tab.ext})</span>
              </button>
            );
          })}
        </div>

        {/* Active Guide Card */}
        <div className="luxury-card p-8 sm:p-12 max-w-5xl mx-auto border-white/20">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 mb-10">
            <div>
              <span className="badge-monochrome text-[10px] py-0.5 px-2.5">
                {activeConfig.badge}
              </span>
              <h2 className="text-2xl font-heading font-black text-white mt-1">
                Installing {activeConfig.name}
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Target File: <code className="text-white font-bold">{activeConfig.filename}</code>
              </p>
            </div>

            <button
              onClick={() => onOpenDownload(selectedPlatform)}
              className="btn-luxury-white py-3 px-7 text-sm font-bold shadow-xl shrink-0"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Download {activeConfig.filename}</span>
            </button>
          </div>

          {/* Interactive Steps */}
          <div className="space-y-6">
            {activeConfig.installSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-start gap-5 hover:border-white/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-black font-mono font-bold text-base flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Step {idx + 1}: {step.split(' ')[0]} {step.split(' ')[1]}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Silent Daemon Note */}
          <div className="mt-10 p-4 rounded-xl bg-[#0D0D0D] border border-white/15 flex items-center gap-3 text-xs text-slate-300">
            <Cpu className="w-5 h-5 text-white shrink-0" />
            <div>
              <strong>Silent Background Operation:</strong> Once installed, DownloadPulse runs automatically in your system tray or menu bar. No terminal or window needs to remain open.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

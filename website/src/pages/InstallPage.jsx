import React, { useState } from 'react';
import { DOWNLOADS } from '../config/downloads.config';
import { Monitor, Apple, Smartphone, ArrowDownToLine, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

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
    <div className="pt-28 pb-24 min-h-screen bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge-glow mb-4">
            Step-by-Step Instructions
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Installation & Setup Guide
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Follow these visual instructions to set up the DownloadPulse Desktop Agent or Mobile Application.
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
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border font-heading font-bold text-sm transition-all ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/25 scale-105'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
                <span className="text-xs font-mono text-slate-400">({tab.ext})</span>
              </button>
            );
          })}
        </div>

        {/* Active Platform Guide Container */}
        <div className="glass-panel p-8 sm:p-12 max-w-5xl mx-auto border-cyan-500/30">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 mb-10">
            <div>
              <span className="badge-glow text-[10px] py-0.5 px-2.5">
                {activeConfig.badge}
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-white mt-1">
                Installing {activeConfig.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeConfig.platformLabel} • Installer: <code className="text-cyan-400">{activeConfig.filename}</code>
              </p>
            </div>

            <button
              onClick={() => onOpenDownload(selectedPlatform)}
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-500/25"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Download {activeConfig.filename}</span>
            </button>
          </div>

          {/* Interactive Step Cards */}
          <div className="space-y-6">
            {activeConfig.installSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 flex items-start gap-5 hover:border-cyan-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-base shrink-0 group-hover:scale-110 transition-transform">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Step {idx + 1}: {step.split(' ')[0]} {step.split(' ')[1]}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Background Daemon Notice */}
          <div className="mt-10 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3 text-xs text-slate-300">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <strong>Note:</strong> Once installed, DownloadPulse runs silently in the system tray / menu bar. You do not need to keep a terminal or window open.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

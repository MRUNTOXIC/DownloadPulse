import React from 'react';
import { detectUserPlatform } from '../utils/platform';
import { DOWNLOADS } from '../config/downloads.config';
import { Monitor, Apple, Smartphone, ArrowDownToLine, CheckCircle2 } from 'lucide-react';

export default function PlatformDetector({ onOpenDownload }) {
  const detected = detectUserPlatform();
  const activeConfig = DOWNLOADS[detected.id] || DOWNLOADS.windows;

  const platforms = [
    { id: 'windows', name: 'Windows', icon: Monitor, ext: '.exe' },
    { id: 'macos', name: 'macOS', icon: Apple, ext: '.dmg' },
    { id: 'android', name: 'Android', icon: Smartphone, ext: '.apk' },
    { id: 'ios', name: 'iOS', icon: Smartphone, ext: 'App Store' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Recommended Platform Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/30">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 shrink-0">
              <ArrowDownToLine className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="badge-glow text-[11px] py-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {detected.recommendation}
                </span>
                <span className="text-xs text-slate-400 font-mono">v{activeConfig.version}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mt-1.5">
                {activeConfig.name}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {activeConfig.platformLabel} • {activeConfig.fileSize} • {activeConfig.badge}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDownload(detected.id)}
            className="btn-primary py-3.5 px-7 rounded-xl text-base w-full md:w-auto shrink-0 flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30"
          >
            <span>{detected.actionText}</span>
            <ArrowDownToLine className="w-5 h-5" />
          </button>
        </div>

        {/* Secondary All-Platform Bar Selector */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Also available for all major platforms:</span>
          <div className="flex flex-wrap items-center gap-2">
            {platforms.map((p) => {
              const Icon = p.icon;
              const isCurrent = p.id === detected.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onOpenDownload(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({p.ext})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

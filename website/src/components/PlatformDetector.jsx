import React from 'react';
import { detectUserPlatform } from '../utils/platform';
import { DOWNLOADS } from '../config/downloads.config';
import { Monitor, Apple, Smartphone, ArrowDownToLine, CheckCircle2 } from 'lucide-react';

export default function PlatformDetector({ onOpenDownload }) {
  const detected = detectUserPlatform();
  const activeConfig = DOWNLOADS[detected.id] || DOWNLOADS.windows;

  const platforms = [
    { id: 'windows', name: 'Windows', icon: Monitor, ext: '.exe', filename: 'DownloadPulse-Setup.exe' },
    { id: 'macos', name: 'macOS', icon: Apple, ext: '.dmg', filename: 'DownloadPulse.dmg' },
    { id: 'android', name: 'Android', icon: Smartphone, ext: '.apk', filename: 'DownloadPulse.apk' },
    { id: 'ios', name: 'iOS', icon: Smartphone, ext: 'App Store', filename: 'App Store Link' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      {/* Recommended Platform Card Banner */}
      <div className="luxury-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0A0A0A] to-slate-950 border border-white/20">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold shadow-xl shrink-0">
              <ArrowDownToLine className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="badge-monochrome text-[10px] py-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {detected.recommendation}
                </span>
                <span className="text-xs text-slate-400 font-mono">v{activeConfig.version}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-1.5">
                {activeConfig.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Installer File: <code className="text-white font-bold">{activeConfig.filename}</code> ({activeConfig.fileSize})
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDownload(detected.id)}
            className="btn-luxury-white py-3.5 px-8 text-base w-full md:w-auto shrink-0 flex items-center justify-center gap-3 shadow-xl"
          >
            <span>{detected.actionText}</span>
            <ArrowDownToLine className="w-5 h-5" />
          </button>
        </div>

        {/* All Platform Options Grid */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <span className="font-mono font-bold text-slate-300 uppercase tracking-wider">AVAILABLE INSTALLERS:</span>
          <div className="flex flex-wrap items-center gap-2">
            {platforms.map((p) => {
              const Icon = p.icon;
              const isCurrent = p.id === detected.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onOpenDownload(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-black/60 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">({p.ext})</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

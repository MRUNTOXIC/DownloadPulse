import React from 'react';
import { DOWNLOADS } from '../config/downloads.config';
import { Monitor, Apple, Smartphone, ArrowDownToLine, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

export default function DownloadPage({ onOpenDownload }) {
  const cards = [
    { ...DOWNLOADS.windows, icon: Monitor, color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 border-cyan-500/30' },
    { ...DOWNLOADS.macos, icon: Apple, color: 'text-blue-400', badgeBg: 'bg-blue-500/10 border-blue-500/30' },
    { ...DOWNLOADS.android, icon: Smartphone, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30' },
    { ...DOWNLOADS.ios, icon: Smartphone, color: 'text-indigo-400', badgeBg: 'bg-indigo-500/10 border-indigo-500/30' }
  ];

  const handleCopyChecksum = (sha) => {
    navigator.clipboard.writeText(sha);
    alert('SHA256 Checksum copied to clipboard!');
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-glow mb-4">
            Official Download Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Download DownloadPulse
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Choose your operating system below to download the official desktop agent or mobile application.
          </p>
        </div>

        {/* Large Platform Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="glass-panel p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all relative overflow-hidden group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl ${item.badgeBg} border flex items-center justify-center ${item.color} shadow-lg shrink-0`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="badge-glow text-[10px] py-0.5 px-2.5">
                          {item.badge}
                        </span>
                        <h3 className="text-xl font-heading font-bold text-white mt-1">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold px-3 py-1 rounded-lg bg-slate-900 border border-white/10">
                      {item.format}
                    </span>
                  </div>

                  {/* File Metadata */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/80 border border-white/10 mb-6 text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-mono">Version</div>
                      <div className="text-white font-semibold font-mono mt-0.5">v{item.version}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-mono">File Size</div>
                      <div className="text-white font-semibold mt-0.5">{item.fileSize}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-mono">Release Date</div>
                      <div className="text-white font-semibold mt-0.5">{item.releaseDate}</div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <p className="text-xs text-slate-400 mb-6">
                    <strong className="text-slate-300">System Requirements:</strong> {item.requirements}
                  </p>

                  {/* Installation Quick Overview */}
                  <div className="mb-6 space-y-2">
                    <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Setup Summary:
                    </div>
                    {item.installSteps.slice(0, 3).map((step, sIdx) => (
                      <div key={sIdx} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action & Checksum */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <button
                    onClick={() => onOpenDownload(item.id)}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-cyan-500/20"
                  >
                    <ArrowDownToLine className="w-5 h-5" />
                    <span>Download {item.name.replace('DownloadPulse for ', '')} ({item.format})</span>
                  </button>

                  {item.sha256 && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                      <span className="truncate max-w-[280px]">SHA256: {item.sha256}</span>
                      <button
                        onClick={() => handleCopyChecksum(item.sha256)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold shrink-0 ml-2"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Security Clean Code Guarantee */}
        <div className="mt-16 max-w-4xl mx-auto p-8 rounded-3xl glass-panel text-center border-cyan-500/30">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-xl font-heading font-bold text-white">Signed & Verified Binaries</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">
            All DownloadPulse installer packages are digitally signed with EV certificates. Free from adware, malware, or bundled third-party extensions.
          </p>
        </div>

      </div>
    </div>
  );
}

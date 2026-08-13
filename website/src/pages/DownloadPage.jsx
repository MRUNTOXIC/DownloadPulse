import React from 'react';
import { DOWNLOADS } from '../config/downloads.config';
import { Monitor, Apple, Smartphone, ArrowDownToLine, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

export default function DownloadPage({ onOpenDownload }) {
  const downloadCards = [
    { ...DOWNLOADS.windows, icon: Monitor },
    { ...DOWNLOADS.macos, icon: Apple },
    { ...DOWNLOADS.android, icon: Smartphone },
    { ...DOWNLOADS.ios, icon: Smartphone }
  ];

  const handleCopyHash = (sha) => {
    navigator.clipboard.writeText(sha);
    alert('SHA256 Checksum copied to clipboard!');
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-monochrome mb-4">
            Official Software Releases
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
            Download DownloadPulse
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Download the Desktop Agent installer for your computer or the Mobile Application for your phone.
          </p>
        </div>

        {/* Installer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {downloadCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="luxury-card p-8 flex flex-col justify-between hover:border-white/40 transition-all relative overflow-hidden group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold shadow-xl shrink-0">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="badge-monochrome text-[10px] py-0.5 px-2.5">
                          {item.badge}
                        </span>
                        <h3 className="text-xl font-heading font-bold text-white mt-1">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-white font-bold px-3 py-1 rounded-lg bg-slate-900 border border-white/20">
                      {item.format}
                    </span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 mb-6 text-xs font-mono">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Version</div>
                      <div className="text-white font-bold mt-0.5">v{item.version}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">File Size</div>
                      <div className="text-white font-bold mt-0.5">{item.fileSize}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Release</div>
                      <div className="text-white font-bold mt-0.5">{item.releaseDate}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    <strong className="text-slate-200">Requirements:</strong> {item.requirements}
                  </p>

                  {/* Setup Summary Steps */}
                  <div className="mb-6 space-y-2">
                    <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Setup Steps:
                    </div>
                    {item.installSteps.slice(0, 3).map((step, sIdx) => (
                      <div key={sIdx} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <button
                    onClick={() => onOpenDownload(item.id)}
                    className="btn-luxury-white w-full py-3.5 text-base font-bold shadow-xl justify-center"
                  >
                    <ArrowDownToLine className="w-5 h-5" />
                    <span>Download {item.filename}</span>
                  </button>

                  {item.sha256 && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-white/10">
                      <span className="truncate max-w-[280px]">SHA256: {item.sha256}</span>
                      <button
                        onClick={() => handleCopyHash(item.sha256)}
                        className="text-white hover:underline flex items-center gap-1 font-bold shrink-0 ml-2"
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

        {/* Verification Guarantee */}
        <div className="mt-16 max-w-4xl mx-auto p-8 rounded-3xl luxury-card text-center border-white/20">
          <ShieldCheck className="w-10 h-10 text-white mx-auto mb-3" />
          <h3 className="text-xl font-heading font-bold text-white">Digitally Signed & Code Verified</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">
            DownloadPulse releases undergo strict EV code-signing and automated security audits. Free from bundled third-party extensions.
          </p>
        </div>

      </div>
    </div>
  );
}

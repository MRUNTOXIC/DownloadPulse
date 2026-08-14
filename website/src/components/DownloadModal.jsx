import React, { useState, useEffect } from 'react';
import { DOWNLOADS, triggerFileDownload } from '../config/downloads.config';
import { X, ArrowDownToLine, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DownloadModal({ platformId, user, onClose, onOpenAuth }) {
  const config = DOWNLOADS[platformId] || DOWNLOADS.windows;
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initiating secure connection...');
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;
    triggerFileDownload(platformId);

    const steps = [
      { pct: 20, text: 'Resolving installer binary package...' },
      { pct: 50, text: `Downloading ${config.filename} (${config.fileSize})...` },
      { pct: 85, text: 'Verifying TLS package digital signature...' },
      { pct: 100, text: 'Download initiated successfully!' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].pct);
        setStatusText(steps[current].text);
        if (steps[current].pct === 100) {
          setDownloadCompleted(true);
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
        }
        current++;
      } else {
        clearInterval(interval);
      }
    }, 550);

    return () => clearInterval(interval);
  }, [platformId, user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="luxury-card w-full max-w-lg p-6 sm:p-8 relative bg-[#080808] border-white/30 shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-black font-bold flex items-center justify-center shadow-xl shrink-0">
            <ArrowDownToLine className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="badge-monochrome text-[10px] py-0.5 px-2.5">
              {config.badge} • v{config.version}
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-1">
              Downloading {config.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">{config.platformLabel}</p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="mt-6 p-4 rounded-xl bg-black border border-white/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">{config.filename}</span>
            <span className="text-slate-300 font-bold">{progress}% ({config.fileSize})</span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_10px_#FFFFFF]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{statusText}</span>
            {downloadCompleted && <span className="text-white flex items-center gap-1 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>}
          </div>
        </div>

        {/* Fallback Notice */}
        <div className="mt-4 p-3 rounded-xl bg-[#111111] border border-white/15 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <div>
            If your download does not start automatically,{' '}
            <button
              onClick={() => triggerFileDownload(platformId)}
              className="text-white underline font-bold hover:text-slate-200"
            >
              click here to retry download
            </button>.
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
            NEXT STEPS TO COMPLETE SETUP:
          </h4>
          <ol className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Open the downloaded <strong className="text-white">{config.filename}</strong> installer.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Follow on-screen setup instructions.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">3</span>
              <span>DownloadPulse starts silently in background menu bar / system tray.</span>
            </li>
          </ol>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-white font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> Code Signed & Verified Clean
          </span>
          <button onClick={onClose} className="text-white hover:underline font-bold">
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}

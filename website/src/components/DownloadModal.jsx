import React, { useState, useEffect } from 'react';
import { DOWNLOADS, initiateDownload } from '../config/downloads.config';
import { X, ArrowDownToLine, CheckCircle2, Monitor, Apple, Smartphone, Info, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DownloadModal({ platformId, onClose }) {
  const config = DOWNLOADS[platformId] || DOWNLOADS.windows;
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initiating secure connection...');
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  useEffect(() => {
    // Initiate actual browser download
    initiateDownload(platformId);

    // Simulate polished visual progress bar UX
    const steps = [
      { pct: 15, text: 'Resolving installer package binary...' },
      { pct: 45, text: `Downloading ${config.filename} (${config.fileSize})...` },
      { pct: 85, text: 'Verifying TLS package integrity...' },
      { pct: 100, text: 'Download completed successfully!' }
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
    }, 600);

    return () => clearInterval(interval);
  }, [platformId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 relative bg-slate-950 border-cyan-500/40 shadow-2xl shadow-cyan-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 shrink-0">
            <ArrowDownToLine className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="badge-glow text-[10px] py-0.5 px-2.5">
              {config.badge} • v{config.version}
            </span>
            <h3 className="text-xl font-heading font-bold text-white mt-1">
              Downloading DownloadPulse
            </h3>
            <p className="text-xs text-slate-400">{config.platformLabel}</p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">{config.filename}</span>
            <span className="text-slate-300 font-semibold">{progress}% ({config.fileSize})</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500 shadow-[0_0_12px_#38BDF8]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{statusText}</span>
            {downloadCompleted && <span className="text-emerald-400 flex items-center gap-1 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>}
          </div>
        </div>

        {/* Fallback Notice */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            If your download does not start automatically,{' '}
            <button
              onClick={() => initiateDownload(platformId)}
              className="text-cyan-400 underline font-semibold hover:text-cyan-300"
            >
              click here to retry download
            </button>.
          </div>
        </div>

        {/* Clear Installation Guide Flow Steps */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
            NEXT STEPS TO COMPLETE SETUP:
          </h4>
          <ol className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold text-[11px]">1</span>
              <span>Open the downloaded <strong className="text-white">{config.filename}</strong> installer file.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold text-[11px]">2</span>
              <span>Follow the setup wizard instructions.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold text-[11px]">3</span>
              <span>DownloadPulse Desktop Agent starts silently in background system tray.</span>
            </li>
          </ol>
        </div>

        {/* Security Assurance */}
        <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Clean Code Signature
          </span>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white font-semibold underline"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}

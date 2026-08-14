import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle2, Laptop, Smartphone, Terminal, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { DownloadPackage } from '../types';

interface DownloadModalProps {
  pkg: DownloadPackage | null;
  user: any;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ pkg, user, onClose, onOpenAuth }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  useEffect(() => {
    if (!pkg || !user) return;
    setDownloadProgress(0);
    setDownloadComplete(false);

    // Trigger real file download from /downloads/
    const filenameMap: Record<string, string> = {
      mac: 'DownloadPulse.dmg',
      windows: 'DownloadPulse-Setup.exe',
      android: 'DownloadPulse.apk',
      linux: 'DownloadPulse.AppImage'
    };

    const targetFilename = filenameMap[pkg.id] || pkg.filename;
    const downloadUrl = `/downloads/${targetFilename}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = targetFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          setDownloadComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [pkg, user]);

  if (!pkg) return null;

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(index);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-white/20 bg-white text-black font-extrabold flex items-center justify-center text-xl shadow-lg shrink-0">
            {pkg.id === 'android' ? <Smartphone className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-2xl font-serif font-normal text-white flex items-center gap-2">
              <span>Downloading {pkg.filename}</span>
              {downloadComplete && (
                <span className="text-[10px] font-mono text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30 uppercase tracking-widest">
                  Ready
                </span>
              )}
            </h3>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              {pkg.name} • {pkg.size} • {pkg.version}
            </p>
          </div>
        </div>

        {/* Simulated Download Progress */}
        <div className="space-y-2 bg-zinc-900 p-4 rounded-xl border border-white/10 font-mono text-xs">
          <div className="flex justify-between items-center text-zinc-300">
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span>{downloadComplete ? 'Download Complete!' : 'Downloading package payload...'}</span>
            </span>
            <span>{downloadProgress}%</span>
          </div>

          <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-zinc-300 via-white to-emerald-400 h-full transition-all duration-150"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>

          {downloadComplete && (
            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>File saved as <strong className="text-white">{pkg.filename}</strong>. If download didn't start, click below.</span>
            </p>
          )}
        </div>

        {/* Step-by-Step Installation Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Next Steps to Complete Installation</span>
          </h4>

          <div className="space-y-2">
            {pkg.instructions.map((step, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 flex items-start space-x-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-zinc-300 leading-relaxed flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
          <span className="text-xs font-mono text-zinc-500">
            SHA256: {pkg.sha256}
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all text-center cursor-pointer"
            >
              Done & Launch App
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

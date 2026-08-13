import React from 'react';
import { Download, Laptop, Smartphone, Zap, Shield, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import { DownloadPackage } from '../types';
import { PACKAGES } from './DownloadSection';

interface HeroProps {
  onOpenDownloadModal: (pkg: DownloadPackage) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDownloadModal }) => {
  const macPkg = PACKAGES.find((p) => p.id === 'mac') || PACKAGES[0];
  const winPkg = PACKAGES.find((p) => p.id === 'windows') || PACKAGES[1];
  const apkPkg = PACKAGES.find((p) => p.id === 'android') || PACKAGES[2];

  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/10 via-zinc-800/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full"></div>

      <div className="text-center space-y-6 max-w-4xl mx-auto">
        
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono tracking-widest text-white/80 uppercase shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          <span>PULSE v2.4.2 UNIVERSAL RELEASE</span>
        </div>

        {/* Main Headline with High-End Serif Styling from Professional Polish */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.08] font-normal">
          Refined Connectivity.
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Experience the seamless bridge between your workspace and your palm. Instant synchronization, zero latency across MacBook IDE and mobile devices.
        </p>

        {/* Main Download Call To Actions - Professional Polish Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Mac Download Button */}
          <button
            onClick={() => onOpenDownloadModal(macPkg)}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest rounded-full transition-all transform active:scale-95 shadow-2xl flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Pulse.dmg (macOS)</span>
          </button>

          {/* Windows Download Button */}
          <button
            onClick={() => onOpenDownloadModal(winPkg)}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/20 text-white hover:bg-white hover:text-black font-semibold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Laptop className="w-4 h-4 opacity-70" />
            <span>Pulse.exe (Windows)</span>
          </button>

          {/* Android APK Download Button */}
          <button
            onClick={() => onOpenDownloadModal(apkPkg)}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/20 text-white hover:bg-white hover:text-black font-semibold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 opacity-70" />
            <span>Pulse.apk (Android)</span>
          </button>
        </div>

        {/* Technical Capabilities Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400 border-t border-white/10 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Sub-4ms Sync Speed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-white" />
            <span>AES-256 P2P Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Zero Cloud Logging</span>
          </div>
        </div>

      </div>
    </section>
  );
};

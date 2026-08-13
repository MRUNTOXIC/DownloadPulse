import React from 'react';
import { Laptop, Smartphone, Terminal, Radio, Github, Shield } from 'lucide-react';
import { PACKAGES } from './DownloadSection';
import { DownloadPackage } from '../types';

interface FooterProps {
  onOpenDownloadModal: (pkg: DownloadPackage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDownloadModal }) => {
  const macPkg = PACKAGES.find((p) => p.id === 'mac') || PACKAGES[0];
  const winPkg = PACKAGES.find((p) => p.id === 'windows') || PACKAGES[1];
  const apkPkg = PACKAGES.find((p) => p.id === 'android') || PACKAGES[2];

  return (
    <footer className="bg-white text-black py-16 px-6 sm:px-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main 3 Download Action Columns from Professional Polish */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Windows Column */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">
              Windows Enterprise
            </div>
            <button
              onClick={() => onOpenDownloadModal(winPkg)}
              className="group flex items-center justify-between border-b border-black/10 pb-4 text-left cursor-pointer"
            >
              <div>
                <div className="text-2xl font-serif font-normal">Download pulse.exe</div>
                <div className="text-[10px] font-mono opacity-60 mt-1">v2.4.2 • 92.6MB • x64</div>
              </div>
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all font-bold text-lg shrink-0">
                ↓
              </div>
            </button>
          </div>

          {/* macOS Column */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">
              macOS Universal
            </div>
            <button
              onClick={() => onOpenDownloadModal(macPkg)}
              className="group flex items-center justify-between border-b border-black/10 pb-4 text-left cursor-pointer"
            >
              <div>
                <div className="text-2xl font-serif font-normal">Download pulse.dmg</div>
                <div className="text-[10px] font-mono opacity-60 mt-1">v2.4.2 • 84.2MB • Apple Silicon</div>
              </div>
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all font-bold text-lg shrink-0">
                ↓
              </div>
            </button>
          </div>

          {/* Android Mobile Column */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">
              Android Mobile
            </div>
            <button
              onClick={() => onOpenDownloadModal(apkPkg)}
              className="group flex items-center justify-between border-b border-black/10 pb-4 text-left cursor-pointer"
            >
              <div>
                <div className="text-2xl font-serif font-normal">Download pulse.apk</div>
                <div className="text-[10px] font-mono opacity-60 mt-1">v2.4.2 • 28.4MB • Android 9+</div>
              </div>
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all font-bold text-lg shrink-0">
                ↓
              </div>
            </button>
          </div>

        </div>

        {/* Secondary Info & Copyright */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono opacity-60 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-tighter text-sm uppercase">PULSE</span>
            <span>— Refined IDE Connectivity & Mobile Notification Bridge</span>
          </div>
          <div>© 2026 PULSE Systems Inc. All rights reserved.</div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { PRODUCT_INFO } from '../config/downloads.config';

export default function Footer({ setActiveTab, onOpenDownload }) {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-lg">
                ⚡
              </div>
              <span className="font-heading font-black text-xl text-white tracking-tight">
                {PRODUCT_INFO.displayName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
              Universal cross-platform file activity monitoring system connecting Mac & Windows desktop workstations to mobile devices.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/20 text-white text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-slate-400">v{PRODUCT_INFO.version}</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Product & App
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Product Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('video-demo')} className="hover:text-white transition-colors">
                  MacBook & Mobile Demo
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('features')} className="hover:text-white transition-colors">
                  Features Suite
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('windows')} className="hover:text-white transition-colors">
                  Windows (.exe) Setup
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('macos')} className="hover:text-white transition-colors">
                  macOS (.dmg) Setup
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Download Center
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab('download')} className="hover:text-white transition-colors">
                  All Installers (.exe, .dmg, .apk)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('install')} className="hover:text-white transition-colors">
                  Installation Guides
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('android')} className="hover:text-white transition-colors">
                  Android APK Direct (.apk)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('ios')} className="hover:text-white transition-colors">
                  iOS App Store Page
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Security & Policy
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab('security')} className="hover:text-white transition-colors">
                  Security Architecture
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} DownloadPulse Inc. All rights reserved.
          </div>
          <div>
            Crafted for high-performance file activity monitoring.
          </div>
        </div>
      </div>
    </footer>
  );
}

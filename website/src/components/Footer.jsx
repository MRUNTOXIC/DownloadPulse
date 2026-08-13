import React from 'react';
import { PRODUCT_INFO } from '../config/downloads.config';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenDownload }) {
  return (
    <footer className="bg-[#05070D] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full bg-[#0E1424] rounded-[10px] flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                DownloadPulse
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Universal cross-platform file activity monitoring system connecting desktop workstations and mobile devices in real time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-slate-400 font-mono">v{PRODUCT_INFO.version}</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Product & App
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition-colors">
                  Product Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('features')} className="hover:text-cyan-400 transition-colors">
                  Features Suite
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-cyan-400 transition-colors">
                  Live Data Flow
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('windows')} className="hover:text-cyan-400 transition-colors">
                  Windows Desktop Agent
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('macos')} className="hover:text-cyan-400 transition-colors">
                  macOS Desktop Agent
                </button>
              </li>
            </ul>
          </div>

          {/* Download & Install */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Download Center
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab('download')} className="hover:text-cyan-400 transition-colors">
                  All Installers (.exe, .dmg, .apk)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('install')} className="hover:text-cyan-400 transition-colors">
                  Installation Guides
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('android')} className="hover:text-cyan-400 transition-colors">
                  Android APK Direct
                </button>
              </li>
              <li>
                <button onClick={() => onOpenDownload('ios')} className="hover:text-cyan-400 transition-colors">
                  iOS App Store Page
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Security & Docs
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab('security')} className="hover:text-cyan-400 transition-colors">
                  Security Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('docs')} className="hover:text-cyan-400 transition-colors">
                  Documentation & API
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} DownloadPulse Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for seamless cross-platform file monitoring.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

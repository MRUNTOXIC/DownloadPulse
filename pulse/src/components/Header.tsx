import React, { useState } from 'react';
import { Download, Laptop, Smartphone, Radio, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { PACKAGES } from './DownloadSection';
import { DownloadPackage } from '../types';

interface HeaderProps {
  onOpenDownloadModal: (pkg: DownloadPackage) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDownloadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#050505]/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="text-2xl font-bold tracking-tighter text-white flex items-center gap-1.5 font-sans">
            PULSE
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-10 text-xs uppercase tracking-widest text-white/60">
          <a href="#3d-core" className="hover:text-white transition-colors">3D Core</a>
          <a href="#demo-video" className="hover:text-white transition-colors">Live Demo</a>
          <a href="#setup" className="hover:text-white transition-colors">Pairing</a>
          <a href="#features" className="hover:text-white transition-colors">Architecture</a>
          <a href="#download" className="hover:text-white transition-colors">Downloads</a>
        </nav>

        {/* Action Download Dropdown */}
        <div className="hidden sm:flex items-center space-x-3 relative">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-6 py-2 border border-white/20 rounded-full text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all cursor-pointer flex items-center space-x-2 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/20 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-in fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                  Select Platform
                </div>
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      onOpenDownloadModal(pkg);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white hover:text-black transition-all flex items-center justify-between text-zinc-300 group"
                  >
                    <div className="flex items-center space-x-2">
                      {pkg.id === 'mac' && <Laptop className="w-3.5 h-3.5 opacity-60" />}
                      {pkg.id === 'windows' && <Laptop className="w-3.5 h-3.5 opacity-60" />}
                      {pkg.id === 'android' && <Smartphone className="w-3.5 h-3.5 text-white" />}
                      {pkg.id === 'linux' && <Laptop className="w-3.5 h-3.5 opacity-60" />}
                      <span className="font-semibold">{pkg.filename}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider opacity-50">{pkg.size}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/60 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/10 p-6 space-y-4 text-xs uppercase tracking-widest text-white/70 animate-in fade-in">
          <a href="#3d-core" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">3D Core Model</a>
          <a href="#demo-video" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Video Simulator</a>
          <a href="#setup" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Pairing Guide</a>
          <a href="#download" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">Download Pulse (.dmg, .exe, .apk)</a>
        </div>
      )}
    </header>
  );
};

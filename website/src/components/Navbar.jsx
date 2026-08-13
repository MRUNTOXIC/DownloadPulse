import React, { useState, useEffect } from 'react';
import { Download, Menu, X, ArrowRight } from 'lucide-react';
import { detectUserPlatform } from '../utils/platform';
import { PRODUCT_INFO } from '../config/downloads.config';

export default function Navbar({ onOpenDownload, activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userPlatform = detectUserPlatform();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Product' },
    { id: 'video-demo', label: 'Mac & Mobile Demo' },
    { id: 'features', label: 'Features' },
    { id: 'download', label: 'Download Center' },
    { id: 'install', label: 'Install Guide' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl shadow-lg shadow-white/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <span className="font-heading font-black text-xl text-white tracking-tight flex items-center gap-2">
              {PRODUCT_INFO.displayName}
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase -mt-1">
              Activity Monitor
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F0F0F] p-1.5 rounded-full border border-white/10 backdrop-blur-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                if (link.id === 'home' || link.id === 'video-demo' || link.id === 'features') {
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                activeTab === link.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => alert('DownloadPulse Sign In — Pair your desktop agent & mobile app.')}
            className="text-slate-300 hover:text-white text-xs font-mono font-bold px-4 py-2 hover:bg-white/5 rounded-full transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => onOpenDownload(userPlatform.id)}
            className="btn-luxury-white py-2.5 px-6 text-sm font-bold shadow-xl shadow-white/20 flex items-center gap-2 group"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>Download</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-white bg-slate-900 border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-xl font-mono text-sm ${
                  activeTab === link.id ? 'bg-white text-black font-bold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenDownload(userPlatform.id);
                setMobileMenuOpen(false);
              }}
              className="btn-luxury-white w-full py-3 text-center justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Download ({userPlatform.name})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

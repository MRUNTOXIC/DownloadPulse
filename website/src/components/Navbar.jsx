import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Monitor, Menu, X, ArrowRight } from 'lucide-react';
import { detectUserPlatform } from '../utils/platform';

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
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'download', label: 'Download Center' },
    { id: 'security', label: 'Security' },
    { id: 'docs', label: 'Docs' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070A11]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-cyan-950/20'
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all">
            <div className="w-full h-full bg-[#0E1424] rounded-[11px] flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
              DownloadPulse
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38BDF8] animate-pulse" />
            </span>
            <span className="block text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
              Activity Monitoring
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                if (link.id === 'home' || link.id === 'features' || link.id === 'how-it-works') {
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === link.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => alert('DownloadPulse Authentication Portal — Sign in to pair your connected devices.')}
            className="text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => onOpenDownload(userPlatform.id)}
            className="btn-primary py-2.5 px-5 text-sm rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 group"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>Download</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0E1A] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-xl font-medium text-base ${
                  activeTab === link.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300'
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
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download ({userPlatform.name})</span>
            </button>
            <button
              onClick={() => {
                alert('DownloadPulse Authentication Portal — Sign in to pair your connected devices.');
                setMobileMenuOpen(false);
              }}
              className="btn-secondary w-full py-3 text-center"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

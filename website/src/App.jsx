import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero3DModel from './components/Hero3DModel';
import PlatformDetector from './components/PlatformDetector';
import VideoDemoShowcase from './components/VideoDemoShowcase';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

import DownloadPage from './pages/DownloadPage';
import InstallPage from './pages/InstallPage';
import SecurityPage from './pages/SecurityPage';

import DownloadModal from './components/DownloadModal';
import { detectUserPlatform } from './utils/platform';
import { PRODUCT_INFO } from './config/downloads.config';
import { Download, ArrowRight, ShieldCheck, Zap, Smartphone, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [downloadModalPlatform, setDownloadModalPlatform] = useState(null);

  const handleOpenDownload = (platformId) => {
    setDownloadModalPlatform(platformId || detectUserPlatform().id);
  };

  const handleCloseDownloadModal = () => {
    setDownloadModalPlatform(null);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenDownload={handleOpenDownload}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden bg-gradient-to-b from-black via-[#080808] to-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 mb-6">
                  <span className="badge-monochrome text-xs py-1.5 px-4">
                    <span className="pulse-dot-white" />
                    REAL-TIME FILE MONITORING SYSTEM
                  </span>
                </div>
                
                {/* Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
                  Know what happens to your files.{' '}
                  <span className="text-gradient-white block mt-1">Every second. Everywhere.</span>
                </h1>

                {/* Subheading */}
                <p className="mt-6 text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
                  {PRODUCT_INFO.displayName} connects your Mac, Windows PCs, and mobile devices so you stay informed about file downloads, copies, extractions, and USB activity in real time.
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => handleOpenDownload()}
                    className="btn-luxury-white py-4 px-9 text-lg shadow-2xl rounded-full w-full sm:w-auto flex items-center justify-center gap-3 group"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    <span>Download DownloadPulse</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('video-demo');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-luxury-dark py-4 px-8 text-lg rounded-full w-full sm:w-auto flex items-center justify-center gap-2 group"
                  >
                    <span>Watch MacBook & Phone Demo</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
                  </button>
                </div>

                {/* System Capabilities Bar */}
                <div className="mt-10 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-mono text-slate-400 py-3 px-6 rounded-full bg-slate-950 border border-white/15">
                  <span className="flex items-center gap-2 text-white">
                    <Zap className="w-4 h-4 text-white" /> &lt; 15ms Latency Sync
                  </span>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-4 h-4 text-white" /> Zero File Content Uploaded
                  </span>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span className="flex items-center gap-2 text-white">
                    <Smartphone className="w-4 h-4 text-white" /> iOS & Android Mobile Alerts
                  </span>
                </div>

                {/* Platform Auto-Detector Recommendation Banner */}
                <PlatformDetector onOpenDownload={handleOpenDownload} />

                {/* 3D Interactive Model */}
                <Hero3DModel />
              </div>
            </section>

            {/* Interactive Mini Video Showcase (MacBook -> Mobile Notification) */}
            <div id="video-demo">
              <VideoDemoShowcase />
            </div>

            {/* Features Suite */}
            <FeaturesSection />

            {/* Security Architecture */}
            <SecurityPage />
          </>
        )}

        {/* Dedicated Page Router */}
        {activeTab === 'download' && <DownloadPage onOpenDownload={handleOpenDownload} />}
        {activeTab === 'install' && <InstallPage onOpenDownload={handleOpenDownload} />}
        {activeTab === 'security' && <SecurityPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenDownload={handleOpenDownload} />

      {/* Download Modal Overlay */}
      {downloadModalPlatform && (
        <DownloadModal
          platformId={downloadModalPlatform}
          onClose={handleCloseDownloadModal}
        />
      )}
    </div>
  );
}

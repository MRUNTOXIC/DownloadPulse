import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import PlatformDetector from './components/PlatformDetector';
import FileFlow3D from './components/FileFlow3D';
import FeaturesSection from './components/FeaturesSection';
import BackgroundAgentSection from './components/BackgroundAgentSection';
import LiveMonitoringDemo from './components/LiveMonitoringDemo';
import SecuritySection from './components/SecuritySection';
import Footer from './components/Footer';

import DownloadPage from './pages/DownloadPage';
import InstallPage from './pages/InstallPage';
import SecurityPage from './pages/SecurityPage';
import DocsPage from './pages/DocsPage';

import DownloadModal from './components/DownloadModal';
import { detectUserPlatform } from './utils/platform';

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
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenDownload={handleOpenDownload}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Router Content */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <section className="pt-28 pb-12 relative overflow-hidden bg-gradient-to-b from-[#070A11] via-[#0B101D] to-[#070A11]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <span className="badge-glow mb-6">
                  REAL-TIME FILE ACTIVITY MONITORING
                </span>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
                  Know what happens to your files in <span className="text-gradient">real-time</span>.
                </h1>

                <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                  DownloadPulse connects your computers and mobile devices so you can stay informed about file downloads, copies, and USB activity from anywhere.
                </p>

                {/* Primary Action CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => handleOpenDownload()}
                    className="btn-primary py-4 px-8 text-base shadow-xl shadow-cyan-500/30 rounded-2xl w-full sm:w-auto"
                  >
                    <span>Download DownloadPulse</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('how-it-works');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-secondary py-4 px-8 text-base rounded-2xl w-full sm:w-auto"
                  >
                    <span>Explore how it works</span>
                  </button>
                </div>

                {/* Platform Auto-Detector Recommendation Banner */}
                <PlatformDetector onOpenDownload={handleOpenDownload} />

                {/* 3D Interactive Core Visual */}
                <Hero3D />
              </div>
            </section>

            {/* Interactive 3D/Visual File Flow */}
            <FileFlow3D />

            {/* Live Interactive Dashboard Demo */}
            <LiveMonitoringDemo />

            {/* Features Grid */}
            <FeaturesSection />

            {/* Silent Background Agent Explanation */}
            <BackgroundAgentSection />

            {/* Security Section */}
            <SecuritySection />
          </>
        )}

        {/* Dedicated Page Views */}
        {activeTab === 'download' && <DownloadPage onOpenDownload={handleOpenDownload} />}
        {activeTab === 'install' && <InstallPage onOpenDownload={handleOpenDownload} />}
        {activeTab === 'security' && <SecurityPage />}
        {activeTab === 'docs' && <DocsPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenDownload={handleOpenDownload} />

      {/* Interactive Download Progress Modal */}
      {downloadModalPlatform && (
        <DownloadModal
          platformId={downloadModalPlatform}
          onClose={handleCloseDownloadModal}
        />
      )}
    </div>
  );
}

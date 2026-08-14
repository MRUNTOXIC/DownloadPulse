import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ThreeCanvas } from './components/ThreeCanvas';
import { VideoSimulator } from './components/VideoSimulator';
import { DownloadSection } from './components/DownloadSection';
import { SetupGuide } from './components/SetupGuide';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { AuthModal } from './components/AuthModal';
import { DownloadPackage } from './types';
import { Sparkles, Eye, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<DownloadPackage | null>(null);
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('downloadpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPackage, setPendingPackage] = useState<DownloadPackage | null>(null);

  const handleOpenDownloadModal = (pkg: DownloadPackage) => {
    if (!user) {
      setPendingPackage(pkg);
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedPackage(pkg);
  };

  const handleAuthSuccess = (loggedUser: any) => {
    setUser(loggedUser);
    if (pendingPackage) {
      setSelectedPackage(pendingPackage);
      setPendingPackage(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('downloadpulse_user');
    localStorage.removeItem('downloadpulse_token');
    setUser(null);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <Header
        onOpenDownloadModal={handleOpenDownloadModal}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-16 lg:space-y-24 pb-20">
        
        {/* Hero Section */}
        <Hero onOpenDownloadModal={handleOpenDownloadModal} />

        {/* Section 1: Interactive 3D Model Explorer */}
        <section id="3d-core" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>REAL-TIME WEBGL CANVAS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Interactive 3D Engine Core
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono max-w-md">
              Orbit the 3D metallic core. Toggle wireframe view or emit data pulses to inspect the dual-channel data pipeline architecture.
            </p>
          </div>

          <ThreeCanvas />
        </section>

        {/* Section 2: Requested Mini Video Demonstration (IDE -> Phone Sync) */}
        <section id="demo-video" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
                <Eye className="w-3.5 h-3.5" />
                <span>VIDEO DEMONSTRATION</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                See Pulse in Action: MacBook to Mobile
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono max-w-md">
              Watch how the background daemon connected inside MacBook transmits terminal events instantly to the mobile lock screen.
            </p>
          </div>

          {/* Mini Video Simulator */}
          <VideoSimulator />
        </section>

        {/* Section 3: Setup & Mobile Pairing Guide */}
        <SetupGuide />

        {/* Section 4: Download Hub */}
        <DownloadSection onOpenModal={handleOpenDownloadModal} />

        {/* Section 5: Architecture & Features */}
        <Features />

      </main>

      {/* Footer */}
      <Footer onOpenDownloadModal={handleOpenDownloadModal} />

      {/* Download Progress & Guide Modal */}
      <DownloadModal
        pkg={selectedPackage}
        user={user}
        onClose={handleCloseModal}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Google Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

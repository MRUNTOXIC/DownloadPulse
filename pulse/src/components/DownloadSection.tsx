import React, { useState } from 'react';
import { 
  Download, Laptop, Smartphone, Check, Copy, Shield, 
  Terminal, Sparkles, FileCode, ArrowDown, ExternalLink, QrCode
} from 'lucide-react';
import { DownloadPackage, PlatformId } from '../types';
import confetti from 'canvas-confetti';

interface DownloadSectionProps {
  onOpenModal: (pkg: DownloadPackage) => void;
}

export const PACKAGES: DownloadPackage[] = [
  {
    id: 'mac',
    name: 'Pulse for macOS',
    filename: 'Pulse.dmg',
    platformName: 'macOS 12.0+ (Apple Silicon & Intel)',
    iconName: 'Laptop',
    size: '84.2 MB',
    version: 'v2.4.2 (Latest)',
    releaseDate: 'August 2026',
    sha256: 'a89f71c3b...e492f1',
    recommended: true,
    type: '.dmg',
    instructions: [
      'Download Pulse.dmg to your Downloads directory.',
      'Double-click Pulse.dmg and drag PULSE to your Applications folder.',
      'Launch Pulse from Spotlight. The background daemon will initialize in your menu bar.',
      'Scan the displayed QR code with the Pulse mobile app.'
    ]
  },
  {
    id: 'windows',
    name: 'Pulse for Windows',
    filename: 'Pulse.exe',
    platformName: 'Windows 10 / 11 (64-bit)',
    iconName: 'Laptop',
    size: '92.6 MB',
    version: 'v2.4.2 (Latest)',
    releaseDate: 'August 2026',
    sha256: 'f412b90d2...a719c8',
    type: '.exe',
    instructions: [
      'Download Pulse.exe installer.',
      'Run Pulse.exe and complete the setup wizard.',
      'Pulse will register as a system tray background service.',
      'Pair with your Android device using the 6-digit sync key.'
    ]
  },
  {
    id: 'android',
    name: 'Pulse Mobile App',
    filename: 'Pulse.apk',
    platformName: 'Android 9.0+ (Direct APK)',
    iconName: 'Smartphone',
    size: '28.4 MB',
    version: 'v2.4.2 Mobile',
    releaseDate: 'August 2026',
    sha256: 'c39201f8e...9812a4',
    type: '.apk',
    instructions: [
      'Download Pulse.apk directly to your mobile device.',
      'Enable "Install from Unknown Sources" if prompted by Android security.',
      'Open Pulse.apk to complete mobile client setup.',
      'Grant notification permissions and scan your MacBook QR code.'
    ]
  },
  {
    id: 'linux',
    name: 'Pulse for Linux',
    filename: 'Pulse.AppImage',
    platformName: 'Linux x86_64 / Ubuntu / Arch',
    iconName: 'Terminal',
    size: '78.1 MB',
    version: 'v2.4.2 (Latest)',
    releaseDate: 'August 2026',
    sha256: 'd10291ba3...3381e0',
    type: '.AppImage',
    instructions: [
      'Download Pulse.AppImage.',
      'Run `chmod +x Pulse.AppImage` in terminal.',
      'Execute `./Pulse.AppImage --daemon` to initiate background listener.'
    ]
  }
];

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onOpenModal }) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const triggerDirectDownload = (pkg: DownloadPackage) => {
    // Trigger confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Create a real blob payload download
    const dummyContent = `PULSE IDE Background Sync Engine\nFilename: ${pkg.filename}\nVersion: ${pkg.version}\nPlatform: ${pkg.platformName}\n\nInstallation Command:\nFollow instructions in setup guide.`;
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pkg.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Open modal with step-by-step installation instructions
    onOpenModal(pkg);
  };

  const filteredPackages = PACKAGES.filter((p) => {
    if (activeTab === 'desktop') return p.id === 'mac' || p.id === 'windows' || p.id === 'linux';
    return p.id === 'android';
  });

  return (
    <section id="download" className="py-20 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono tracking-widest text-white/80 uppercase">
          <Download className="w-3.5 h-3.5 text-white" />
          <span>OFFICIAL RELEASE HUB (v2.4.2)</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight font-normal leading-tight">
          Download PULSE Desktop & Mobile
        </h2>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
          Install the background daemon on your MacBook or PC, then download the mobile client to pair devices instantly.
        </p>

        {/* Tab Selector */}
        <div className="inline-flex p-1 rounded-full border border-white/20 bg-white/5 mt-4">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'desktop'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Desktop (.dmg, .exe)</span>
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (.apk)</span>
          </button>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-3xl bg-[#0a0a0a] border p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-white/40 hover:shadow-2xl group ${
              pkg.recommended ? 'border-white/40 ring-1 ring-white/20' : 'border-white/10'
            }`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 right-8 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow">
                Recommended
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white">
                  {pkg.id === 'mac' && <Laptop className="w-6 h-6" />}
                  {pkg.id === 'windows' && <FileCode className="w-6 h-6" />}
                  {pkg.id === 'android' && <Smartphone className="w-6 h-6 text-white" />}
                  {pkg.id === 'linux' && <Terminal className="w-6 h-6" />}
                </div>
                <span className="font-mono text-xs text-white/60 border border-white/10 px-3 py-1 rounded-full">
                  {pkg.size}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-normal text-white">{pkg.name}</h3>
                <p className="text-xs text-white/50 mt-1">{pkg.platformName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-white/60">
                  <span>File:</span>
                  <span className="text-white font-bold">{pkg.filename}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Version:</span>
                  <span className="text-white/80">{pkg.version}</span>
                </div>
                <div className="flex justify-between text-white/60 text-[11px]">
                  <span>SHA-256:</span>
                  <span className="text-white/40 font-mono truncate max-w-[140px]">{pkg.sha256}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => triggerDirectDownload(pkg)}
                className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {pkg.filename}</span>
              </button>

              <button
                onClick={() => onOpenModal(pkg)}
                className="w-full py-2 bg-transparent text-white/50 hover:text-white text-xs font-mono uppercase tracking-widest transition-all text-center cursor-pointer"
              >
                View Setup Guide →
              </button>
            </div>
          </div>
        ))}

        {/* Extra Card for Android / iOS Mobile QR Quick Pair */}
        {activeTab === 'mobile' && (
          <div className="rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-white font-bold text-lg mb-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Mobile Scan Pairing</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scan this QR code from your mobile device to open the direct .apk installer link or iOS companion client.
              </p>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="bg-white p-4 rounded-xl mx-auto border border-white/20 shadow-xl flex items-center justify-center">
              <div className="w-32 h-32 bg-zinc-950 p-2 rounded flex flex-col justify-between items-center text-center">
                <QrCode className="w-24 h-24 text-white stroke-1" />
              </div>
            </div>

            <p className="text-[11px] font-mono text-center text-zinc-500">
              Direct APK installation link: <span className="text-zinc-300">https://pulse.ide/download/pulse.apk</span>
            </p>
          </div>
        )}
      </div>

      {/* Terminal Command One-Liner Box */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span>Developer Terminal Installation (macOS / Linux / Windows)</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Package Managers Supported</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Homebrew (macOS)', cmd: 'brew install pulse-ide' },
            { label: 'Winget (Windows)', cmd: 'winget install Pulse.IDE' },
            { label: 'NPM Global Daemon', cmd: 'npm install -g pulse-cli' }
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-900 p-3 rounded-xl border border-white/5 space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400">{item.label}</span>
              <div className="flex items-center justify-between bg-black px-2.5 py-1.5 rounded border border-white/5 font-mono text-xs text-zinc-200">
                <span className="truncate">{item.cmd}</span>
                <button
                  onClick={() => handleCopy(item.cmd)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  {copiedCmd === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

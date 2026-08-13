import React, { useState } from 'react';
import { 
  Laptop, Smartphone, QrCode, ShieldCheck, CheckCircle2, 
  ArrowRight, Key, RefreshCw, Terminal, Cpu, Radio, Sparkles, Copy, Check
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [syncKey, setSyncKey] = useState<string>('849-209');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const generateNewKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const p1 = Math.floor(100 + Math.random() * 900);
      const p2 = Math.floor(100 + Math.random() * 900);
      setSyncKey(`${p1}-${p2}`);
      setIsGenerating(false);
    }, 400);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(syncKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateConnection = () => {
    setIsConnected(true);
  };

  return (
    <section id="setup" className="py-20 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono tracking-widest text-white/80 uppercase">
          <Key className="w-3.5 h-3.5 text-white" />
          <span>INSTANT 60-SECOND PAIRING SETUP</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight font-normal leading-tight">
          How to Connect MacBook & Mobile App
        </h2>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
          Follow these 3 simple steps to connect your background IDE service with your mobile device using encrypted peer-to-peer pairing.
        </p>
      </div>

      {/* Step Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: 1,
            title: '1. Install Desktop App',
            subtitle: 'Download Pulse.dmg or Pulse.exe on your computer.',
            icon: Laptop
          },
          {
            step: 2,
            title: '2. Install Mobile App',
            subtitle: 'Download Pulse.apk or scan QR on your phone.',
            icon: Smartphone
          },
          {
            step: 3,
            title: '3. Enter 6-Digit Sync Key',
            subtitle: 'Pair securely without cloud account creation.',
            icon: Key
          }
        ].map((item) => (
          <button
            key={item.step}
            onClick={() => setActiveStep(item.step)}
            className={`p-8 rounded-3xl border text-left transition-all cursor-pointer ${
              activeStep === item.step
                ? 'bg-[#0a0a0a] border-white text-white shadow-2xl ring-1 ring-white/30'
                : 'bg-black/60 border-white/10 text-white/60 hover:text-white hover:border-white/25'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                activeStep === item.step ? 'bg-white text-black font-bold' : 'border border-white/20 text-white/60'
              }`}>
                STEP 0{item.step}
              </span>
              <item.icon className="w-5 h-5 opacity-80" />
            </div>
            <h3 className="text-xl font-serif font-normal text-white">{item.title}</h3>
            <p className="text-xs text-white/50 mt-1 font-light">{item.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Interactive Step Detail Canvas */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Step Explanation Text */}
        <div className="lg:col-span-6 space-y-6">
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-white/80">
                <Laptop className="w-4 h-4" />
                <span>MACBOOK & PC SETUP</span>
              </div>
              <h3 className="text-3xl font-serif font-normal text-white">Initialize the Background Service</h3>
              <p className="text-white/60 text-sm leading-relaxed font-light">
                When you run <code className="text-white bg-white/10 px-2 py-0.5 rounded font-mono">Pulse.dmg</code> or <code className="text-white bg-white/10 px-2 py-0.5 rounded font-mono">Pulse.exe</code>, the lightweight tray agent monitors your active local terminal sessions, VSCode builds, and Git hooks.
              </p>
              <ul className="space-y-2 text-xs text-white/70 font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Runs in system menu bar using &lt;10MB RAM</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Zero cloud server logging — end-to-end local encrypted TLS</span>
                </li>
              </ul>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-white/80">
                <Smartphone className="w-4 h-4" />
                <span>MOBILE CLIENT SETUP</span>
              </div>
              <h3 className="text-3xl font-serif font-normal text-white">Install Pulse.apk on Android</h3>
              <p className="text-white/60 text-sm leading-relaxed font-light">
                Download <code className="text-white bg-white/10 px-2 py-0.5 rounded font-mono">Pulse.apk</code> directly below and install it on your mobile device. Grant notification permissions so incoming developer alerts popup on your lock screen.
              </p>
              <ul className="space-y-2 text-xs text-white/70 font-mono">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Custom haptic vibration patterns per event priority</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Actionable notification buttons (e.g. "Rerun Build", "Cancel PR")</span>
                </li>
              </ul>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-white/80">
                <ShieldCheck className="w-4 h-4" />
                <span>SECURE PAIRING CODE</span>
              </div>
              <h3 className="text-3xl font-serif font-normal text-white">Pair MacBook with Mobile App</h3>
              <p className="text-white/60 text-sm leading-relaxed font-light">
                Enter this 6-digit secure pairing key into the mobile app, or point your phone camera at the QR code generated on your MacBook screen.
              </p>

              {/* Interactive Key Generator Box */}
              <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/60">Pairing Sync Key:</span>
                  <button
                    onClick={generateNewKey}
                    className="text-xs text-white/80 hover:text-white flex items-center space-x-1 font-mono cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Generate New</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[#050505] p-4 rounded-xl border border-white/15 font-mono text-2xl font-bold tracking-widest text-white">
                  <span>{syncKey}</span>
                  <button
                    onClick={copyKey}
                    className="p-1.5 rounded text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/40 font-mono">
                  <span>AES-256 GCM Encryption</span>
                  <span>Expires in 10:00</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setActiveStep((prev) => (prev % 3) + 1)}
              className="px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Next Step ({activeStep}/3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Live Simulator Widget */}
        <div className="lg:col-span-6 bg-black rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>LIVE PAIRING DIAGNOSTIC</span>
            </span>
            <span className="text-zinc-500">Port 8492</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-zinc-900 border border-white/5 space-y-1">
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>MacBook Daemon:</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Mobile Client Status:</span>
                <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isConnected ? 'PAIRED & CONNECTED' : 'READY TO PAIR'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Tunnel Encryption:</span>
                <span className="text-zinc-300">P2P TLS 1.3</span>
              </div>
            </div>

            {/* Test Connection Button */}
            <button
              onClick={handleSimulateConnection}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isConnected ? '✓ Connection Verified (<2.1ms)' : 'Simulate Mobile Pair Test'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

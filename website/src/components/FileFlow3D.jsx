import React, { useState, useEffect } from 'react';
import { Monitor, Cloud, Smartphone, Server, FileArchive, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FileFlow3D() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Computer File Event", desc: "User downloads project.zip (2.4 GB) on Windows/Mac PC" },
    { title: "Desktop Agent", desc: "Silent Agent detects filesystem change in < 50ms" },
    { title: "Encrypted Cloud Pipeline", desc: "Metadata payload encrypted & synced via HTTPS" },
    { title: "Mobile Push Notification", desc: "Push notification delivered to iOS/Android phone" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-glow mb-4">
            <span className="pulse-dot" /> Live Data Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            How File Activity Flows in Real-Time
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            From the instant a file is downloaded or copied on your desktop computer to your mobile notification screen in milliseconds.
          </p>
        </div>

        {/* 3D Visual Flow Container */}
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden bg-slate-950/80 border-cyan-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            
            {/* Step 1: Computer */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-500 ${
                activeStep === 0
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/40 border-white/10 opacity-70'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Monitor className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">Stage 1</div>
              <h3 className="text-lg font-heading font-bold text-white mt-1">Windows / Mac PC</h3>
              <p className="text-xs text-slate-400 mt-2">Target directory file event occurs</p>
              
              {/* Simulated File Capsule */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-3">
                <FileArchive className="w-5 h-5 text-cyan-400 animate-pulse" />
                <div>
                  <div className="text-xs font-mono font-bold text-white">project.zip</div>
                  <div className="text-[10px] text-slate-400">2.4 GB • Downloads</div>
                </div>
              </div>
            </div>

            {/* Step 2: Desktop Agent */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-500 ${
                activeStep === 1
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/40 border-white/10 opacity-70'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Server className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">Stage 2</div>
              <h3 className="text-lg font-heading font-bold text-white mt-1">Desktop Agent</h3>
              <p className="text-xs text-slate-400 mt-2">Native watcher captures change & hashes metadata</p>
              
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-mono text-slate-300">Latency: &lt; 15ms</span>
              </div>
            </div>

            {/* Step 3: Encrypted Cloud */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-500 ${
                activeStep === 2
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/40 border-white/10 opacity-70'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">Stage 3</div>
              <h3 className="text-lg font-heading font-bold text-white mt-1">Cloud Relay</h3>
              <p className="text-xs text-slate-400 mt-2">REST API dispatches encrypted notification token</p>
              
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> TLS 1.3 Encrypted
              </div>
            </div>

            {/* Step 4: Mobile Push Alert */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-500 ${
                activeStep === 3
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/40 border-white/10 opacity-70'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Stage 4</div>
              <h3 className="text-lg font-heading font-bold text-white mt-1">Mobile Push Alert</h3>
              <p className="text-xs text-slate-400 mt-2">Phone receives instant push notification card</p>
              
              {/* Mobile Notification Pop Card */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950 border border-cyan-500/40 shadow-lg">
                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase">
                  <span>⚡ NEW FILE ACTIVITY</span>
                  <span>Just Now</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">project.zip</div>
                <div className="text-[10px] text-slate-300">Downloaded • 2.4 GB</div>
              </div>
            </div>

          </div>

          {/* Step Progress Tracker */}
          <div className="mt-10 flex items-center justify-center gap-3">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeStep === idx ? 'w-10 bg-cyan-400 shadow-[0_0_10px_#38BDF8]' : 'w-2.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-xs font-mono text-slate-400 mt-3">
            {steps[activeStep].title}: {steps[activeStep].desc}
          </div>
        </div>
      </div>
    </section>
  );
}

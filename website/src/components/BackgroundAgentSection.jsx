import React from 'react';
import { Cpu, ShieldCheck, Zap, Battery, CheckCircle, Terminal, XCircle, Monitor } from 'lucide-react';

export default function BackgroundAgentSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#070A11] via-slate-950 to-[#070A11] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-14 relative overflow-hidden bg-slate-950/90 border border-cyan-500/30">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Left Column: Visual Agent Diagram */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-cyan-950/30 to-slate-950 border border-cyan-500/30 shadow-2xl relative">
                
                {/* Simulated Desktop System Tray Visual */}
                <div className="bg-[#0C1220] p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                      <Monitor className="w-4 h-4 text-cyan-400" /> SYSTEM TRAY AGENT
                    </div>
                    <span className="badge-glow text-[9px] py-0.5 px-2">Active</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Memory Footprint</span>
                    <span className="text-cyan-400 font-mono font-bold">&lt; 18 MB RAM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">CPU Usage</span>
                    <span className="text-emerald-400 font-mono font-bold">0.1% idle</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Terminal Window</span>
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" /> Not Required
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center text-xs font-mono text-cyan-300">
                  ⚡ Silent OS Daemon • Launches on Boot
                </div>

              </div>
            </div>

            {/* Right Column: Copy & Explanation */}
            <div>
              <span className="badge-glow mb-4">
                <Cpu className="w-4 h-4 text-cyan-400" /> Zero Terminal Required
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                Runs Silently in the Background While You Work
              </h2>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                The DownloadPulse Desktop Agent is a lightweight native service designed to operate silently in your computer's system tray (Windows) or menu bar (macOS).
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Install Once & Forget</h4>
                    <p className="text-xs text-slate-400 mt-0.5">No command line, no terminal scripts, and no manual restarting required.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ultra-Low Resource Impact</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Engineered to consume less than 18 MB RAM and 0.1% CPU so your workstation stays lightning fast.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Battery className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Laptop Battery Optimized</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Uses native kernel filesystem event APIs (FSEvents on Mac, ReadDirectoryChangesW on Windows) without wasteful polling.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

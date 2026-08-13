import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Monitor, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, Bell, Sparkles } from 'lucide-react';

export default function VideoDemoShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [activeStage, setActiveStage] = useState(0); // 0, 1, 2, 3

  const stages = [
    {
      id: 0,
      timestamp: "00:02",
      title: "1. MacBook App Connected",
      desc: "DownloadPulse runs silently in macOS Menu Bar (Meets-MacBook-Air.local connected)",
      tag: "MacBook Setup"
    },
    {
      id: 1,
      timestamp: "00:06",
      title: "2. File Downloaded on Mac",
      desc: "User downloads project_final_release.zip (2.4 GB) in Downloads folder",
      tag: "File Event"
    },
    {
      id: 2,
      timestamp: "00:10",
      title: "3. Silent Agent Capture",
      desc: "Background daemon captures event telemetry in < 15ms with zero CPU overhead",
      tag: "Instant Sync"
    },
    {
      id: 3,
      timestamp: "00:14",
      title: "4. Mobile Phone Notification",
      desc: "iPhone screen lights up with instant push alert preview card",
      tag: "Mobile Alert"
    }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1.25;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    // Map progress 0-100 to activeStage 0-3
    if (progress < 25) setActiveStage(0);
    else if (progress < 50) setActiveStage(1);
    else if (progress < 75) setActiveStage(2);
    else setActiveStage(3);
  }, [progress]);

  const handleSeek = (stageId) => {
    setActiveStage(stageId);
    setProgress(stageId * 25 + 2);
  };

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-monochrome mb-4">
            <span className="pulse-dot-white" /> Interactive Product Video Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight">
            See How MacBook & Mobile Connect
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Watch the step-by-step video simulation showing background agent monitoring on a MacBook and instant notification delivery to your phone.
          </p>
        </div>

        {/* Video Player Frame */}
        <div className="luxury-card max-w-5xl mx-auto overflow-hidden border-white/20 shadow-2xl">
          
          {/* Video Header Bar */}
          <div className="bg-[#0A0A0A] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-white font-bold tracking-wider ml-2">
                VIDEO SHOWCASE: MACBOOK ➔ MOBILE PUSH ALERT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                HD 60 FPS SIMULATION
              </span>
            </div>
          </div>

          {/* Video Screen Canvas */}
          <div className="relative bg-[#020202] aspect-video w-full flex items-center justify-center overflow-hidden border-b border-white/10 p-6 sm:p-12">
            
            {/* STAGE 0: MacBook Menu Bar App Connected */}
            {activeStage === 0 && (
              <div className="w-full max-w-2xl bg-[#0D0D0D] rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Simulated macOS Menu Bar */}
                <div className="bg-[#181818] p-3 rounded-xl border border-white/10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-xs font-mono text-white font-bold">
                    <Monitor className="w-4 h-4 text-white" />
                    <span>Meets-MacBook-Air.local</span>
                    <span className="text-slate-400">| macOS Monterey</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AGENT CONNECTED
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">ACTIVE WATCHER PATHS:</div>
                  <div className="p-3.5 rounded-xl bg-black border border-white/10 flex items-center justify-between text-xs font-mono text-slate-200">
                    <span>📁 /Users/meetjobanputra/Downloads</span>
                    <span className="text-emerald-400 font-bold">MONITORING</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black border border-white/10 flex items-center justify-between text-xs font-mono text-slate-200">
                    <span>💾 /Volumes/External_SSD_1TB</span>
                    <span className="text-emerald-400 font-bold">MONITORING</span>
                  </div>
                </div>

                <div className="mt-6 text-center text-xs font-mono text-slate-400">
                  Step 1: DownloadPulse Desktop Agent is running silently in the MacBook Menu Bar
                </div>
              </div>
            )}

            {/* STAGE 1: File Downloaded on Mac */}
            {activeStage === 1 && (
              <div className="w-full max-w-2xl bg-[#0D0D0D] rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> BROWSER DOWNLOAD DETECTED
                  </div>
                  <span className="text-xs font-mono text-white font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    JUST NOW
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-black border border-white/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-heading font-bold text-white">project_final_release.zip</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Path: /Users/meetjobanputra/Downloads/project_final_release.zip</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-white/10">
                      2.4 GB
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-full rounded-full" />
                  </div>
                  <div className="text-xs font-mono text-emerald-400 text-right font-bold">✓ Download Complete (100%)</div>
                </div>

                <div className="mt-6 text-center text-xs font-mono text-slate-400">
                  Step 2: Safari completes file download onto MacBook hard drive
                </div>
              </div>
            )}

            {/* STAGE 2: Silent Agent Capture */}
            {activeStage === 2 && (
              <div className="w-full max-w-2xl bg-[#0D0D0D] rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/30 flex items-center justify-center text-white mx-auto shadow-2xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Silent Background Capture
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  MacBook Agent intercepts kernel event in &lt; 15ms. Hashes metadata and dispatches TLS 1.3 encrypted payload to cloud relay.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black border border-white/10">
                    <div className="text-slate-400 text-[10px]">LATENCY</div>
                    <div className="text-white font-bold text-sm mt-0.5">&lt; 12 ms</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/10">
                    <div className="text-slate-400 text-[10px]">CPU USAGE</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">0.1%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-white/10">
                    <div className="text-slate-400 text-[10px]">ENCRYPTION</div>
                    <div className="text-white font-bold text-sm mt-0.5">TLS 1.3</div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: Mobile Phone Push Notification */}
            {activeStage === 3 && (
              <div className="w-full max-w-sm bg-black rounded-3xl border border-white/30 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-300 text-left">
                {/* Simulated iPhone Screen */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-white" />
                    <span>100%</span>
                  </div>
                </div>

                {/* Lock Screen Notification Pop */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/30 shadow-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-white font-heading">
                      <span>⚡ DownloadPulse</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    New File Downloaded on MacBook
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">project_final_release.zip</strong> (2.4 GB) was saved to Downloads directory on Meets-MacBook-Air.local.
                  </p>
                </div>

                <div className="mt-6 text-center text-xs font-mono text-emerald-400 font-bold">
                  ✓ Push Notification Received on iPhone
                </div>
              </div>
            )}

          </div>

          {/* Video Control Bar & Stage Selector */}
          <div className="p-6 bg-[#0A0A0A] space-y-4">
            
            {/* Timeline Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-white h-full rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Play/Pause Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={() => { setProgress(0); setActiveStage(0); setIsPlaying(true); }}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-slate-400">
                  {stages[activeStage].timestamp} / 00:16
                </span>
              </div>

              {/* Stage Step Jump Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {stages.map((stg) => (
                  <button
                    key={stg.id}
                    onClick={() => handleSeek(stg.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeStage === stg.id
                        ? 'bg-white text-black font-bold shadow-lg'
                        : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {stg.tag}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

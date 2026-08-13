import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Laptop, Smartphone, Radio, Zap, 
  Terminal, ShieldCheck, CheckCircle2, AlertTriangle, Bell, Volume2, VolumeX,
  Sliders, Send, ArrowRight, Activity, Cpu, Sparkles
} from 'lucide-react';
import { NotificationPayload } from '../types';

const INITIAL_PRESETS: NotificationPayload[] = [
  {
    id: '1',
    title: 'Production Build Succeeded',
    message: 'Applet deployment completed in 1.4s. 0 errors, 0 warnings.',
    appSource: 'VSCode',
    timestamp: 'Just now',
    type: 'success',
    latencyMs: 3.8
  },
  {
    id: '2',
    title: 'Git PR #482 Approved',
    message: 'Feature/cross-device-sync was merged into main by @lead-dev.',
    appSource: 'Git',
    timestamp: 'Just now',
    type: 'info',
    latencyMs: 4.2
  },
  {
    id: '3',
    title: 'Docker Heap Alert',
    message: 'Container pulse-relay memory utilization peaked at 88%.',
    appSource: 'Docker',
    timestamp: 'Just now',
    type: 'warning',
    latencyMs: 3.1
  },
  {
    id: '4',
    title: 'API Rate Limit Invoked',
    message: 'Gemini 2.5 Flash token burst detected from background daemon.',
    appSource: 'Terminal',
    timestamp: 'Just now',
    type: 'error',
    latencyMs: 2.9
  }
];

export const VideoSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Idle/Trigger, 1: Tunneling, 2: Delivered
  const [progress, setProgress] = useState<number>(0);
  const [activeNotification, setActiveNotification] = useState<NotificationPayload>(INITIAL_PRESETS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [latencyTimer, setLatencyTimer] = useState<number>(3.4);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Play haptic ping sound when notification reaches mobile phone
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08); // E6 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Browser audio policy fallback
    }
  };

  // Video cycle timer logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Loop video sequence with next preset
          setCurrentStep(0);
          return 0;
        }
        const next = prev + 1.25;

        // Step 1: MacBook event fires at 15%
        if (prev < 15 && next >= 15) {
          setCurrentStep(0);
        }
        // Step 2: Beam tunneling between 20% and 65%
        else if (prev < 20 && next >= 20) {
          setCurrentStep(1);
        }
        // Step 3: Delivered to phone at 70%
        else if (prev < 70 && next >= 70) {
          setCurrentStep(2);
          playNotificationSound();
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, soundEnabled]);

  const handleManualTrigger = (preset: NotificationPayload) => {
    setActiveNotification(preset);
    setLatencyTimer(parseFloat((2.5 + Math.random() * 2).toFixed(1)));
    setProgress(0);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const customPayload: NotificationPayload = {
      id: Date.now().toString(),
      title: customTitle,
      message: customMsg || 'Instant alert transmitted from MacBook IDE background app.',
      appSource: 'VSCode',
      timestamp: 'Just now',
      type: 'success',
      latencyMs: parseFloat((2.8 + Math.random() * 1.5).toFixed(1))
    };
    handleManualTrigger(customPayload);
    setCustomTitle('');
    setCustomMsg('');
    setShowCustomInput(false);
  };

  const resetVideo = () => {
    setProgress(0);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-950 border border-white/10 p-4 md:p-6 shadow-2xl space-y-6">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-full border border-white/20 bg-white/5 text-white">
            <Radio className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-normal text-white flex items-center gap-2">
              <span>Interactive Video Simulator</span>
              <span className="text-[10px] uppercase tracking-widest font-mono px-3 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                IDE → Phone Sync
              </span>
            </h3>
            <p className="text-xs text-white/60 font-light">
              MacBook background daemon captures terminal/editor events and pushes alerts to mobile in &lt;4ms.
            </p>
          </div>
        </div>

        {/* Video Player Control Actions */}
        <div className="flex items-center space-x-2 bg-black p-1.5 rounded-full border border-white/20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-bold text-xs uppercase tracking-widest flex items-center space-x-1.5 shadow cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play Video'}</span>
          </button>

          <button
            onClick={resetVideo}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Replay Video Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              soundEnabled ? 'text-white bg-white/20' : 'text-white/40 hover:text-white'
            }`}
            title="Toggle Notification Sound Ping"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Dual-Device Stage Canvas */}
      <div className="relative min-h-[420px] lg:min-h-[480px] bg-gradient-to-b from-black via-zinc-950 to-zinc-900 rounded-xl border border-white/10 p-4 sm:p-8 overflow-hidden flex flex-col justify-between">
        {/* Progress Bar Top Overlay */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-6 border border-white/5">
          <div 
            className="bg-gradient-to-r from-zinc-400 via-white to-emerald-400 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage Grid Layout: MacBook (Left) -> Beam (Center) -> iPhone (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          
          {/* Left Device: MacBook Pro Enclosure */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Laptop Notch Header Badge */}
            <div className="w-full max-w-md bg-zinc-900 rounded-t-xl border-t border-x border-white/15 p-2 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-0.5 rounded text-[11px] text-zinc-300 border border-white/5">
                <Laptop className="w-3 h-3 text-zinc-400" />
                <span>MacBook Pro (M3 Max)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                PULSE DAEMON RUNNING
              </div>
            </div>

            {/* Laptop Display Screen */}
            <div className="w-full max-w-md bg-black border border-white/10 p-3 sm:p-4 rounded-b-xl shadow-2xl space-y-3 relative overflow-hidden">
              {/* Background IDE Code Window */}
              <div className="bg-zinc-900/90 rounded-lg p-3 border border-white/5 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-500 text-[10px] pb-1.5 border-b border-white/5">
                  <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> ~/projects/pulse-core</span>
                  <span>PID: 84920</span>
                </div>
                <div className="text-zinc-400 space-y-1 text-[11px] leading-relaxed">
                  <p><span className="text-purple-400">$</span> pulse daemon --listen --key=pk_live_8f3a</p>
                  <p className="text-emerald-400">[PULSE] Connected to background tray service.</p>
                  <p className="text-zinc-500">[INFO] Monitoring terminal tasks & git events...</p>
                  
                  {currentStep >= 0 && (
                    <div className="mt-2 p-2 rounded bg-white/5 border border-white/10 text-white animate-pulse">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>EVENT DETECTED</span>
                        <span className="text-emerald-400">0.2ms</span>
                      </div>
                      <p className="font-sans font-bold text-xs mt-0.5">{activeNotification.title}</p>
                      <p className="font-sans text-[11px] text-zinc-300">{activeNotification.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* macOS System Menu Bar Indicator */}
              <div className="bg-zinc-900/70 p-2 rounded-lg border border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center space-x-2">
                  <Activity className="w-3.5 h-3.5 text-white animate-spin" />
                  <span className="text-white font-medium">Pulse Tray Service</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">0.02% CPU</span>
              </div>
            </div>

            {/* Laptop Base Stand Graphic */}
            <div className="w-3/4 h-2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded-b-lg border-t border-white/10 shadow-lg mt-0.5"></div>
          </div>

          {/* Middle Channel: Animated Data Transfer Conduit */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center my-4 lg:my-0 space-y-2">
            <div className="relative w-full flex items-center justify-center">
              {/* Connecting Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-zinc-700 via-white/40 to-zinc-700 relative overflow-hidden">
                {currentStep === 1 && (
                  <div className="absolute top-0 bottom-0 bg-white w-12 blur-xs animate-pulse transition-all duration-300" style={{ left: `${(progress % 100)}%` }}></div>
                )}
              </div>

              {/* Central Pulse Indicator Badge */}
              <div className={`absolute z-10 px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center space-x-1.5 shadow-xl transition-all duration-300 ${
                currentStep === 1 
                  ? 'bg-white text-black border-white scale-110 shadow-white/20 shadow-lg' 
                  : 'bg-zinc-900 text-zinc-400 border-white/10'
              }`}>
                <Zap className={`w-3.5 h-3.5 ${currentStep === 1 ? 'fill-black text-black animate-bounce' : 'text-zinc-400'}`} />
                <span className="font-semibold">{latencyTimer}ms</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              {currentStep === 0 && 'Awaiting Event'}
              {currentStep === 1 && 'Syncing Payload...'}
              {currentStep === 2 && 'Delivered'}
            </span>
          </div>

          {/* Right Device: 3D Mobile Phone Enclosure (iPhone / Android) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] bg-zinc-900 rounded-[38px] border-4 border-zinc-800 p-3 shadow-2xl space-y-3 ring-1 ring-white/10">
              
              {/* Dynamic Island Header */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center space-x-2 border border-white/5">
                <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
              </div>

              {/* Phone Screen Glass Display */}
              <div className="relative min-h-[300px] bg-black rounded-[28px] border border-white/10 p-4 flex flex-col justify-between overflow-hidden bg-grid-pattern">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1 px-1">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px]">5G</span>
                    <Radio className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>

                {/* Main Lock Screen Notification Banner */}
                <div className="my-auto space-y-3">
                  {currentStep === 2 ? (
                    <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/20 p-3.5 rounded-2xl shadow-2xl text-white transform transition-all duration-300 animate-in fade-in slide-in-from-top-4 space-y-2">
                      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-md bg-white text-black font-bold flex items-center justify-center text-[10px]">
                            P
                          </div>
                          <span className="font-semibold text-white">PULSE MOBILE</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">NOW • {latencyTimer}ms</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          {activeNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {activeNotification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                          {activeNotification.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                          {activeNotification.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                          <span>{activeNotification.title}</span>
                        </h4>
                        <p className="text-xs text-zinc-300 leading-snug">{activeNotification.message}</p>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                        <span>Source: {activeNotification.appSource}</span>
                        <span className="text-emerald-400 font-semibold">Verified Sync</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2 text-zinc-600">
                      <Bell className="w-8 h-8 mx-auto stroke-1 opacity-40 animate-pulse" />
                      <p className="text-xs font-mono">Waiting for MacBook event...</p>
                    </div>
                  )}
                </div>

                {/* Lock Screen Bottom Bar */}
                <div className="flex items-center justify-between text-zinc-500 text-[10px] pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Pulse.apk active</span>
                  </div>
                  <span className="font-mono">AES-256</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-zinc-400 mt-2 font-mono">Mobile App Connected</span>
          </div>

        </div>
      </div>

      {/* Interactive Trigger Control Sandbox */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Test Preset IDE Events (Click to Fire to Mobile)</span>
          </h4>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs text-zinc-300 hover:text-white underline underline-offset-4 flex items-center space-x-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showCustomInput ? 'Close Custom' : '+ Create Custom Alert'}</span>
          </button>
        </div>

        {/* Preset Notification Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {INITIAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleManualTrigger(preset)}
              className={`p-3 rounded-xl border text-left transition-all group ${
                activeNotification.id === preset.id
                  ? 'bg-white/10 border-white text-white shadow-lg'
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                <span>{preset.appSource}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs font-semibold text-white truncate">{preset.title}</p>
            </button>
          ))}
        </div>

        {/* Custom Event Creator Form */}
        {showCustomInput && (
          <form onSubmit={handleSendCustom} className="mt-3 p-4 bg-zinc-900 rounded-xl border border-white/15 space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Notification Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Deploy to Staging Successful"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Message Body</label>
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="e.g., All unit tests passed on commit 9a4f"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Trigger Custom Notification</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

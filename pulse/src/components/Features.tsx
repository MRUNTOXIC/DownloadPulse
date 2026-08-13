import React from 'react';
import { 
  Cpu, Shield, Zap, Terminal, Lock, Activity, 
  Share2, Radio, Server, CheckCircle2 
} from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono tracking-widest text-white/80 uppercase">
          <Cpu className="w-3.5 h-3.5 text-white" />
          <span>ENGINE ARCHITECTURE & SPECS</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight font-normal leading-tight">
          Engineered for Zero Distraction, Instant Awareness
        </h2>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
          PULSE is lightweight, secure, and stays out of your way until an actionable developer alert demands your attention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: Cpu,
            title: 'Ultra-Lightweight Daemon',
            desc: 'Consumes less than 10MB of RAM on macOS Apple Silicon or Windows x64. Written in low-overhead Rust & C++.'
          },
          {
            icon: Lock,
            title: 'Local TLS 1.3 Encryption',
            desc: 'All notifications travel directly over your Wi-Fi or local network using peer-to-peer encrypted channels. Zero cloud data storage.'
          },
          {
            icon: Zap,
            title: 'Sub-4ms Cross-Device Latency',
            desc: 'Instant payload transmission guarantees you get notified before you even switch focus away from your code.'
          },
          {
            icon: Terminal,
            title: 'Native IDE & CLI Support',
            desc: 'Integrates natively with VSCode, IntelliJ IDEA, Cursor, Neovim, Docker Desktop, and standard bash/zsh terminals.'
          },
          {
            icon: Activity,
            title: 'System Tray HUD',
            desc: 'Quick toggle controls directly from your macOS menu bar or Windows tray. View connected phone battery & sync status.'
          },
          {
            icon: Shield,
            title: 'Filtered Alert Rules',
            desc: 'Set custom filters so you only receive critical notifications (e.g., build errors, security flags, or long-running tasks).'
          }
        ].map((feat, idx) => (
          <div
            key={idx}
            className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all space-y-4 group"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
              <feat.icon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-normal text-white">{feat.title}</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { ShieldCheck, Lock, Key, Server, EyeOff, FileCheck } from 'lucide-react';

export default function SecuritySection() {
  const securityPillars = [
    {
      icon: Lock,
      title: "TLS 1.3 Transport Encryption",
      description: "All activity data transmitted between desktop agents, cloud API, and mobile applications is encrypted end-to-end using TLS 1.3 encryption."
    },
    {
      icon: Key,
      title: "Authenticated Device Pairing",
      description: "Each desktop and mobile device generates a cryptographically signed token. Only authorized paired devices can view activity events."
    },
    {
      icon: EyeOff,
      title: "No File Contents Uploaded",
      description: "DownloadPulse never reads or uploads actual file contents. Only metadata (filename, size, event type, timestamp) is logged."
    },
    {
      icon: Server,
      title: "Isolated Enterprise Storage",
      description: "Database collections use strict row-level authorization rules ensuring your event telemetry remains private to your account."
    }
  ];

  return (
    <section id="security" className="py-24 bg-[#070A11] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-glow mb-4 border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Enterprise Security
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Privacy & Security by Design
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Your file privacy is paramount. DownloadPulse monitors activity metadata while keeping your file contents strictly private on your computer.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-8 flex items-start gap-5 hover:border-cyan-500/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Banner */}
        <div className="mt-12 max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
          <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            DownloadPulse undergoes continuous code reviews and security audits. For vulnerability reporting or inquiries, contact <strong className="text-white">security@downloadpulse.io</strong>.
          </span>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { ShieldCheck, Lock, Key, Server, EyeOff, FileCheck } from 'lucide-react';

export default function SecurityPage() {
  const pillars = [
    {
      icon: Lock,
      title: "TLS 1.3 Transport Encryption",
      desc: "All telemetry events transmitted between desktop agents, cloud relay API, and mobile applications are encrypted end-to-end using TLS 1.3."
    },
    {
      icon: Key,
      title: "Authenticated Device Pairing",
      desc: "Each computer and phone generates a signed token. Only authorized paired devices can receive file notifications."
    },
    {
      icon: EyeOff,
      title: "No File Contents Uploaded",
      desc: "DownloadPulse never reads, uploads, or stores actual file contents. Only event metadata (filename, size, type, timestamp) is logged."
    },
    {
      icon: Server,
      title: "Isolated Enterprise Telemetry",
      desc: "Cloud databases enforce strict row-level device authorization rules, ensuring telemetry data remains isolated to your account."
    }
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-monochrome mb-4">
            <ShieldCheck className="w-4 h-4" /> Privacy & Security Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
            Security by Design
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            DownloadPulse provides real-time visibility while keeping your private file contents strictly on your local computer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="luxury-card p-8 flex items-start gap-5 hover:border-white/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

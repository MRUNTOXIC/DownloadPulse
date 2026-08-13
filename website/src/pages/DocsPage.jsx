import React from 'react';
import { BookOpen, Terminal, Code, Cpu, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-glow mb-4">
            Documentation & Developer Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            DownloadPulse Knowledge Base
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Learn how DownloadPulse connects your desktop agents to the cloud backend and mobile app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-panel p-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Desktop Agent Architecture</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The Desktop Agent registers OS native file system hooks (chokidar / FSEvents) to watch target paths like Downloads, Documents, and external drives.
            </p>
          </div>

          <div className="glass-panel p-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">REST API Endpoints</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Express backend API provides <code className="text-cyan-400">POST /api/activities</code> and <code className="text-cyan-400">GET /api/devices</code> endpoints for event telemetry.
            </p>
          </div>

          <div className="glass-panel p-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Mobile Push Service</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Integrates Expo Push Server SDK to dispatch real-time mobile push notifications directly to iOS & Android devices.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

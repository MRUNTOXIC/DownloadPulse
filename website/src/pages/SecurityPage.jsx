import React from 'react';
import SecuritySection from '../components/SecuritySection';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#070A11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SecuritySection />

        <div className="max-w-4xl mx-auto mt-12 p-8 rounded-3xl glass-panel border-cyan-500/30">
          <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" /> Data Privacy FAQ
          </h3>
          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <strong className="text-white block text-sm">Does DownloadPulse upload my downloaded files?</strong>
              <p className="mt-1 text-slate-400">No. DownloadPulse only tracks event telemetry metadata (file name, file size, activity type, and timestamp). Your actual file contents never leave your local device.</p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <strong className="text-white block text-sm">How are mobile push notifications secured?</strong>
              <p className="mt-1 text-slate-400">Push notification tokens are securely linked to your account session. Event payloads contain encrypted summary metadata sent directly over Apple APNs or Google FCM push channels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

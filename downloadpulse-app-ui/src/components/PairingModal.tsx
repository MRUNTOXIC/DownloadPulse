import React, { useState, useEffect } from "react";
import { X, Laptop, ShieldAlert, CheckCircle2, Clock, Monitor, RefreshCw } from "lucide-react";
import { deviceService } from "../services/deviceService";
import { Device, PairingSession } from "../types";

interface PairingModalProps {
  onClose: () => void;
  onDevicePaired: (device: Device) => void;
}

export const PairingModal: React.FC<PairingModalProps> = ({ onClose, onDevicePaired }) => {
  const [session, setSession] = useState<PairingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [simulatedDeviceName, setSimulatedDeviceName] = useState("Workstation-PC");
  const [isConfirming, setIsConfirming] = useState(false);
  const [pairedDevice, setPairedDevice] = useState<Device | null>(null);

  const startPairingSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await deviceService.startPairing();
      setSession(newSession);
      setTimeLeft(300);
    } catch (err: any) {
      setError(err.message || "Failed to generate pairing code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startPairingSession();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Simulate Desktop Agent entering the pairing code
  const handleSimulateAgentConfirm = async () => {
    if (!session?.code) return;
    setIsConfirming(true);
    setError(null);
    try {
      const device = await deviceService.confirmPairing(
        session.code,
        simulatedDeviceName,
        "windows"
      );
      setPairedDevice(device);
      onDevicePaired(device);
    } catch (err: any) {
      setError(err.message || "Pairing failed.");
    } finally {
      setIsConfirming(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-black" />
            <h3 className="font-bold text-lg text-gray-900">Pair New Computer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {pairedDevice ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">Computer Paired!</h4>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-bold text-black">{pairedDevice.name}</span> is
                now associated with your DownloadPulse account.
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-green-700 font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              STATUS: ONLINE (Heartbeat active)
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          /* Pairing Code Display & Desktop Agent Confirm Simulator */
          <div className="mt-4 space-y-5">
            <p className="text-xs text-gray-600 leading-relaxed">
              Open the <strong className="text-gray-900">DownloadPulse Desktop Agent</strong> on your PC or Mac and enter this temporary 6-digit pairing code:
            </p>

            {/* Code Box */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center relative">
              {loading ? (
                <div className="py-4 flex items-center gap-2 font-mono text-xs text-gray-600">
                  <RefreshCw className="w-4 h-4 animate-spin text-black" /> Generating Code...
                </div>
              ) : (
                <>
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-black">
                    {session?.code || "482931"}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Expires in: </span>
                    <span className="text-amber-600 font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Desktop Agent Simulation Controls */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-700 font-semibold">
                <span className="flex items-center gap-1.5 text-gray-900 font-bold">
                  <Monitor className="w-4 h-4 text-black" /> Simulate Desktop Agent
                </span>
                <span className="text-[10px] text-gray-400 font-normal">(Test Pairing Flow)</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-gray-600">Computer Name</label>
                <input
                  type="text"
                  value={simulatedDeviceName}
                  onChange={(e) => setSimulatedDeviceName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:border-black"
                  placeholder="e.g. Meets-PC or Gaming-Rig"
                />
              </div>

              <button
                onClick={handleSimulateAgentConfirm}
                disabled={isConfirming || timeLeft <= 0}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConfirming ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Code...
                  </>
                ) : (
                  "Confirm Pairing on Desktop Agent"
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={startPairingSession}
                className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Generate New Code
              </button>
              <button
                onClick={onClose}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


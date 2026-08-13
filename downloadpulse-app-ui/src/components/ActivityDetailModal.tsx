import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  HardDrive,
  Clock,
  Laptop,
  ShieldCheck,
  AlertTriangle,
  Folder,
  Download
} from "lucide-react";
import { Activity } from "../types";

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!activity) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(activity.destination);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedStarted = new Date(activity.startedAt).toLocaleString();
  const formattedCompleted = activity.completedAt
    ? new Date(activity.completedAt).toLocaleString()
    : "In Progress...";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white border border-gray-200 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-gray-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-800 border border-gray-200">
              {activity.activityType.replace("_", " ")}
            </span>
            <span className="text-xs text-gray-500 font-mono">ID: {activity.activityId}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Size */}
        <div className="my-4">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900 leading-snug break-all">
            {activity.filename}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="text-black font-semibold">{activity.fileSize}</span>
            <span>•</span>
            <span className="uppercase text-xs font-semibold text-gray-500">{activity.extension} Format</span>
          </div>
        </div>

        {/* Status Highlight Banner */}
        <div
          className={`p-4 rounded-2xl border mb-4 flex items-center justify-between ${
            activity.status === "COMPLETED"
              ? "bg-green-50 border-green-200 text-green-900"
              : activity.status === "FAILED" || activity.status === "CANCELLED"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              Status: {activity.status}
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {activity.status === "COMPLETED"
                ? "File activity verified & completed by Desktop Agent."
                : activity.status === "FAILED" || activity.status === "CANCELLED"
                ? `Activity terminated: ${activity.reason || "Cancelled by user"}`
                : "Active background transfer monitored in real-time."}
            </p>
          </div>
          {activity.status === "COMPLETED" ? (
            <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
          ) : activity.status === "FAILED" ? (
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          ) : (
            <Download className="w-6 h-6 text-blue-600 shrink-0 animate-bounce" />
          )}
        </div>

        {/* Detailed Metadata Grid */}
        <div className="space-y-3 text-xs">
          {/* Destination Path */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 text-[10px] uppercase font-bold mb-1">
              <span className="flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-black" /> Destination Filepath
              </span>
              <button
                onClick={handleCopyPath}
                className="flex items-center gap-1 text-black hover:underline cursor-pointer text-[10px] font-bold"
              >
                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy Path"}
              </button>
            </div>
            <p className="text-gray-800 break-all select-all font-mono text-xs bg-white p-2.5 rounded-lg border border-gray-200 mt-1">
              {activity.destination}
            </p>
          </div>

          {/* Drives & Source */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-[10px] text-gray-500 uppercase font-bold">Target Drive</div>
              <div className="text-gray-900 font-bold mt-0.5 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-black" />
                {activity.destinationDrive} Drive
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-[10px] text-gray-500 uppercase font-bold">Desktop Device</div>
              <div className="text-gray-900 font-bold mt-0.5 flex items-center gap-1 truncate">
                <Laptop className="w-3.5 h-3.5 text-black" />
                {activity.deviceName || "Meets-PC"}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-gray-500" /> Started At:
              </span>
              <span className="text-gray-900 font-semibold">{formattedStarted}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-gray-500" /> Completed At:
              </span>
              <span className="text-gray-900 font-semibold">{formattedCompleted}</span>
            </div>
          </div>
        </div>

        {/* Event Lifecycle Timeline */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">
            System Lifecycle Trace
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 text-gray-700">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-900 border border-gray-300 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Desktop Agent detected filesystem activity</span>
            </div>
            <div className="w-0.5 h-3 bg-gray-200 ml-2.5" />
            <div className="flex items-center gap-2.5 text-gray-700">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-900 border border-gray-300 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Cloud API logged activity state ({activity.status})</span>
            </div>
            <div className="w-0.5 h-3 bg-gray-200 ml-2.5" />
            <div className="flex items-center gap-2.5 text-gray-700">
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span>Expo Mobile App received real-time push update</span>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-sm transition-all cursor-pointer active:scale-98 shadow-sm"
        >
          Close Detail View
        </button>
      </div>
    </div>
  );
};


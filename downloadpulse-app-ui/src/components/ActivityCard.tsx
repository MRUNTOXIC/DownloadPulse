import React from "react";
import {
  Usb,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  FileText,
  FileVideo,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Activity } from "../types";

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  // Select icon based on file extension or type
  const getFileIcon = () => {
    const ext = activity.extension?.toLowerCase() || "";
    if (activity.activityType === "USB_TRANSFER") {
      return (
        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
          USB
        </div>
      );
    }
    if (["mp4", "mkv", "avi", "mov", "webm"].includes(ext)) {
      return (
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
          MP4
        </div>
      );
    }
    if (["zip", "tar", "gz", "7z", "rar", "xip", "iso"].includes(ext)) {
      return (
        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
          {ext.toUpperCase()}
        </div>
      );
    }
    if (["parquet", "csv", "xlsx", "json"].includes(ext)) {
      return (
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
          DATA
        </div>
      );
    }
    if (["js", "ts", "py", "rs", "cpp", "java", "html"].includes(ext)) {
      return (
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
          CODE
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
        FILE
      </div>
    );
  };

  // Select badge color & label
  const getStatusBadge = () => {
    switch (activity.status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-green-50 text-green-600 border border-green-100">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            Completed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">
            <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
            {activity.progress !== undefined ? `${activity.progress}%` : "Transferring"}
          </span>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-red-600 text-white border border-red-600">
            <XCircle className="w-3 h-3 text-white" />
            {activity.status === "CANCELLED" ? "Cancelled" : "Failed"}
          </span>
        );
      case "STARTED":
      case "STALLED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            {activity.status}
          </span>
        );
      default:
        return null;
    }
  };

  // Format timestamp e.g. "14:22 PM"
  const formattedTime = new Date(activity.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const isError = activity.status === "FAILED" || activity.status === "CANCELLED";

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group hover:shadow-sm ${
        isError
          ? "bg-red-50/70 border-red-100 hover:border-red-200"
          : "bg-white border-gray-100 hover:border-gray-300"
      }`}
    >
      {/* Top row: File Icon, Filename, Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          {getFileIcon()}

          <div className="min-w-0">
            <h3 className={`font-bold text-sm truncate group-hover:text-black transition-colors ${
              isError ? "text-red-900" : "text-gray-900"
            }`}>
              {activity.filename}
            </h3>
            <p className={`text-xs mt-0.5 truncate ${
              isError ? "text-red-600" : "text-gray-500"
            }`}>
              {activity.activityType === "USB_TRANSFER" ? (
                <>
                  {activity.sourceDrive || "E:"} USB Drive → {activity.destinationDrive || "C:"} {activity.deviceName || "PC"} • {activity.fileSize}
                </>
              ) : (
                <>
                  {activity.destination} • {activity.fileSize}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {getStatusBadge()}
          <span className={`text-[10px] font-medium ${isError ? "text-red-400" : "text-gray-400"}`}>
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Progress Bar for IN_PROGRESS activities */}
      {activity.status === "IN_PROGRESS" && (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-gray-500">
            <span>Transferring...</span>
            <span className="text-blue-600 font-semibold">{activity.downloadSpeed || "24 MB/s"}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${activity.progress || 10}%` }}
            />
          </div>
        </div>
      )}

      {/* Failure Reason Alert */}
      {activity.reason && (
        <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">Reason: {activity.reason}</span>
        </div>
      )}
    </div>
  );
};


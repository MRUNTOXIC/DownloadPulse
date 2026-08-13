export type PlatformId = 'mac' | 'windows' | 'linux' | 'android' | 'ios';

export interface DownloadPackage {
  id: PlatformId;
  name: string;
  filename: string;
  platformName: string;
  iconName: string;
  size: string;
  version: string;
  releaseDate: string;
  sha256: string;
  recommended?: boolean;
  type: string; // e.g. '.dmg', '.exe', '.AppImage', '.apk'
  instructions: string[];
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  appSource: 'VSCode' | 'IntelliJ' | 'Terminal' | 'Docker' | 'Git';
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
  latencyMs: number;
}

export interface SyncStats {
  connectedDevices: number;
  daemonStatus: 'active' | 'syncing' | 'idle';
  avgLatency: string;
  packetsSent: number;
  uptime: string;
}

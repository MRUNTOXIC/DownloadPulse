export type ActivityType = 
  | 'DOWNLOAD' 
  | 'FILE_COPY' 
  | 'FILE_MOVE' 
  | 'FILE_CREATE' 
  | 'FILE_EXTRACT' 
  | 'USB_TRANSFER' 
  | 'UNKNOWN';

export type ActivityStatus = 
  | 'STARTED' 
  | 'IN_PROGRESS' 
  | 'STALLED' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface Activity {
  activityId: string;
  activityType: ActivityType;
  status: ActivityStatus;
  filename: string;
  extension: string;
  size: number;
  fileSize: string;
  source: string | null;
  destination: string;
  sourceDrive: string | null;
  destinationDrive: string;
  deviceId: string;
  deviceName?: string;
  startedAt: string;
  completedAt: string | null;
  timestamp: string;
  reason: string | null;
  progress?: number; // 0 to 100
  downloadSpeed?: string; // e.g., "18.4 MB/s"
}

export interface Device {
  deviceId: string;
  name: string;
  platform: 'windows' | 'macos' | 'linux';
  os: string;
  agentVersion: string;
  isOnline: boolean;
  lastHeartbeat: string;
  ipAddress?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface PairingSession {
  code: string;
  expiresAt: string;
  deviceId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED';
}

export interface PushNotificationPayload {
  id: string;
  activityId: string;
  title: string;
  body: string;
  timestamp: string;
  type: ActivityType;
  read: boolean;
  isRead?: boolean;
}

export type NotificationItem = PushNotificationPayload;

export interface PushTokenRegistration {
  expoPushToken: string;
  platform: 'ios' | 'android' | 'web';
  deviceId?: string;
}

export interface ActivityFilterOptions {
  q?: string;
  status?: ActivityStatus | 'ALL';
  type?: ActivityType | 'ALL';
  page?: number;
  limit?: number;
}

import { apiRequest } from "./api";
import { Activity, PushNotificationPayload } from "../types";

export const simulatorService = {
  async triggerActivity(payload: {
    filename: string;
    activityType?: string;
    status?: string;
    fileSize?: string;
    source?: string;
    destination?: string;
    sourceDrive?: string;
    destinationDrive?: string;
    reason?: string;
    progress?: number;
    downloadSpeed?: string;
  }): Promise<Activity> {
    const res = await apiRequest<{ success: boolean; activity: Activity }>("/simulate/activity", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return res.activity;
  },

  async toggleDeviceOnline(deviceId: string, isOnline: boolean): Promise<void> {
    await apiRequest("/simulate/device-toggle", {
      method: "POST",
      body: JSON.stringify({ deviceId, isOnline })
    });
  },

  async toggleDeviceStatus(deviceId: string, isOnline: boolean): Promise<void> {
    return this.toggleDeviceOnline(deviceId, isOnline);
  },

  async getNotifications(): Promise<PushNotificationPayload[]> {
    const res = await apiRequest<{ notifications: PushNotificationPayload[] }>("/notifications");
    return res.notifications;
  }
};

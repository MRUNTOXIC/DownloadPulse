import { apiRequest } from "./api";
import { Activity, ActivityFilterOptions, PushNotificationPayload } from "../types";

export const activityService = {
  async getActivities(options: ActivityFilterOptions = {}): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (options.q) params.set("q", options.q);
    if (options.status && options.status !== "ALL") params.set("status", options.status);
    if (options.type && options.type !== "ALL") params.set("type", options.type);
    if (options.page) params.set("page", options.page.toString());
    if (options.limit) params.set("limit", options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await apiRequest<{ activities: Activity[] }>(`/activities${queryString}`);
    return res.activities || [];
  },

  async getActivityById(id: string): Promise<Activity> {
    const res = await apiRequest<{ activity: Activity }>(`/activities/${id}`);
    return res.activity;
  },

  async getNotifications(): Promise<PushNotificationPayload[]> {
    const res = await apiRequest<{ notifications: PushNotificationPayload[] }>("/notifications");
    return (res.notifications || []).map(n => ({ ...n, isRead: n.read || n.isRead }));
  },

  async markNotificationsAsRead(): Promise<void> {
    await apiRequest("/notifications/read-all", { method: "POST" });
  }
};


import { apiRequest } from "./api";
import { Device, PairingSession } from "../types";

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const res = await apiRequest<{ devices: Device[] }>("/devices");
    return res.devices;
  },

  async startPairing(): Promise<PairingSession> {
    const res = await apiRequest<{ pairingCode: string; expiresAt: string; message: string }>("/devices/pair", {
      method: "POST"
    });
    return {
      code: res.pairingCode,
      expiresAt: res.expiresAt,
      status: "PENDING"
    };
  },

  async confirmPairing(code: string, deviceName?: string, platform?: string): Promise<Device> {
    const res = await apiRequest<{ success: boolean; device: Device }>("/devices/pair/confirm", {
      method: "POST",
      body: JSON.stringify({ code, deviceName, platform })
    });
    return res.device;
  },

  async removeDevice(deviceId: string): Promise<void> {
    await apiRequest(`/devices/${deviceId}`, {
      method: "DELETE"
    });
  },

  async registerPushToken(expoPushToken: string, platform: string = "web", deviceId?: string): Promise<void> {
    await apiRequest("/devices/push-token", {
      method: "POST",
      body: JSON.stringify({ expoPushToken, platform, deviceId })
    });
  }
};

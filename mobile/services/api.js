import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getApiBaseUrl() {
  // 1. Check EXPO_PUBLIC_API_URL environment variable passed from start-all.js or Metro
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Try reading Metro host IP from Expo Constants (works for physical devices & Expo Go)
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    Constants.debuggerHost;

  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5001/api`;
    }
  }

  // 3. Android Emulator fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }

  // 4. Default fallback for iOS Simulator / Web / Localhost
  return 'http://localhost:5001/api';
}

export async function fetchActivities(filters = {}) {
  const baseUrl = getApiBaseUrl();
  try {
    const queryParams = new URLSearchParams();
    if (filters.type && filters.type !== 'ALL') queryParams.append('type', filters.type);
    if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status);
    if (filters.q) queryParams.append('q', filters.q);

    const response = await fetch(`${baseUrl}/activities?${queryParams.toString()}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`[API Fetch Activities Error (${baseUrl})]:`, error.message);
    return [];
  }
}

export async function fetchDevices() {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/devices`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`[API Fetch Devices Error (${baseUrl})]:`, error.message);
    return [];
  }
}

export async function registerPushToken(pushToken) {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/devices/push-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushToken })
    });
    return await response.json();
  } catch (error) {
    console.error(`[API Register Push Token Error (${baseUrl})]:`, error.message);
    return null;
  }
}

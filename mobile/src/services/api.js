import { Platform } from 'react-native';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:5001/api' : 'http://localhost:5001/api');

let userToken = null;

export function setUserAuthToken(token) {
  userToken = token;
}

export function getUserAuthToken() {
  return userToken;
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  return headers;
}

export async function fetchActivities(options = {}) {
  try {
    if (!userToken) return []; // Unauthenticated users see 0 activities

    const queryParams = new URLSearchParams();
    if (options.type && options.type !== 'ALL') queryParams.append('type', options.type);
    if (options.status && options.status !== 'ALL') queryParams.append('status', options.status);
    if (options.q && options.q.trim()) queryParams.append('q', options.q.trim());

    const url = `${API_BASE_URL}/activities?${queryParams.toString()}`;
    const response = await fetch(url, { headers: getHeaders() });
    const json = await response.json();

    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.warn('[Mobile API] Error fetching activities:', error.message);
  }
  return [];
}

export async function fetchDevices() {
  try {
    if (!userToken) return []; // Unauthenticated users see 0 devices

    const response = await fetch(`${API_BASE_URL}/devices`, { headers: getHeaders() });
    const json = await response.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.warn('[Mobile API] Error fetching devices:', error.message);
  }
  return [];
}

export async function loginWithGoogle(idToken, userProfile) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, userProfile })
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Google authentication failed');
  }
  if (json.data?.token) {
    setUserAuthToken(json.data.token);
  }
  return json.data;
}

export async function verifyPairingCode(pairingCode) {
  if (!userToken) {
    throw new Error('Please log in with Google before pairing a computer.');
  }

  const response = await fetch(`${API_BASE_URL}/pairing/verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ pairingCode: pairingCode.toString().trim() })
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Invalid or expired 6-digit pairing code');
  }
  return json.data;
}

export async function unpairDevice(deviceId) {
  if (!userToken) return;
  const response = await fetch(`${API_BASE_URL}/pairing/${deviceId}/pair`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
}

export async function registerPushToken(expoPushToken, deviceId) {
  try {
    if (!userToken) return;
    const response = await fetch(`${API_BASE_URL}/devices/push-token`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        expoPushToken,
        deviceId: deviceId || `mobile_${Platform.OS}`,
        platform: Platform.OS
      })
    });
    return await response.json();
  } catch (error) {
    console.warn('[Mobile API] Error registering push token:', error.message);
  }
}

export async function triggerSimulatedActivity(payload) {
  try {
    const activityId = `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const fullPayload = {
      activityId,
      activityType: payload.activityType || 'DOWNLOAD',
      status: payload.status || 'COMPLETED',
      filename: payload.filename || 'simulated_file.iso',
      fileSize: payload.fileSize || '1.5 MB',
      source: payload.source || null,
      destination: payload.destination || `C:\\Users\\User\\Downloads\\${payload.filename || 'simulated_file.iso'}`,
      sourceDrive: payload.sourceDrive || null,
      destinationDrive: payload.destinationDrive || 'C:',
      device: payload.deviceName || 'Windows PC',
      reason: payload.reason || null
    };

    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(fullPayload)
    });
    const json = await response.json();
    return json.data || fullPayload;
  } catch (error) {
    return null;
  }
}

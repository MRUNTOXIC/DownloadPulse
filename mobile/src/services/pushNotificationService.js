import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerPushToken } from './api';

try {
  if (typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
      })
    });
  }
} catch (e) {}

export async function setupPushNotifications(onNotificationTap) {
  try {
    if (Platform.OS === 'web') return;

    let existingStatus = 'denied';
    try {
      const perms = await Notifications.getPermissionsAsync();
      existingStatus = perms?.status || 'denied';
    } catch (e) {
      // In Expo Go, getPermissionsAsync throws SDK 53 warning — return gracefully
      return;
    }

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      try {
        const perms = await Notifications.requestPermissionsAsync();
        finalStatus = perms?.status || 'denied';
      } catch (e) {
        return;
      }
    }

    if (finalStatus !== 'granted') {
      return;
    }

    let expoPushToken = null;
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync(
        process.env.EXPO_PROJECT_ID ? { projectId: process.env.EXPO_PROJECT_ID } : undefined
      );
      expoPushToken = tokenData.data;
    } catch (e) {
      expoPushToken = `ExponentPushToken[local_expo_go_${Date.now()}]`;
    }

    if (expoPushToken) {
      await registerPushToken(expoPushToken);
    }

    if (onNotificationTap) {
      try {
        Notifications.addNotificationResponseReceivedListener(response => {
          const data = response?.notification?.request?.content?.data;
          if (data && data.activityId) {
            onNotificationTap(data.activityId);
          }
        });
      } catch (e) {}
    }

    return expoPushToken;
  } catch (error) {
    // Silent push handler for local testing
  }
}

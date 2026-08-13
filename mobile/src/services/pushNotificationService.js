import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerPushToken } from './api';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    })
  });
} catch (e) {}

export async function setupPushNotifications(onNotificationTap) {
  try {
    if (Platform.OS === 'web') return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
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
      // Graceful fallback for Expo Go without EAS projectId
      expoPushToken = `ExponentPushToken[local_expo_go_${Date.now()}]`;
    }

    if (expoPushToken) {
      await registerPushToken(expoPushToken);
    }

    if (onNotificationTap) {
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response?.notification?.request?.content?.data;
        if (data && data.activityId) {
          onNotificationTap(data.activityId);
        }
      });
    }

    return expoPushToken;
  } catch (error) {
    // Silent push handler for local testing
  }
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerPushToken } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

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
      console.log('[Mobile Push] Push notification permission denied.');
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PROJECT_ID || undefined
    });
    const expoPushToken = tokenData.data;

    console.log('[Mobile Push] Registered Expo Push Token:', expoPushToken);
    await registerPushToken(expoPushToken);

    // Notification tap handler
    if (onNotificationTap) {
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (data && data.activityId) {
          onNotificationTap(data.activityId);
        }
      });
    }

    return expoPushToken;
  } catch (error) {
    console.warn('[Mobile Push Error]:', error.message);
  }
}

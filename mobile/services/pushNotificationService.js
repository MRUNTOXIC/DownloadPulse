import * as Notifications from 'expo-notifications';
import { registerPushToken } from './api';

export async function setupPushNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission for push notifications was denied.');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    await registerPushToken(token);
    return token;
  } catch (error) {
    console.log('[Mobile Push Setup Warning]: Push notifications require Expo client environment.');
    return null;
  }
}

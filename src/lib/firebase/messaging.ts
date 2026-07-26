import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./config";

export const requestNotificationPermission = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      console.log("FCM Token:", token);
      return token;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
  return null;
};

export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return;
  
  return onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    callback(payload);
  });
};

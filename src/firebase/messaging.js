import { getToken, onMessage } from "firebase/messaging"
import { getFirebaseMessaging } from "./firebase"

// Request browser notification permission
export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log("✅ Notification permission granted.");
            return true;
        }

        console.log("❌ Notification permission denied.");
        return false;
    } catch (error) {
        console.error("Permission Error:", error);
        return false;
    }
}


// get firebase cloud messaging token
export const getFCMToken = async () => {
    try {
        const messaging = await getFirebaseMessaging();

        if (!messaging) return null;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        })

        if (!token) {
            console.log("No FCM Token Found.");
            return null;
        }

        console.log("✅ FCM Token:", token);

        return token;
    } catch (error) {
        console.log("FCM Token Error:", error);
        return null;
    }
}

// Listen for foreground notifications
export const onForegroundMessage = async (callback) => {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log("📩 Foreground Notification:", payload);

    callback?.(payload);
  });
};
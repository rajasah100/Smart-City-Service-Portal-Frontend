import { useEffect } from "react";
import {
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
} from "../firebase/messaging";
import apiRequest from "../utils/apiRequest";

const useFirebaseNotification = () => {
  useEffect(() => {
    let unsubscribe = () => {};

    const initializeNotifications = async () => {
      // Request permission
      const granted = await requestNotificationPermission();

      if (!granted) return;

      // Get FCM Token
      const token = await getFCMToken();

      if (token) {
        try {
          await apiRequest.put("/users/fcm-token", {
            fcmToken: token,
          });

          console.log("FCM Token saved.");
        } catch (error) {
          console.error("Failed to save FCM token:", error);
        }
      }

      // Listen for foreground notification
      unsubscribe = await onForegroundMessage((payload) => {
        console.log("Foreground Notification:", payload);

        // dispatch(getNotifications());
        // toast.success(payload.notification.body);
      });
    };

    initializeNotifications();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);
};

export default useFirebaseNotification;

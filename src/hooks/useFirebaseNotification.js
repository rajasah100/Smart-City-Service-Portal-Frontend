import { useEffect, useRef } from "react";
import {
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
} from "../firebase/messaging";
import apiRequest from "../utils/apiRequest";

// Permission magne, FCM token linne ra backend ma save garne. Token return garcha
export const registerPushToken = async ({
  api = apiRequest,
  endpoint = "/users/fcm-token",
  method = "put",
} = {}) => {
  const granted = await requestNotificationPermission();

  if (!granted) return null;

  const token = await getFCMToken();

  if (!token) return null;

  try {
    await api[method](endpoint, { fcmToken: token });
  } catch (error) {
    console.error("Failed to save FCM token:", error);
  }

  return token;
};

// User: default. Department/Admin le aafno api ra endpoint pathaucha
const useFirebaseNotification = ({
  api = apiRequest,
  endpoint = "/users/fcm-token",
  method = "put",
  storageKey,
  onMessage,
} = {}) => {
  // Har render ma naya function aaye pani listener feri nabanos
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    const initializeNotifications = async () => {
      const token = await registerPushToken({ api, endpoint, method });

      if (cancelled) return;

      // Logout garda yo device ko token hataun sakiyos bhanera rakhne
      if (token && storageKey) {
        try {
          localStorage.setItem(storageKey, token);
        } catch {
          // Storage block bhaeko huna sakcha
        }
      }

      // App khulla huda aaune notification
      unsubscribe = await onForegroundMessage((payload) => {
        onMessageRef.current?.(payload);
      });
    };

    initializeNotifications();

    return () => {
      cancelled = true;

      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [api, endpoint, method, storageKey]);
};

export default useFirebaseNotification;

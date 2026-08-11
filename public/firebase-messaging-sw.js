/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAophkP_ytS4eRZdC-KXfo8Tnts7tWpmD4",
  authDomain: "smart-city-service-porta-82fff.firebaseapp.com",
  projectId: "smart-city-service-porta-82fff",
  storageBucket: "smart-city-service-porta-82fff.firebasestorage.app",
  messagingSenderId: "1062383242340",
  appId: "1:1062383242340:web:de2a9912520c3882c12371",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Notification:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo.png", // optional
    }
  );
});
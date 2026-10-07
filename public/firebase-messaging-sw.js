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
  // "notification" bhaeko message Firebase aafai dekhaucha.
  // Feri showNotification gare ekai notification duichoti aaucha, tyasaile data-only message matra yaha dekhaune
  if (payload.notification) return;

  const { title, body } = payload.data || {};

  if (!title) return;

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    data: payload.data,
  });
});

// Notification click garda khulla tab ma focus garne, natra website kholne
// (https link bhaeko SOS notification Firebase aafai sahi page ma kholcha)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const existing = clientList.find((client) => "focus" in client);

        if (existing) return existing.focus();

        return self.clients.openWindow("/");
      })
  );
});
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBm-1uaplC7RiUKMlwBlVqx4Q1wZix6CYg",
  authDomain: "pingme-chat-34e70.firebaseapp.com",
  projectId: "pingme-chat-34e70",
  storageBucket: "pingme-chat-34e70.firebasestorage.app",
  messagingSenderId: "281253474240",
  appId: "1:281253474240:web:b5b6830ce3e1c3bae66225",
  measurementId: "G-98XK0J9507",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "PingMe Chat";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: payload.data?.conversationId || "default",
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  const conversationId = event.notification.data?.conversationId;
  const urlToOpen = conversationId
    ? `${self.location.origin}/?conversation=${conversationId}`
    : self.location.origin;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url == urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

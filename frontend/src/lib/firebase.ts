import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBm-1uaplC7RiUKMlwBlVqx4Q1wZix6CYg",
  authDomain: "pingme-chat-34e70.firebaseapp.com",
  projectId: "pingme-chat-34e70",
  storageBucket: "pingme-chat-34e70.firebasestorage.app",
  messagingSenderId: "281253474240",
  appId: "1:281253474240:web:b5b6830ce3e1c3bae66225",
  measurementId: "G-98XK0J9507",
};

// VAPID Key lấy từ Firebase Console:
// Project Settings > Cloud Messaging > Web configuration > Web Push certificates
// Bấm "Generate key pair" nếu chưa có
const VAPID_KEY =
  "BMkpxT3BTqtyZ3CJPzvg9Wfwg51XI00TkenFIfHLambV_H1Yu5hvTdV6vsNbrrLKoeor2rPDqaQfGEg0rQULXJE";

const app = initializeApp(firebaseConfig);

let messaging: ReturnType<typeof getMessaging> | null = null;

// Kiểm tra browser support
if (typeof window != "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase messaging not supported:", error);
  }
}

export { messaging };

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    if (!messaging) {
      console.warn("Firebase messaging not initialized");
      return null;
    }

    // Kiểm tra trình duyệt hỗ trợ notification
    if (!("Notification" in window)) {
      console.warn("Browser không hỗ trợ notification");
      return null;
    }

    let permission = Notification.permission;

    if (permission == "default") {
      permission = await Notification.requestPermission();
    }

    if (permission != "granted") {
      console.log("Notification permission:", permission);
      return null;
    }

    // Đăng ký service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" },
    );

    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    console.warn("Không lấy được FCM token");
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy FCM token:", error);
    return null;
  }
};

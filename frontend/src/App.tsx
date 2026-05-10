import { RouterProvider } from "react-router-dom";
import router from "./routers/routers";
import { Toaster } from "sonner";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";
import { useNotificationStore } from "./stores/useNotificationStore";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { connectSocket, disconnectSocket } = useSocketStore();
  const { requestPermission } = useNotificationStore();

  // Sync dark/light theme
  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  // Khi user đã đăng nhập → kết nối socket + setup notifications
  // Khi user đăng xuất → ngắt kết nối
  useEffect(() => {
    if (accessToken) {
      connectSocket();

      // Yêu cầu quyền notification và lấy FCM token
      requestPermission();

      return () => {
        disconnectSocket();
      };
    }

    return () => disconnectSocket();
  }, [accessToken, connectSocket, disconnectSocket, requestPermission]);

  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

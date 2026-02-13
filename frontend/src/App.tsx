import { RouterProvider } from "react-router-dom";
import router from "./routers/routers";
import { Toaster } from "sonner";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { connectSocket, disconnectSocket } = useSocketStore();

  // useEffect chỉ làm nhiệm vụ đồng bộ UI theo state isDark
  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  // Khi user đã đăng nhập (có accessToken) → kết nối socket
  // Khi user đăng xuất accessToken = null → ngắt kết nối socket
  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

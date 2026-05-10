import { create } from "zustand";
import { requestNotificationPermission } from "@/lib/firebase";
import { notificationService } from "@/services/notificationService";
import { toast } from "sonner";
import type { NotificationState } from "@/types/store";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  fcmToken: null,
  permissionGranted: Notification?.permission == "granted",
  loading: false,

  requestPermission: async () => {
    try {
      set({ loading: true });

      const token = await requestNotificationPermission();

      if (token) {
        set({ fcmToken: token, permissionGranted: true });
        await get().saveFcmToken(token);

        // Chỉ hiện toast nếu là lần đầu tiên bật notification
        const isFirstTime = !localStorage.getItem("notification_enabled");
        if (isFirstTime) {
          toast.success("Đã bật thông báo thành công!");
          localStorage.setItem("notification_enabled", "true");
        }
      } else {
        set({ permissionGranted: false });
        toast.error(
          "Không thể bật thông báo. Vui lòng kiểm tra cài đặt trình duyệt.",
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Lỗi khi yêu cầu quyền thông báo");
    } finally {
      set({ loading: false });
    }
  },

  saveFcmToken: async (token: string) => {
    try {
      await notificationService.saveFcmToken(token);
      console.log("FCM token saved to backend");
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  },

  removeFcmToken: async () => {
    try {
      await notificationService.removeFcmToken();
      set({ fcmToken: null });
      console.log("FCM token removed from backend");
    } catch (error) {
      console.error("Error removing FCM token:", error);
    }
  },
}));

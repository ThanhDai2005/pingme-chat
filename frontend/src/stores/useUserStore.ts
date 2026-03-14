import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>((set, get) => ({
  uploadAvatar: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();

      const res = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: res.avatarUrl,
        });
      }

      useChatStore.getState().getListConversation();
    } catch (error) {
      console.log("Lỗi khi upload Avatar", error);
      toast.error("upload Avatar không thành công!");
    }
  },

  updateInfo: async (displayName, username, email, phone, bio) => {
    try {
      const { user, setUser } = useAuthStore.getState();

      const res = await userService.updateInfo(
        displayName,
        username,
        email,
        phone || "",
        bio || "",
      );

      if (user) {
        setUser({
          ...user,
          displayName: res.user.displayName,
          username: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
          bio: res.user.bio,
        });
      }

      useChatStore.getState().getListConversation();

      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.log("Lỗi khi updateInfo", error);
      toast.error(error.response?.data?.message);
    }
  },
}));

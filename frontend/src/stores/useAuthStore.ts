import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken: string) => {
    set({
      accessToken: accessToken,
    });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      set({ loading: true });
      const res = await authService.signUp(
        firstName,
        lastName,
        username,
        email,
        password,
      );
      toast.success(
        "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.",
      );
      return res;
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký không thành công!");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username: string, password: string) => {
    try {
      set({ loading: true });
      const res = await authService.signIn(username, password);
      get().setAccessToken(res.accessToken);
      await get().getDetail();
      toast.success("Chào mừng bạn quay lại với moji 🎉");
      return res;
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập không thành công!");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      const res = await authService.signOut();
      toast.success("Logout thành công!");
      return res;
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi logout. Hãy thử lại");
    }
  },

  getDetail: async () => {
    try {
      set({
        loading: true,
      });
      const res = await authService.getDetail();
      set({ user: res.userDetail });
      return res;
    } catch (error) {
      console.log(error);
      set({ accessToken: null, user: null });
      toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, getDetail } = get();

      const res = await authService.refresh();
      get().setAccessToken(res.accessToken);
      if (!user) {
        await getDetail();
      }
      // await get().getDetail(); Mỗi lần refresh: Luôn gọi API lấy user chạy vẫn đúng thay vì if lấy thông tin user khi Chưa có user trong store

      return res;
    } catch (error) {
      console.log(error);
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));

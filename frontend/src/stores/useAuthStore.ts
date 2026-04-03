import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      forgotPasswordLoading: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      setUser: (user) => {
        set({ user });
      },

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({ loading: true });

          const res = await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );

          toast.success(
            "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.",
          );

          return res;
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message);
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          get().clearState();
          set({ loading: true });

          const res = await authService.signIn(username, password);
          get().setAccessToken(res.accessToken);
          await get().getDetail();
          useChatStore.getState().getListConversation();

          toast.success("Chào mừng bạn quay lại với PingMe 🎉");
          return res;
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message);
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Logout thành công!");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
        }
      },

      getDetail: async () => {
        try {
          set({ loading: true });
          const user = await authService.getDetail();

          set({ user: user.user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const { user, getDetail, setAccessToken } = get();
          const accessToken = await authService.refresh();

          setAccessToken(accessToken);

          if (!user) {
            await getDetail();
          }
        } catch (error) {
          console.error(error);
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ forgotPasswordLoading: true });
          const res = await authService.forgotPassword(email);

          return res;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({ forgotPasswordLoading: false });
        }
      },

      verifyOtp: async (email, otp) => {
        try {
          set({ loading: true });
          const res = await authService.verifyOtp(email, otp);

          return res;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (resetToken, newPassword, confirmPassword) => {
        try {
          set({ loading: true });
          const res = await authService.resetPassword(
            resetToken,
            newPassword,
            confirmPassword,
          );

          return res;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "authStorage",
      partialize: (state) => ({ user: state.user }), // chỉ persist user
    },
  ),
);

import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  receiveList: [],
  sendList: [],
  friendList: [],
  loading: false,

  searchUser: async (username: string) => {
    try {
      set({ loading: true });

      const user = await friendService.searchUser(username);

      return user;
    } catch (error) {
      console.log("Lỗi xảy ra khi tìm user bằng username", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  sendFriendRequest: async (to: string, message?: string) => {
    try {
      set({ loading: true });

      const res = await friendService.sendFriendRequest(to, message);

      return res;
    } catch (error) {
      console.log("Lỗi xảy ra khi gừi lời mời kết bạn", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelFriendRequest: async (requestId: string) => {
    try {
      set({ loading: true });

      const res = await friendService.cancelFriendRequest(requestId);

      set((state) => ({
        sendList: state.sendList.filter((item) => item._id != requestId),
      }));
    } catch (error) {
      console.log("Lỗi xảy ra khi hủy lời mời kết bạn", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getFriendRequest: async () => {
    try {
      set({ loading: true });

      const res = await friendService.getFriendRequests();

      set({ receiveList: res.receive, sendList: res.sent });
    } catch (error) {
      console.log("Lỗi xảy ra khi getFriendRequest", error);
    } finally {
      set({ loading: false });
    }
  },

  acceptFriendRequest: async (requestId: string) => {
    try {
      set({ loading: true });

      const res = await friendService.acceptFriendRequest(requestId);

      set((state) => ({
        receiveList: state.receiveList.filter((item) => item._id != requestId),
      }));
    } catch (error) {
      console.log("Lỗi xảy ra khi  acceptFriendRequest", error);
    } finally {
      set({ loading: false });
    }
  },

  declineFriendRequest: async (requestId: string) => {
    try {
      set({ loading: true });

      const res = await friendService.declineFriendRequest(requestId);

      set((state) => ({
        receiveList: state.receiveList.filter((item) => item._id != requestId),
      }));
    } catch (error) {
      console.log("Lỗi xảy ra khi declineFriendRequest", error);
    } finally {
      set({ loading: false });
    }
  },

  getAllFriends: async () => {
    try {
      set({ loading: true });

      const res = await friendService.getAllFriends();

      set({ friendList: res.friends });
    } catch (error) {
      console.log("Lỗi xảy ra khi declineFriendRequest", error);
    } finally {
      set({ loading: false });
    }
  },
}));

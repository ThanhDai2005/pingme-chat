import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL; // đường dẫn connect lên server

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return; // nếu đã có socket tránh tạo nhiều socket

    const socket = io(baseURL, {
      auth: {
        token: accessToken,
      },

      transports: ["websocket"], // giúp kết nối nhanh hơn
    });

    set({ socket: socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với socket");
    });

    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      useChatStore.getState().updateConversation({
        _id: conversation._id,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: unreadCounts,
      });

      if (
        useChatStore.getState().activeConversationId == message.conversationId
      ) {
        // đánh dấu đã đọc
      }
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

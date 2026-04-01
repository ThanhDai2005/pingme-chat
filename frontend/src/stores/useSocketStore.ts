import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL; // đường dẫn connect lên server

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  setOnlineUsers: (onlineUsers) => {
    set({ onlineUsers: onlineUsers });
  },

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

    socket.on("new-message", ({ message, conversation }) => {
      useChatStore.getState().addMessage(message);

      useChatStore.getState().updateConversation({
        _id: conversation._id,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
      });

      if (
        useChatStore.getState().activeConversationId == message.conversationId
      ) {
        useChatStore.getState().markAsSeen();
      }
    });

    socket.on("read-message", ({ conversation }) => {
      const updated = {
        _id: conversation._id,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated);
    });

    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);

      socket.emit("join-conversation", conversation._id);
    });

    socket.on("update-message", ({ message, conversation }) => {
      useChatStore.getState().updateMessageSocket(message);

      useChatStore.getState().updateConversation({
        _id: conversation._id,
        lastMessage: conversation.lastMessage,
      });
    });

    socket.on("delete-message", ({ message, conversation }) => {
      useChatStore.getState().updateMessageSocket(message);

      useChatStore.getState().updateConversation({
        _id: conversation._id,
        lastMessage: conversation.lastMessage,
      });
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

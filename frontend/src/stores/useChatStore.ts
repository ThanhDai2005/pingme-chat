import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { useSocketStore } from "./useSocketStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },

      getListConversation: async () => {
        try {
          set({ convoLoading: true });
          const res = await chatService.getListConversation();
          set({ conversations: res.conversation, convoLoading: false });
        } catch (error) {
          console.log("Lỗi xảy ra khi getListConversation", error);
        }
      },

      getMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages[convoId];
        const nextCursor =
          current?.nextCursor == undefined ? "" : current?.nextCursor;

        if (nextCursor == null) return;

        set({ messageLoading: true });
        try {
          const res = await chatService.getMessages(convoId, nextCursor);

          const processed = res?.message.map((msg) => ({
            ...msg,
            isOwn: msg.senderId == user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            // Nếu đã có tin nhắn trong state: Nối tin cũ (vừa load từ DB) lên ĐẦU danh sách hiện tại.
            // Nếu state đang trống: Gán luôn danh sách vừa tải về làm dữ liệu ban đầu.
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!res?.nextCursor,
                  nextCursor: res?.nextCursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.log("Lỗi xảy ra khi getMessages", error);
        } finally {
          set({
            messageLoading: false,
          });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();

          const res = await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
          );
          set((state) => ({
            conversations: state.conversations.map((convo) =>
              convo._id == activeConversationId
                ? {
                    ...convo,
                    seenBy: [],
                  }
                : convo,
            ),
          }));
        } catch (error) {
          console.log("Lỗi xảy ra khi sendDirectMessage", error);
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const res = await chatService.sendGroupMessage(
            conversationId,
            content,
            imgUrl,
          );

          set((state) => ({
            conversations: state.conversations.map((convo) =>
              convo._id == conversationId ? { ...convo, seenBy: [] } : convo,
            ),
          }));
        } catch (error) {
          console.log("Lỗi xảy ra khi sendGroupMessage", error);
        }
      },

      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { getMessages, messages } = get();

          message.isOwn = message.senderId == user?._id;

          const convoId = message.conversationId;

          let prevItems = messages[convoId]?.items ?? [];

          // Trường hợp A nhắn tin cho B, nhưng B chưa mở ô chat A lên kể từ khi mở App.
          // cần tải tin nhắn cũ về trước để "nối" tin nhắn mới vào đúng dòng thời gian.
          if (prevItems.length == 0) {
            await getMessages(message.conversationId);
            prevItems = messages[convoId].items ?? [];
          }

          set((state) => {
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor,
                },
              },
            };
          });
        } catch (error) {
          console.log("Lỗi xảy ra khi addMessage", error);
        }
      },

      updateConversation: async (conversation: any) => {
        set((state) => {
          return {
            conversations: state.conversations.map((convo) =>
              convo._id == conversation._id
                ? { ...convo, ...conversation }
                : convo,
            ),
          };
        });
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) {
            return;
          }

          const convo = conversations.find(
            (c) => c._id == activeConversationId,
          );

          if (!convo) {
            return;
          }

          if (convo.unreadCounts[user?._id] == 0) {
            return;
          }

          const res = await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((convo) =>
              convo._id == activeConversationId && convo.lastMessage
                ? {
                    ...convo,
                    unreadCounts: {
                      ...convo.unreadCounts,
                      [user?._id]: 0,
                    },
                  }
                : convo,
            ),
          }));
        } catch (error) {
          console.log("Lỗi xảy ra khi markAsSeen trong store", error);
        }
      },

      addConvo: (conversation) => {
        set((state) => {
          const existConvo = state.conversations.some(
            (item) => item._id.toString() == conversation._id.toString(),
          );

          return {
            conversations: existConvo
              ? state.conversations
              : [conversation, ...state.conversations],
            activeConversationId: conversation._id,
          };
        });
      },

      createConversation: async (type, name, memberIds) => {
        try {
          set({ loading: true });
          const res = await chatService.createConversation(
            type,
            name,
            memberIds,
          );

          get().addConvo(res.conversation);

          useSocketStore
            .getState()
            .socket?.emit("join-conversation", res.conversation._id);

          if (!get().messages[res.conversation._id]) {
            await get().getMessages(res.conversation._id);
          }
        } catch (error) {
          console.log("Lỗi xảy ra khi createConversation", error);
        } finally {
          set({ loading: false });
        }
      },
    }),

    {
      name: "chatStorage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);

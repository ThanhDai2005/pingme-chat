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
      imagesPreview: [],
      convoLoading: false,
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => {
        set({ activeConversationId: id, imagesPreview: [] });
      },

      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          imagesPreview: [],
          convoLoading: false,
          messageLoading: false,
          loading: false,
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
          const { messages, conversations, activeConversationId } = get();

          message.isOwn = message.senderId == user?._id;

          const convoId = message.conversationId;

          const prevItems = messages[convoId]?.items ?? [];

          // kiểm tra tin nhắn có bị trùng ko
          const isExist = prevItems.some(
            (m) => m._id?.toString() == message._id?.toString(),
          );

          if (isExist) return;

          const existConvo = conversations.some(
            (c) => c._id.toString() == convoId.toString(),
          );

          if (!existConvo) {
            const res = await chatService.getListConversation();

            const newConvo = res.conversation.find(
              (c) => c._id.toString() == convoId.toString(),
            );

            if (newConvo) {
              set((state) => ({
                conversations: [newConvo, ...state.conversations],
              }));
            }
          }

          if (activeConversationId != convoId) {
            return;
          }

          set((state) => ({
            messages: {
              ...state.messages,
              [convoId]: {
                items: [...prevItems, message],
                hasMore: state.messages[convoId]?.hasMore,
                nextCursor: state.messages[convoId]?.nextCursor,
              },
            },
          }));
        } catch (error) {
          console.log("Lỗi addMessage", error);
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

          set({ imagesPreview: [] });
        } catch (error) {
          console.log("Lỗi xảy ra khi createConversation", error);
        } finally {
          set({ loading: false });
        }
      },

      resetMessages: (conversationId) => {
        set((state) => {
          return {
            messages: {
              ...state.messages,
              [conversationId]: {
                items: [],
                hasMore: false,
                nextCursor: null,
              },
            },
          };
        });
      },

      deleteConversation: async (conversationId) => {
        try {
          set({ loading: true });
          await chatService.deleteConversation(conversationId);

          set((state) => {
            return {
              conversations: state.conversations.filter(
                (convo) => convo._id != conversationId,
              ),
              messages: {
                ...state.messages,
                [conversationId]: {
                  items: [],
                  hasMore: false,
                  nextCursor: null,
                },
              },
            };
          });

          set({ loading: false });
        } catch (error) {
          console.log("Lỗi xảy ra khi deleteConversation", error);
        } finally {
          set({ loading: false });
        }
      },

      updateMessage: async (messageId, content) => {
        try {
          set({ loading: true });

          const res = await chatService.updateMessage(messageId, content);
        } catch (error) {
          console.log("Lỗi xảy ra khi updateMessage", error);
        } finally {
          set({ loading: false });
        }
      },

      updateMessageSocket: async (message) => {
        set((state) => {
          const convoId = message.conversationId;

          const prevItems = state.messages[convoId]?.items ?? [];

          const newItems = prevItems.map((msg) =>
            msg._id.toString() == message._id.toString()
              ? {
                  ...msg,
                  ...message,
                }
              : msg,
          );

          return {
            messages: {
              ...state.messages,
              [convoId]: {
                items: newItems,
                hasMore: state.messages[convoId]?.hasMore,
                nextCursor: state.messages[convoId]?.nextCursor,
              },
            },
          };
        });
      },

      deleteMessage: async (messageId) => {
        try {
          set({ loading: true });

          const res = await chatService.deleteMessage(messageId);
        } catch (error) {
          console.log("Lỗi xảy ra khi deleteMessage", error);
        } finally {
          set({ loading: false });
        }
      },

      addImagesPreview: (preview) => {
        set((state) => {
          return {
            imagesPreview: [...state.imagesPreview, ...preview],
          };
        });
      },

      filterImagesPreview: (url) => {
        set((state) => {
          return {
            imagesPreview: state.imagesPreview.filter(
              (item) => item.url != url,
            ),
          };
        });
      },

      clearImagesPreview: () => {
        set((state) => {
          return {
            imagesPreview: [],
          };
        });
      },
    }),

    {
      name: "chatStorage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);

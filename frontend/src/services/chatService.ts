import api from "@/lib/axios";

const pageLimit = 50;

export const chatService = {
  getListConversation: async () => {
    const res = await api.get("/conversation");
    return res.data;
  },

  getMessages: async (conversationId: string, cursor?: string) => {
    const res = await api.get(
      `conversation/${conversationId}/message?limit=${pageLimit}&cursor=${cursor}`,
    );

    return res.data;
  },

  sendDirectMessage: async (
    recipientId: string,
    content: string,
    imgUrl?: string[],
    conversationId?: string,
  ) => {
    const res = await api.post("/message/direct", {
      recipientId: recipientId,
      content: content,
      imgUrl: imgUrl,
      conversationId: conversationId,
    });

    return res.data;
  },

  sendGroupMessage: async (
    conversationId: string,
    content: string,
    imgUrl?: string[],
  ) => {
    const res = await api.post("/message/group", {
      conversationId: conversationId,
      content: content,
      imgUrl: imgUrl,
    });

    return res.data;
  },

  markAsSeen: async (conversationId: string) => {
    const res = await api.patch(`/conversation/${conversationId}/seen`);

    return res.data;
  },

  createConversation: async (
    type: string,
    name: string,
    memberIds: string[],
  ) => {
    const res = await api.post("/conversation", {
      type: type,
      name: name,
      memberIds: memberIds,
    });

    return res.data;
  },

  deleteConversation: async (conversationId: string) => {
    const res = await api.patch(`/conversation/${conversationId}/delete`);

    return res.data;
  },

  updateMessage: async (messageId: string, content: string) => {
    const res = await api.patch(`/message/${messageId}/update`, {
      content: content,
    });

    return res.data;
  },

  deleteMessage: async (messageId: string) => {
    const res = await api.patch(`/message/${messageId}/delete`);

    return res.data;
  },

  uploadImage: async (formData: FormData) => {
    const res = await api.post("/message/upload", formData);

    return res.data;
  },
};

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
    imgUrl?: string,
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
    imgUrl?: string,
  ) => {
    const res = await api.post("/message/group", {
      conversationId: conversationId,
      content: content,
      imgUrl: imgUrl,
    });

    return res.data;
  },
};

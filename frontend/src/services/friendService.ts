import api from "@/lib/axios";

export const friendService = {
  searchUser: async (username: string) => {
    const res = await api.get(`/user/search?username=${username}`);
    return res.data;
  },

  sendFriendRequest: async (to: string, message?: string) => {
    const res = await api.post("/friend/requests", {
      to: to,
      message: message,
    });

    return res.data;
  },

  cancelFriendRequest: async (requestId: string) => {
    const res = await api.delete(`/friend/requests/${requestId}/cancel`);

    return res.data;
  },

  getFriendRequests: async () => {
    const res = await api.get("/friend/requests");

    return res.data;
  },

  acceptFriendRequest: async (requestId: string) => {
    const res = await api.post(`/friend/requests/${requestId}/accept`);

    return res.data;
  },

  declineFriendRequest: async (requestId: string) => {
    const res = await api.post(`/friend/requests/${requestId}/decline`);

    return res.data;
  },

  getAllFriends: async () => {
    const res = await api.get("/friend");

    return res.data;
  },
};

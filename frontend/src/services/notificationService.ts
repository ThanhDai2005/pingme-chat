import api from "@/lib/axios";

export const notificationService = {
  saveFcmToken: async (fcmToken: string) => {
    const res = await api.patch("/user/fcm-token", { fcmToken: fcmToken });
    return res.data;
  },

  removeFcmToken: async () => {
    const res = await api.delete("/user/fcm-token");
    return res.data;
  },
};

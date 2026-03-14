import api from "@/lib/axios";

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.patch("/user/uploadAvatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateInfo: async (
    displayName: string,
    username: string,
    email: string,
    phone: string,
    bio: string,
  ) => {
    const res = await api.patch("/user/profile", {
      displayName,
      username,
      email,
      phone,
      bio,
    });

    return res.data;
  },
};

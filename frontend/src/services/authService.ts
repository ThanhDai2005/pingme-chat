import api from "@/lib/axios";

export const authService = {
  signUp: async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        firstName,
        lastName,
        username,
        email,
        password,
      },
      { withCredentials: true }
    );

    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      {
        username,
        password,
      },
      { withCredentials: true }
    );

    return res.data;
  },

  signOut: async () => {
    const res = await api.post(
      "/auth/signout",
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  getDetail: async () => {
    const res = await api.get("/user/detail", {
      withCredentials: true,
    });
    return res.data;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data;
  },
};

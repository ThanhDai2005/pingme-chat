import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import friendRoute from "./friend.route.js";
import messageRoute from "./message.route.js";
import conversationRoute from "./conversation.route.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const mainV1Routes = (app) => {
  const version = "/api/v1";

  app.use(version + "/auth", authRoute);

  app.use(version + "/user", requireAuth, userRoute);

  app.use(version + "/friend", requireAuth, friendRoute);

  app.use(version + "/message", requireAuth, messageRoute);

  app.use(version + "/conversation", requireAuth, conversationRoute);
};

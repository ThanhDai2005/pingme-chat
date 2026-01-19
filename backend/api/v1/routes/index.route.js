import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const mainV1Routes = (app) => {
  const version = "/api/v1";

  app.use(version + "/auth", authRoute);

  app.use(version + "/user", requireAuth, userRoute);
};

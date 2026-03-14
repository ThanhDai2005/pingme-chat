import express from "express";
const router = express.Router();
import muler from "multer";
import { uploadSingle } from "../middlewares/uploadCloud.middleware.js";

const upload = muler({
  storage: muler.memoryStorage(),
});

import * as controller from "../controllers/user.controller.js";

router.get("/detail", controller.getDetail);

router.get("/search", controller.searchUser);

router.patch(
  "/uploadAvatar",
  upload.single("avatar"),
  uploadSingle,
  controller.uploadAvatar,
);

router.patch("/profile", controller.updateInfo);

export default router;

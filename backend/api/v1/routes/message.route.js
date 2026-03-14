import express from "express";
const router = express.Router();
import multer, { memoryStorage } from "multer";
import { uploadSingle } from "../middlewares/uploadCloud.middleware.js";

const upload = multer({
  storage: memoryStorage(),
});

import * as controller from "../controllers/message.controller.js";
import {
  checkFriendSendDirectMessage,
  checkFriendSendGroupMessage,
} from "../middlewares/friend.middleware.js";

router.post(
  "/direct",
  checkFriendSendDirectMessage,
  controller.sendDirectMessage,
);

router.post("/group", checkFriendSendGroupMessage, controller.sendGroupMessage);

router.post(
  "/upload",
  upload.single("imgUrl"),
  uploadSingle,
  controller.uploadImage,
);

export default router;

import express from "express";
const router = express.Router();
import multer, { memoryStorage } from "multer";
import { uploadMulti } from "../middlewares/uploadCloud.middleware.js";

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
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

router.patch("/:messageId/update", controller.updateMessage);

router.patch("/:messageId/delete", controller.deleteMessage);

router.post(
  "/upload",
  upload.array("imgUrl", 10),
  uploadMulti,
  controller.uploadImage,
);

export default router;

import express from "express";
const router = express.Router();

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

export default router;

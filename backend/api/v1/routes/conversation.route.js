import express from "express";
const router = express.Router();

import * as controller from "../controllers/conversation.controller.js";
import { checkFriendCreateGroup } from "../middlewares/friend.middleware.js";

router.post("/", checkFriendCreateGroup, controller.createConversation);

router.get("/", controller.getConversation);

router.get("/:conversationId/message", controller.getMessages);

export default router;

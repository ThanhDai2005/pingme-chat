import express from "express";
const router = express.Router();

import * as controller from "../controllers/friend.controller.js";

router.post("/requests", controller.sendFriendRequest);

router.delete("/requests/:requestId/cancel", controller.cancelFriendRequest);

router.post("/requests/:requestId/accept", controller.acceptFriendRequest);

router.post("/requests/:requestId/decline", controller.declineFriendRequest);

router.get("/", controller.getAllFriends);

router.get("/requests", controller.getFriendRequests);

export default router;

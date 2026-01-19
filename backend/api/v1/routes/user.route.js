import express from "express";
const router = express.Router();

import * as controller from "../controllers/user.controller.js";

router.get("/detail", controller.getDetail);

router.get("/test", controller.test);

export default router;

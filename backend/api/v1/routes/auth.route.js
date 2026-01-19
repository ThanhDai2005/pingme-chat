import express from "express";
const router = express.Router();

import * as controller from "../controllers/auth.controller.js";

router.post("/signup", controller.signUp);

router.post("/signin", controller.signIn);

router.post("/signout", controller.signOut);

router.post("/refresh", controller.refreshToken);

export default router;

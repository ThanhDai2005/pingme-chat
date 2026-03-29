import express from "express";
const router = express.Router();

import * as controller from "../controllers/auth.controller.js";

router.post("/signup", controller.signUp);

router.post("/signin", controller.signIn);

router.post("/signout", controller.signOut);

router.post("/refresh", controller.refreshToken);

router.post("/forgot-password", controller.forgotPassword);

router.post("/verify-otp", controller.verifyOtp);

router.post("/reset-password", controller.resetPassword);

export default router;

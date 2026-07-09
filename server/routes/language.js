import express from "express";
import {
    sendLanguageOTP,
    verifyOtp,
  } from "../controller/language.js";

const router = express.Router();

router.post("/send-otp", sendLanguageOTP);
router.post("/verify-otp", verifyOtp);

export default router;
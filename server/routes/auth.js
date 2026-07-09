import express from "express";
import {
  getallusers,
  Login,
  Signup,
  updateprofile,
  sendFriendRequest,
  acceptFriendRequest,
  forgotPassword,
  transferPoints,
  verifyLoginOTP,
} from "../controller/auth.js";

const router = express.Router();
import auth from "../middleware/auth.js";
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forgotpassword", forgotPassword);
router.get("/getalluser", getallusers);
router.patch("/update/:id", auth,updateprofile);
router.patch("/sendrequest", auth, sendFriendRequest);
router.patch("/acceptrequest", auth, acceptFriendRequest);
router.post("/transfer-points", auth, transferPoints);
router.post("/verify-login-otp", verifyLoginOTP);
export default router;

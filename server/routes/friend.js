import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
} from "../controller/friend.js";

const router = express.Router();

router.post("/request", sendFriendRequest);
router.post("/accept", acceptFriendRequest);
router.get("/list/:id", getFriends);

export default router;
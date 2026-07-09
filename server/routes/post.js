import express from "express";
import upload from "../middleware/upload.js";

import {
  createPost,
  getAllPosts,
  likePost,
  commentPost,
  sharePost,
} from "../controller/post.js";

const router = express.Router();

router.post(
  "/create",
  upload.single("media"),
  createPost
);

router.get("/all", getAllPosts);
router.patch("/like", likePost);
router.patch("/comment", commentPost);
router.patch("/share", sharePost);

export default router;
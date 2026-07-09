import post from "../models/post.js";
import user from "../models/auth.js";

export const createPost = async (req, res) => {
  try {

    const { userId, text, image, video } = req.body;

    const currentUser = await user.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const friendCount = currentUser.friends.length;

    // No friends → Cannot post
    if (friendCount === 0) {
      return res.status(403).json({
        message: "Add at least one friend before posting.",
      });
    }

    // Today's posts
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPosts = await post.countDocuments({
      userId,
      createdAt: {
        $gte: today,
      },
    });

    // 1 friend → 1 post/day
    if (friendCount === 1 && todayPosts >= 1) {
      return res.status(403).json({
        message: "Daily limit reached (1 post).",
      });
    }

    // 2 friends → 2 posts/day
    if (friendCount === 2 && todayPosts >= 2) {
      return res.status(403).json({
        message: "Daily limit reached (2 posts).",
      });
    }

    // >10 friends → Unlimited

    const newPost = await post.create({
      userId,
      text,
      image,
      video,
    });

    res.status(200).json({
      data: newPost,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getAllPosts = async (req, res) => {
    try {
      const posts = await post.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        data: posts,
      });
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  export const likePost = async (req, res) => {
    try {
      const { postId, userId } = req.body;
  
      const postData = await post.findById(postId);
  
      if (!postData) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
  
      const alreadyLiked = postData.likes.includes(userId);
  
      if (alreadyLiked) {
        postData.likes = postData.likes.filter(
          (id) => id.toString() !== userId
        );
      } else {
        postData.likes.push(userId);
      }
  
      await postData.save();
  
      res.status(200).json({
        data: postData,
      });
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  export const commentPost = async (req, res) => {
    try {
      const { postId, userId, comment } = req.body;
  
      const postData = await post.findById(postId);
  
      if (!postData) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
  
      postData.comments.push({
        userId,
        comment,
        createdAt: new Date(),
      });
  
      await postData.save();
  
      res.status(200).json({
        data: postData,
      });
  
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  export const sharePost = async (req, res) => {
    try {
      const { postId } = req.body;
  
      const postData = await post.findById(postId);
  
      if (!postData) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
  
      postData.shares += 1;
  
      await postData.save();
  
      res.status(200).json({
        data: postData,
      });
  
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
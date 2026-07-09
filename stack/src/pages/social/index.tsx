import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<any>(null);
  const [commentText, setCommentText] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/post/all");
      setPosts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createPost = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
  
      const formData = new FormData();
  
      formData.append("userId", user._id);
      formData.append("text", text);
  
      if (file) {
        formData.append("media", file);
      }
  
      const res = await axiosInstance.post(
        "/post/create",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
  
      console.log(res.data);
  
      setText("");
      setFile(null);
  
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const likePost = async (postId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await axiosInstance.patch("/post/like", {
        postId,
        userId: user._id,
      });

      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const commentPost = async (postId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await axiosInstance.patch("/post/comment", {
        postId,
        userId: user._id,
        comment: commentText,
      });

      setCommentText("");
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const sharePost = async (postId: string) => {
    try {
      await axiosInstance.patch("/post/share", {
        postId,
      });

      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">
        Public Social Feed
      </h1>

      {/* Create Post */}

      <div className="mb-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded p-3 text-white"
        />
        <input
          type="file"
          onChange={(e: any) =>
            setFile(e.target.files[0])
          }
          className="mt-2"
        />
        <button
          onClick={createPost}
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
        >
          Post
        </button>
      </div>

      {/* Display Posts */}

      {posts.map((post: any) => (
        <div
          key={post._id}
          className="border rounded-lg p-4 mb-4 shadow"
        >
          <h2 className="font-semibold">
            {post.text}
          </h2>

          {post.image && (
            <img
              src={post.image}
              className="w-full mt-3 rounded"
            />
          )}

          {post.video && (
            <video
              controls
              className="w-full mt-3"
            >
              <source src={post.video} />
            </video>
          )}

          {/* Like / Share */}

          <div className="flex gap-5 mt-4">
            <button
              onClick={() => likePost(post._id)}
              className="text-red-600"
            >
              ❤️ {post.likes?.length || 0}
            </button>

            <button
              onClick={() => sharePost(post._id)}
              className="text-blue-600"
            >
              🔄 {post.shares || 0}
            </button>

            <span>
              💬 {post.comments?.length || 0}
            </span>
          </div>

          {/* Comment Section */}

          <div className="mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
              className="border p-2 rounded w-full"
            />

            <button
              onClick={() => commentPost(post._id)}
              className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
            >
              Comment
            </button>
          </div>

          {/* Show Comments */}

          {post.comments?.length > 0 && (
            <div className="mt-3">
              {post.comments.map(
                (c: any, index: number) => (
                  <div
                    key={index}
                    className="border-t py-2 text-sm"
                  >
                    {c.comment}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Social;
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js"
import questionroute from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import friendRoutes from "./routes/friend.js";
import postRoutes from "./routes/post.js";
import paymentRoutes from "./routes/payment.js";
import languageRoutes from "./routes/language.js";
const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
import path from "path";
app.use(
  "/uploads",
  express.static("uploads")
);
app.get("/", (req, res) => {
  res.send("Stackoverflow clone is running perfect");
});
app.get("/test", (req, res) => {
  res.send("Test route working");
});
app.use("/user", userroutes);
app.use("/question", questionroute);
app.use("/answer", answerroutes);
app.use("/friend", friendRoutes);
app.use("/post", postRoutes);
app.use("/payment", paymentRoutes);
app.use("/language", languageRoutes);

const PORT = process.env.PORT || 5000;
const databaseurl = process.env.MONGODB_URL;

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

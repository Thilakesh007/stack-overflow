import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import transporter from "../config/mail.js";
// Signup
export const Signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await user.findOne({
      $or: [
          { email },
          { phone }
      ]
  });

    if (exisitinguser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashpassword = await bcrypt.hash(password, 12);

    // Create new user
    const newuser = await user.create({
      name,
      email,
      phone,
      password: hashpassword,
    });

    if (isChrome) {

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
      exisitinguser.loginOTP = otp;
      exisitinguser.loginOTPExpiry = Date.now() + 5 * 60 * 1000;
    
      await exisitinguser.save();
    
      // We'll send the email in the next step
      await transporter.sendMail({

          from: process.env.EMAIL_USER,
      
          to: exisitinguser.email,
      
          subject: "Login Verification OTP",
      
          html: `
              <h2>Stack Overflow Login OTP</h2>
      
              <p>Your OTP is:</p>
      
              <h1>${otp}</h1>
      
              <p>This OTP expires in 5 minutes.</p>
          `
      
      });
    
      return res.status(200).json({
        requireOTP: true,
        userId: exisitinguser._id,
        message: "OTP sent to your email",
      });
    
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: newuser.email,
        id: newuser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      data: newuser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Login
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exisitinguser = await user.findOne({ email });

    if (!exisitinguser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const ispasswordcrct = await bcrypt.compare(
      password,
      exisitinguser.password
    );

    if (!ispasswordcrct) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Detect browser, OS and device
    const parser = new UAParser(req.headers["user-agent"]);

    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";

    const isChrome = browser === "Chrome";
    const isEdge = browser === "Edge";

    let device = parser.getDevice().type || "Desktop";

    const isMobile = device === "mobile";

    // Mobile login restriction
    if (isMobile) {

      const hour = new Date().getHours();

      if (hour < 10 || hour >= 13) {

        return res.status(403).json({
          message: "Mobile login allowed only between 10 AM and 1 PM",
        });

      }

    }

// Get IP Address
const ip =
  req.headers["x-forwarded-for"] ||
  req.socket.remoteAddress ||
  "Unknown";

    // Save login history
    exisitinguser.loginHistory.push({
      browser,
      os,
      device,
      ip,
      loginTime: new Date(),
    });

    await exisitinguser.save();

    const token = jwt.sign(
      {
        email: exisitinguser.email,
        id: exisitinguser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      data: exisitinguser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get all users
export const getallusers = async (req, res) => {
  try {
    const alluser = await user.find();

    res.status(200).json({
      data: alluser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Update profile
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body.editForm;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "User unavailable",
    });
  }

  try {
    const updatedProfile = await user.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          about,
          tags,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      data: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    console.log("===== SEND REQUEST =====");
    console.log("Body:", req.body);

    const { userId, friendId } = req.body;

    const sender = await user.findById(userId);
    const receiver = await user.findById(friendId);

    console.log("Sender Found:", sender);
    console.log("Receiver Found:", receiver);

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("Before:", receiver.friendRequests);

    receiver.friendRequests.push(userId);

    await receiver.save();

    console.log("After:", receiver.friendRequests);

    res.status(200).json({
      message: "Friend request sent",
    });
  } catch (err) {
    console.log("ERROR:", err);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, senderId } = req.body;

    const currentUser = await user.findById(userId);
    const senderUser = await user.findById(senderId);

    if (!currentUser || !senderUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Remove request
    currentUser.friendRequests =
      currentUser.friendRequests.filter(
        (id) => id.toString() !== senderId
      );

    // Add each other as friends
    if (!currentUser.friends.includes(senderId)) {
      currentUser.friends.push(senderId);
    }

    if (!senderUser.friends.includes(userId)) {
      senderUser.friends.push(userId);
    }

    await currentUser.save();
    await senderUser.save();

    res.status(200).json({
      message: "Friend request accepted",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Find user by email OR phone
    const existingUser = await user.findOne({
      $or: [
        { email: email || "" },
        { phone: phone || "" },
      ],
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if forgot password was already used today
    if (existingUser.forgotPasswordUsedAt) {
      const last = new Date(existingUser.forgotPasswordUsedAt);
      const today = new Date();

      const sameDay =
        last.getDate() === today.getDate() &&
        last.getMonth() === today.getMonth() &&
        last.getFullYear() === today.getFullYear();

      if (sameDay) {
        return res.status(400).json({
          message: "You can use this option only one time per day.",
        });
      }
    }

    // Generate random password (letters only)
    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let newPassword = "";

    for (let i = 0; i < 8; i++) {
      newPassword +=
        letters[Math.floor(Math.random() * letters.length)];
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user
    existingUser.password = hashedPassword;
    existingUser.forgotPasswordUsedAt = new Date();

    await existingUser.save();

    res.status(200).json({
      message: "Password reset successful",
      password: newPassword,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const transferPoints = async (req, res) => {
  try {
    const { senderId, receiverEmail, points } = req.body;

    const sender = await user.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found",
      });
    }

    if (sender.rewardPoints <= 10) {
      return res.status(400).json({
        message: "You need more than 10 reward points to transfer.",
      });
    }

    if (sender.rewardPoints < Number(points)) {
      return res.status(400).json({
        message: "Insufficient reward points.",
      });
    }

    const receiver = await user.findOne({
      email: receiverEmail,
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found.",
      });
    }

    sender.rewardPoints -= Number(points);
    receiver.rewardPoints += Number(points);

    await sender.save();
    await receiver.save();

    res.status(200).json({
      message: "Points transferred successfully.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Something went wrong.",
    });

  }
};

export const verifyLoginOTP = async (req, res) => {

  try {

      const { userId, otp } = req.body;

      const existingUser = await user.findById(userId);

      if (!existingUser) {

          return res.status(404).json({
              message: "User not found",
          });

      }

      if (
          existingUser.loginOTP !== otp ||
          existingUser.loginOTPExpiry < Date.now()
      ) {

          return res.status(400).json({
              message: "Invalid OTP",
          });

      }

      existingUser.loginOTP = "";
      existingUser.loginOTPExpiry = null;

      await existingUser.save();

      const token = jwt.sign(
          {
              email: existingUser.email,
              id: existingUser._id,
          },
          process.env.JWT_SECRET,
          {
              expiresIn: "7d",
          }
      );

      res.status(200).json({

          token,

          data: existingUser,

      });

  } catch (err) {

      console.log(err);

      res.status(500).json({

          message: "Something went wrong",

      });

  }

};
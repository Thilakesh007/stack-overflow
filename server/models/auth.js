import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: "",
  },
  
  subscriptionPlan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },
  
  subscriptionExpiry: {
    type: Date,
    default: null,
  },

  lastForgotPasswordRequest: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    default: "",
  },

  tags: {
    type: [String],
    default: [],
  },

  // Friends list
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  // Pending friend requests
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  forgotPasswordUsedAt: {
    type: Date,
    default: null,
  },
  
  rewardPoints: {
    type: Number,
    default: 0,
  },
  
  language: {
    type: String,
    default: "en",
  },
  
  pendingLanguage: {
    type: String,
    default: "",
  },

  languageOTP: {
      type: String,
  },

  languageOTPExpiry: {
      type: Date,
  },

  loginHistory: [
    {
      browser: {
        type: String,
      },
  
      os: {
        type: String,
      },
  
      device: {
        type: String,
      },
  
      ip: {
        type: String,
      },
  
      loginTime: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  loginOTP: {
    type: String,
  },
  
  loginOTPExpiry: {
    type: Date,
  },

  joinDate: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("user", userschema);
import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import user from "../models/auth.js";
import nodemailer from "nodemailer";
console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    // Payment only between 10 AM and 11 AM IST
    const now = new Date();

    const indiaTime = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    const hour = indiaTime.getHours();

   if (hour !== 10) {
      return res.status(403).json({
        message:
          "Payments are allowed only between 10:00 AM and 11:00 AM IST.",
        });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to create order",
    });
  }
};

export const verifyPayment = async (req, res) => {
    try {
  
      const { userId, plan } = req.body;
  
      const currentUser = await user.findById(userId);
  
      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      // Subscription expires after 30 days
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
  
      currentUser.subscriptionPlan = plan;
      currentUser.subscriptionExpiry = expiry;
  
      await currentUser.save();
  
      // Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: currentUser.email,
        subject: "Subscription Invoice",
        html: `
          <h2>Payment Successful</h2>
  
          <p><b>Plan:</b> ${plan}</p>
  
          <p><b>Amount:</b>
          ${
            plan === "Bronze"
              ? "₹100"
              : plan === "Silver"
              ? "₹300"
              : "₹1000"
          }</p>
  
          <p><b>Valid Till:</b>
          ${expiry.toDateString()}</p>
  
          <hr/>
  
          <p>Thank you for subscribing.</p>
        `,
      });
  
      res.status(200).json({
        message: "Payment verified",
      });
  
    } catch (error) {
  
      console.log(error);
  
      res.status(500).json({
        message: "Verification failed",
      });
  
    }
  };
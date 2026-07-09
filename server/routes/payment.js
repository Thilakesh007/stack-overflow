import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controller/payment.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

router.get("/hello", (req, res) => {
  res.send("Payment route working");
});

export default router;
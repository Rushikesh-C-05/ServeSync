import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  getPaymentByBooking,
  initiateRefund,
} from "../controllers/paymentController.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create Razorpay order
router.post("/create-order", createOrder);

// Verify payment
router.post("/verify", verifyPayment);

// Get payment details
router.get("/:paymentId", getPaymentDetails);

// Get payment by booking
router.get("/booking/:bookingId", getPaymentByBooking);

// Initiate refund
router.post("/:paymentId/refund", initiateRefund);

export default router;

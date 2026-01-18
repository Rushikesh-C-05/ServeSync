import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import { apiResponse } from "../utils/helpers.js";

// Initialize Razorpay lazily to ensure env vars are loaded
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    // Verify booking belongs to user (convert both to strings for comparison)
    if (booking.userId.toString() !== req.userId.toString()) {
      return res.status(403).json(apiResponse(false, "Unauthorized access"));
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment && existingPayment.status === "completed") {
      return res
        .status(400)
        .json(apiResponse(false, "Payment already completed for this booking"));
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(booking.totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        userId: req.userId,
        serviceAmount: booking.serviceAmount,
        platformFee: booking.platformFee,
      },
    };

    const order = await getRazorpayInstance().orders.create(options);

    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = await Payment.findOneAndUpdate(
        { bookingId },
        {
          amount: booking.totalAmount,
          platformFee: booking.platformFee,
          providerAmount: booking.serviceAmount,
          transactionId: order.id,
          razorpayOrderId: order.id,
          status: "pending",
        },
        { new: true },
      );
    } else {
      payment = new Payment({
        bookingId: booking._id,
        userId: booking.userId,
        providerId: booking.providerId,
        amount: booking.totalAmount,
        platformFee: booking.platformFee,
        providerAmount: booking.serviceAmount,
        transactionId: order.id,
        razorpayOrderId: order.id,
        paymentMethod: "razorpay",
        status: "pending",
      });
      await payment.save();
    }

    res.json(
      apiResponse(true, "Order created successfully", {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        payment,
      }),
    );
  } catch (error) {
    console.error("Create order error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to create order", error.message));
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json(apiResponse(false, "Invalid signature"));
    }

    // Update payment
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json(apiResponse(false, "Payment not found"));
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "completed";
    payment.transactionId = razorpay_payment_id;
    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: "accepted",
      updatedAt: Date.now(),
    });

    res.json(
      apiResponse(true, "Payment verified successfully", {
        payment,
        paymentId: razorpay_payment_id,
      }),
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Payment verification failed", error.message));
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate("bookingId")
      .populate("userId", "name email")
      .populate("providerId", "businessName");

    if (!payment) {
      return res.status(404).json(apiResponse(false, "Payment not found"));
    }

    // Verify access
    if (
      payment.userId._id.toString() !== req.userId &&
      payment.providerId._id.toString() !== req.providerId
    ) {
      return res.status(403).json(apiResponse(false, "Unauthorized access"));
    }

    res.json(apiResponse(true, "Payment details retrieved", payment));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get payment details", error.message));
  }
};

// Get payment by booking
export const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ bookingId });

    if (!payment) {
      return res.status(404).json(apiResponse(false, "Payment not found"));
    }

    res.json(apiResponse(true, "Payment retrieved", payment));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get payment", error.message));
  }
};

// Initiate refund
export const initiateRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json(apiResponse(false, "Payment not found"));
    }

    if (payment.status !== "completed") {
      return res
        .status(400)
        .json(apiResponse(false, "Payment not completed yet"));
    }

    if (payment.status === "refunded") {
      return res
        .status(400)
        .json(apiResponse(false, "Payment already refunded"));
    }

    // Create refund in Razorpay
    const refund = await getRazorpayInstance().payments.refund(
      payment.razorpayPaymentId,
      {
        amount: Math.round(payment.amount * 100), // Full refund
        notes: {
          reason: reason || "Service cancellation",
          bookingId: payment.bookingId.toString(),
        },
      },
    );

    // Update payment status
    payment.status = "refunded";
    payment.refundId = refund.id;
    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    res.json(
      apiResponse(true, "Refund initiated successfully", {
        refund,
        payment,
      }),
    );
  } catch (error) {
    console.error("Refund error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to initiate refund", error.message));
  }
};

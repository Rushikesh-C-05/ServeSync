import express from "express";
import * as userController from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Test endpoint
router.get("/test", userController.test);

// User routes (all require authentication)
router.get("/:userId/dashboard", auth, userController.getDashboardStats);
router.get("/:userId/profile", auth, userController.getProfile);
router.put("/:userId/profile", auth, userController.updateProfile);
router.post("/:userId/bookings", auth, userController.bookService);
router.get("/:userId/bookings", auth, userController.getBookings);
router.get(
  "/:userId/bookings/:bookingId",
  auth,
  userController.getBookingDetails,
);
router.patch(
  "/:userId/bookings/:bookingId/cancel",
  auth,
  userController.cancelBooking,
);
router.post("/:userId/reviews", auth, userController.submitReview);
router.get("/:userId/reviews", auth, userController.getReviews);

export default router;

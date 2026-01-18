import express from "express";
import * as providerController from "../controllers/providerController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Test endpoint
router.get("/test", providerController.test);

// Provider routes (all require authentication)
router.get("/:userId/dashboard", auth, providerController.getDashboardStats);
router.post("/:userId/register", auth, providerController.register);
router.get("/:userId/profile", auth, providerController.getProfile);
router.post("/:userId/services", auth, providerController.createService);
router.get("/:userId/services", auth, providerController.getServices);
router.put(
  "/:userId/services/:serviceId",
  auth,
  providerController.updateService,
);
router.delete(
  "/:userId/services/:serviceId",
  auth,
  providerController.deleteService,
);
router.patch(
  "/:userId/services/:serviceId/toggle",
  auth,
  providerController.toggleAvailability,
);
router.get("/:userId/bookings", auth, providerController.getBookings);
router.patch(
  "/:userId/bookings/:bookingId/accept",
  auth,
  providerController.acceptBooking,
);
router.patch(
  "/:userId/bookings/:bookingId/reject",
  auth,
  providerController.rejectBooking,
);
router.patch(
  "/:userId/bookings/:bookingId/complete",
  auth,
  providerController.completeBooking,
);
router.get("/:userId/earnings", auth, providerController.getEarnings);
router.get("/:userId/reviews", auth, providerController.getReviews);

export default router;

import express from "express";
import * as adminController from "../controllers/adminController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Test endpoint
router.get("/test", adminController.test);

// Admin routes (all require authentication and admin role)
router.get(
  "/dashboard",
  auth,
  requireRole("admin"),
  adminController.getDashboardStats,
);
router.get("/stats", auth, requireRole("admin"), adminController.getStats);
router.get("/users", auth, requireRole("admin"), adminController.getAllUsers);
router.put(
  "/users/:userId",
  auth,
  requireRole("admin"),
  adminController.updateUser,
);
router.patch(
  "/users/:userId/toggle-block",
  auth,
  requireRole("admin"),
  adminController.toggleBlockUser,
);
router.delete(
  "/users/:userId",
  auth,
  requireRole("admin"),
  adminController.deleteUser,
);
router.patch(
  "/users/:userId/reset-rejection",
  auth,
  requireRole("admin"),
  adminController.resetProviderRejection,
);
router.get(
  "/providers",
  auth,
  requireRole("admin"),
  adminController.getAllProviders,
);
router.put(
  "/providers/:providerId",
  auth,
  requireRole("admin"),
  adminController.updateProvider,
);
router.get(
  "/providers/pending",
  auth,
  requireRole("admin"),
  adminController.getPendingProviders,
);
router.patch(
  "/providers/:providerId/approve",
  auth,
  requireRole("admin"),
  adminController.approveProvider,
);
router.patch(
  "/providers/:providerId/reject",
  auth,
  requireRole("admin"),
  adminController.rejectProvider,
);
router.delete(
  "/providers/:providerId",
  auth,
  requireRole("admin"),
  adminController.deleteProvider,
);
router.get(
  "/services",
  auth,
  requireRole("admin"),
  adminController.getAllServices,
);
router.put(
  "/services/:serviceId",
  auth,
  requireRole("admin"),
  adminController.updateService,
);
router.delete(
  "/services/:serviceId",
  auth,
  requireRole("admin"),
  adminController.deleteService,
);
router.get(
  "/bookings",
  auth,
  requireRole("admin"),
  adminController.getAllBookings,
);
router.put(
  "/bookings/:bookingId",
  auth,
  requireRole("admin"),
  adminController.updateBooking,
);
router.patch(
  "/bookings/:bookingId/status",
  auth,
  requireRole("admin"),
  adminController.updateBookingStatus,
);
router.delete(
  "/bookings/:bookingId",
  auth,
  requireRole("admin"),
  adminController.deleteBooking,
);
router.get(
  "/payments",
  auth,
  requireRole("admin"),
  adminController.getAllPayments,
);
router.get(
  "/earnings",
  auth,
  requireRole("admin"),
  adminController.getPlatformEarnings,
);
router.patch(
  "/platform-fee",
  auth,
  requireRole("admin"),
  adminController.updatePlatformFee,
);
router.get(
  "/reviews",
  auth,
  requireRole("admin"),
  adminController.getAllReviews,
);
router.patch(
  "/reviews/:reviewId/toggle-visibility",
  auth,
  requireRole("admin"),
  adminController.toggleReviewVisibility,
);
router.delete(
  "/reviews/:reviewId",
  auth,
  requireRole("admin"),
  adminController.deleteReview,
);

// Category Management Routes
// GET categories is public (for provider registration)
router.get("/categories", adminController.getCategories);

// Other category routes require admin auth
router.post(
  "/categories",
  auth,
  requireRole("admin"),
  adminController.addCategory,
);
router.put(
  "/categories",
  auth,
  requireRole("admin"),
  adminController.updateCategory,
);
router.delete(
  "/categories",
  auth,
  requireRole("admin"),
  adminController.deleteCategory,
);

// Provider Application Management Routes
router.get(
  "/provider-applications",
  auth,
  requireRole("admin"),
  adminController.getProviderApplications,
);
router.get(
  "/provider-applications/:id",
  auth,
  requireRole("admin"),
  adminController.getProviderApplication,
);
router.patch(
  "/provider-applications/:id/approve",
  auth,
  requireRole("admin"),
  adminController.approveProviderApplication,
);
router.patch(
  "/provider-applications/:id/reject",
  auth,
  requireRole("admin"),
  adminController.rejectProviderApplication,
);

export default router;

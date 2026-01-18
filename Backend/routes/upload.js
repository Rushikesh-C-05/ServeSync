import express from "express";
import * as uploadController from "../controllers/uploadController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  uploadUserImage,
  uploadProviderImage,
  uploadServiceImage,
} from "../config/cloudinary.js";

const router = express.Router();

// User profile image routes
router.post(
  "/user/profile-image",
  auth,
  uploadUserImage.single("image"),
  uploadController.uploadUserProfileImage,
);
router.delete(
  "/user/profile-image",
  auth,
  uploadController.deleteUserProfileImage,
);

// Provider profile image routes
router.post(
  "/provider/profile-image",
  auth,
  uploadProviderImage.single("image"),
  uploadController.uploadProviderProfileImage,
);
router.delete(
  "/provider/profile-image",
  auth,
  uploadController.deleteProviderProfileImage,
);

// Service image routes (provider)
router.post(
  "/service/:serviceId/image",
  auth,
  uploadServiceImage.single("image"),
  uploadController.uploadServiceImage,
);
router.delete(
  "/service/:serviceId/image",
  auth,
  uploadController.deleteServiceImage,
);

// Admin service image route
router.post(
  "/admin/service/:serviceId/image",
  adminAuth,
  uploadServiceImage.single("image"),
  uploadController.adminUploadServiceImage,
);

export default router;

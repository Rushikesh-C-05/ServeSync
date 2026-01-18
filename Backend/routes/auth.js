import express from "express";
import * as authController from "../controllers/authController.js";
import { uploadUserImage } from "../config/cloudinary.js";

const router = express.Router();

// Auth routes
router.post(
  "/register",
  uploadUserImage.single("profileImage"),
  authController.register,
);
router.post("/login/user", authController.userLogin);
router.post("/login/provider", authController.providerLogin);
router.post("/login/admin", authController.adminLogin);

export default router;

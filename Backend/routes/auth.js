import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", authController.register);
router.post("/register/provider", authController.registerProvider);
router.post("/login/user", authController.userLogin);
router.post("/login/provider", authController.providerLogin);
router.post("/login/admin", authController.adminLogin);

export default router;

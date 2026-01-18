import express from "express";
import * as serviceController from "../controllers/serviceController.js";

const router = express.Router();

// Service routes (public)
router.get("/", serviceController.getAllServices);
router.get("/search", serviceController.searchServices);
router.get("/category/:category", serviceController.getServicesByCategory);
router.get("/:serviceId", serviceController.getServiceById);
router.get("/:serviceId/reviews", serviceController.getServiceReviews);

export default router;

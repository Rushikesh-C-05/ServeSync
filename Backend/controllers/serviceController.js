import Service from "../models/Service.js";
import Provider from "../models/Provider.js";
import { apiResponse } from "../utils/helpers.js";

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true })
      .populate({
        path: "providerId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Services retrieved", services));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get services", error.message));
  }
};

// Search services
export const searchServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;

    let query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const services = await Service.find(query)
      .populate({
        path: "providerId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ rating: -1 });

    res.json(apiResponse(true, "Services retrieved", services));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to search services", error.message));
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId).populate({
      path: "providerId",
      populate: { path: "userId", select: "name email phone" },
    });

    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    res.json(apiResponse(true, "Service retrieved", service));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get service", error.message));
  }
};

// Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({
      category: req.params.category,
      isAvailable: true,
    })
      .populate({
        path: "providerId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ rating: -1 });

    res.json(apiResponse(true, "Services retrieved", services));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get services", error.message));
  }
};

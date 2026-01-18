import Service from "../models/Service.js";
import Provider from "../models/Provider.js";
import Review from "../models/Review.js";
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

// Get reviews for a service
export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    // Build sort option
    let sortOption = { createdAt: -1 }; // Default: most recent
    if (sort === "highest") {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === "lowest") {
      sortOption = { rating: 1, createdAt: -1 };
    } else if (sort === "helpful") {
      sortOption = { helpfulCount: -1, createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ serviceId, isVisible: true })
      .populate("userId", "name profileImage")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({
      serviceId,
      isVisible: true,
    });

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { serviceId: service._id, isVisible: true } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    ratingDistribution.forEach((item) => {
      distribution[item._id] = item.count;
    });

    res.json(
      apiResponse(true, "Reviews retrieved", {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / parseInt(limit)),
          totalReviews,
          hasMore: skip + reviews.length < totalReviews,
        },
        stats: {
          averageRating: service.rating,
          totalReviews: service.reviewCount,
          distribution,
        },
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get reviews", error.message));
  }
};

import Provider from "../models/Provider.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";
import { apiResponse } from "../utils/helpers.js";

// Test endpoint
export const test = (req, res) => {
  res.json(apiResponse(true, "Provider controller test", "OK"));
};

// Get provider dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    // Get all services
    const services = await Service.find({ providerId: provider._id });
    const totalServices = services.length;

    // Get all bookings
    const allBookings = await Booking.find({ providerId: provider._id });

    const activeBookings = allBookings.filter(
      (b) => b.status === "pending" || b.status === "accepted",
    ).length;

    const completedBookings = allBookings.filter(
      (b) => b.status === "completed",
    ).length;

    const pendingRequests = allBookings.filter(
      (b) => b.status === "pending",
    ).length;

    // Calculate earnings
    const payments = await Payment.find({
      providerId: provider._id,
      status: "completed",
    });

    const totalEarnings = payments.reduce(
      (sum, p) => sum + (p.providerAmount || 0),
      0,
    );

    // Get average rating
    const reviews = await Review.find({ providerId: provider._id });
    const rating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    // Get recent bookings (last 5)
    const recentBookings = await Booking.find({ providerId: provider._id })
      .populate("serviceId")
      .populate("userId")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get service stats
    const serviceStats = await Promise.all(
      services.slice(0, 5).map(async (service) => {
        const bookings = await Booking.countDocuments({
          serviceId: service._id,
        });
        return {
          _id: service._id,
          name: service.name,
          price: service.price,
          bookings,
          status: service.isAvailable ? "active" : "inactive",
        };
      }),
    );

    const stats = {
      totalServices,
      activeBookings,
      completedBookings,
      totalEarnings: totalEarnings.toFixed(2),
      rating: parseFloat(rating),
      pendingRequests,
      recentBookings,
      services: serviceStats,
    };

    res.json(apiResponse(true, "Dashboard stats retrieved", stats));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get dashboard stats", error.message));
  }
};

// Register as provider
export const register = async (req, res) => {
  try {
    const { businessName, description, category, experience, certifications } =
      req.body;

    // Check if already registered as provider
    const existingProvider = await Provider.findOne({ userId: req.userId });
    if (existingProvider) {
      return res
        .status(400)
        .json(apiResponse(false, "Already registered as provider"));
    }

    // Create provider profile
    const provider = new Provider({
      userId: req.userId,
      businessName,
      description,
      category,
      experience,
      certifications: certifications || [],
      status: "pending",
    });

    await provider.save();

    res
      .status(201)
      .json(apiResponse(true, "Provider registration submitted", provider));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Registration failed", error.message));
  }
};

// Get provider profile
export const getProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId }).populate(
      "userId",
      "-password",
    );
    if (!provider) {
      return res
        .status(404)
        .json(apiResponse(false, "Provider profile not found"));
    }
    res.json(apiResponse(true, "Provider profile retrieved", provider));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get profile", error.message));
  }
};

// Create service
export const createService = async (req, res) => {
  try {
    const { name, description, category, price, duration } = req.body;

    // Get provider
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res
        .status(404)
        .json(apiResponse(false, "Provider profile not found"));
    }

    if (provider.status !== "approved") {
      return res
        .status(403)
        .json(apiResponse(false, "Provider not approved yet"));
    }

    // Create service
    const service = new Service({
      providerId: provider._id,
      name,
      description,
      category,
      price,
      duration,
      isAvailable: true,
    });

    await service.save();

    res.status(201).json(apiResponse(true, "Service created", service));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to create service", error.message));
  }
};

// Get provider services
export const getServices = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const services = await Service.find({ providerId: provider._id });
    res.json(apiResponse(true, "Services retrieved", services));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get services", error.message));
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { name, description, category, price, duration } = req.body;

    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, providerId: provider._id },
      { name, description, category, price, duration, updatedAt: Date.now() },
      { new: true },
    );

    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    res.json(apiResponse(true, "Service updated", service));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update service", error.message));
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const service = await Service.findOneAndDelete({
      _id: req.params.serviceId,
      providerId: provider._id,
    });

    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    res.json(apiResponse(true, "Service deleted", null));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete service", error.message));
  }
};

// Toggle service availability
export const toggleAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const service = await Service.findOne({
      _id: req.params.serviceId,
      providerId: provider._id,
    });

    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    service.isAvailable = !service.isAvailable;
    service.updatedAt = Date.now();
    await service.save();

    res.json(apiResponse(true, "Service availability updated", service));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update availability", error.message));
  }
};

// Get provider bookings
export const getBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const bookings = await Booking.find({ providerId: provider._id })
      .populate("userId", "-password")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Bookings retrieved", bookings));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get bookings", error.message));
  }
};

// Accept booking
export const acceptBooking = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      providerId: provider._id,
      status: "pending",
    });

    if (!booking) {
      return res
        .status(404)
        .json(apiResponse(false, "Booking not found or already processed"));
    }

    booking.status = "accepted";
    booking.updatedAt = Date.now();
    await booking.save();

    res.json(apiResponse(true, "Booking accepted", booking));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to accept booking", error.message));
  }
};

// Reject booking
export const rejectBooking = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      providerId: provider._id,
      status: "pending",
    });

    if (!booking) {
      return res
        .status(404)
        .json(apiResponse(false, "Booking not found or already processed"));
    }

    booking.status = "rejected";
    booking.updatedAt = Date.now();
    await booking.save();

    res.json(apiResponse(true, "Booking rejected", booking));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to reject booking", error.message));
  }
};

// Complete booking
export const completeBooking = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      providerId: provider._id,
      status: "accepted",
    });

    if (!booking) {
      return res
        .status(404)
        .json(apiResponse(false, "Booking not found or not accepted"));
    }

    booking.status = "completed";
    booking.updatedAt = Date.now();
    await booking.save();

    // Create payment record
    const providerAmount = booking.serviceAmount;
    const payment = new Payment({
      bookingId: booking._id,
      userId: booking.userId,
      providerId: provider._id,
      amount: booking.totalAmount,
      platformFee: booking.platformFee,
      providerAmount,
      status: "completed",
    });
    await payment.save();

    // Update provider earnings
    provider.totalEarnings += providerAmount;
    await provider.save();

    res.json(apiResponse(true, "Booking completed", booking));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to complete booking", error.message));
  }
};

// Get earnings
export const getEarnings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const payments = await Payment.find({
      providerId: provider._id,
      status: "completed",
    });

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + payment.providerAmount,
      0,
    );
    const totalBookings = await Booking.countDocuments({
      providerId: provider._id,
      status: "completed",
    });

    const earnings = {
      totalEarnings,
      totalBookings,
      recentPayments: payments.slice(-10),
    };

    res.json(apiResponse(true, "Earnings retrieved", earnings));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get earnings", error.message));
  }
};

// Get provider reviews
export const getReviews = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    const reviews = await Review.find({ providerId: provider._id })
      .populate("userId", "name")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Reviews retrieved", reviews));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get reviews", error.message));
  }
};

import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import PlatformConfig from "../models/PlatformConfig.js";
import ProviderApplication from "../models/ProviderApplication.js";
import { apiResponse } from "../utils/helpers.js";

// Test endpoint
export const test = (req, res) => {
  res.json(apiResponse(true, "User service is running", "OK"));
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }
    res.json(apiResponse(true, "Profile retrieved", user));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get profile", error.message));
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address, updatedAt: Date.now() },
      { new: true },
    ).select("-password");

    res.json(apiResponse(true, "Profile updated", user));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update profile", error.message));
  }
};

// Book a service
export const bookService = async (req, res) => {
  try {
    const { serviceId, bookingDate, bookingTime, userAddress, notes } =
      req.body;

    // Get service details
    const service = await Service.findById(serviceId).populate("providerId");
    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    if (!service.isAvailable) {
      return res
        .status(400)
        .json(apiResponse(false, "Service is not available"));
    }

    // Check if providerId exists
    if (!service.providerId) {
      return res
        .status(400)
        .json(apiResponse(false, "Service has no associated provider"));
    }

    // Get platform fee
    let config = await PlatformConfig.findOne();
    if (!config) {
      config = new PlatformConfig();
      await config.save();
    }

    const serviceAmount = service.price;
    const platformFee = (serviceAmount * config.feePercentage) / 100;
    const totalAmount = serviceAmount + platformFee;

    // Get providerId - handle both populated and non-populated cases
    const providerId = service.providerId._id || service.providerId;

    // Create booking with payment_pending status
    const booking = new Booking({
      userId: req.userId,
      serviceId,
      providerId: providerId,
      bookingDate,
      bookingTime,
      userAddress,
      notes,
      serviceAmount,
      platformFee,
      totalAmount,
      status: "pending", // Will be updated after payment
    });

    await booking.save();

    // Return booking details for payment
    res
      .status(201)
      .json(
        apiResponse(
          true,
          "Booking created successfully. Please proceed with payment.",
          booking,
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to create booking", error.message));
  }
};

// Get user bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate("serviceId")
      .populate("providerId")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Bookings retrieved", bookings));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get bookings", error.message));
  }
};

// Get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.userId,
    })
      .populate("serviceId")
      .populate("providerId");

    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    res.json(apiResponse(true, "Booking retrieved", booking));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get booking", error.message));
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.userId,
    });

    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res
        .status(400)
        .json(apiResponse(false, "Cannot cancel this booking"));
    }

    booking.status = "cancelled";
    booking.updatedAt = Date.now();
    await booking.save();

    res.json(apiResponse(true, "Booking cancelled", booking));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to cancel booking", error.message));
  }
};

// Submit review
export const submitReview = async (req, res) => {
  try {
    const { serviceId, providerId, bookingId, rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json(apiResponse(false, "Rating must be between 1 and 5"));
    }

    // Validate comment
    if (!comment || comment.trim().length < 10) {
      return res
        .status(400)
        .json(
          apiResponse(false, "Review comment must be at least 10 characters"),
        );
    }

    // Check if booking exists and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.userId,
      status: "completed",
    });

    if (!booking) {
      return res
        .status(400)
        .json(apiResponse(false, "Can only review completed bookings"));
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res
        .status(400)
        .json(apiResponse(false, "Already reviewed this booking"));
    }

    // Create review
    const review = new Review({
      userId: req.userId,
      serviceId,
      providerId,
      bookingId,
      rating,
      comment: comment.trim(),
    });

    await review.save();

    // Update service rating and review count
    const allServiceReviews = await Review.find({ serviceId });
    const avgRating =
      allServiceReviews.reduce((sum, r) => sum + r.rating, 0) /
      allServiceReviews.length;

    await Service.findByIdAndUpdate(serviceId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: allServiceReviews.length,
      updatedAt: Date.now(),
    });

    // Populate and return the review
    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name profileImage")
      .populate("serviceId", "name")
      .populate("providerId", "businessName");

    res
      .status(201)
      .json(
        apiResponse(true, "Review submitted successfully", populatedReview),
      );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to submit review", error.message));
  }
};

// Check if user can review a booking
export const canReviewBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.userId,
    });

    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res.json(
        apiResponse(true, "Booking status check", {
          canReview: false,
          reason: "Booking must be completed before reviewing",
        }),
      );
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.json(
        apiResponse(true, "Review check", {
          canReview: false,
          reason: "You have already reviewed this booking",
          review: existingReview,
        }),
      );
    }

    res.json(
      apiResponse(true, "Can review", {
        canReview: true,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to check review status", error.message));
  }
};

// Get user reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.userId })
      .populate("serviceId")
      .populate("providerId")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Reviews retrieved", reviews));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get reviews", error.message));
  }
};

// Get user dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all bookings for stats
    const allBookings = await Booking.find({ userId });

    const activeBookings = allBookings.filter(
      (b) => b.status === "pending" || b.status === "accepted",
    ).length;

    const completedBookings = allBookings.filter(
      (b) => b.status === "completed",
    ).length;

    const totalSpent = allBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Get recent bookings (last 5)
    const recentBookings = await Booking.find({ userId })
      .populate("serviceId")
      .populate("providerId")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get featured services (top rated)
    const featuredServices = await Service.find({ isAvailable: true })
      .populate("providerId")
      .sort({ rating: -1 })
      .limit(6);

    const stats = {
      activeBookings,
      completedBookings,
      totalSpent: totalSpent.toFixed(2),
      recentBookings,
      featuredServices,
    };

    res.json(apiResponse(true, "Dashboard stats retrieved", stats));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get dashboard stats", error.message));
  }
};

// Submit provider application
export const submitProviderApplication = async (req, res) => {
  try {
    const {
      businessName,
      businessDescription,
      category,
      experience,
      phone,
      address,
      certifications,
      portfolio,
    } = req.body;

    // Check if user is already a provider
    const user = await User.findById(req.userId);
    if (user.role === "provider") {
      return res
        .status(400)
        .json(apiResponse(false, "You are already a provider"));
    }

    // Check if user was rejected and cannot reapply
    if (user.providerRejected && !user.canReapply) {
      return res
        .status(403)
        .json(
          apiResponse(
            false,
            `Your previous application was rejected. Reason: ${user.providerRejectionReason}. Please contact admin for further assistance.`,
          ),
        );
    }

    // Check if user already has a pending or approved application
    const existingApplication = await ProviderApplication.findOne({
      userId: req.userId,
      status: { $in: ["pending", "approved"] },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json(
          apiResponse(
            false,
            existingApplication.status === "approved"
              ? "You are already a provider"
              : "You already have a pending application",
          ),
        );
    }

    const application = new ProviderApplication({
      userId: req.userId,
      businessName,
      businessDescription,
      category,
      experience,
      phone,
      address,
      certifications,
      portfolio,
      businessImage: req.file ? req.file.path : null,
      status: "pending",
    });

    await application.save();

    res
      .status(201)
      .json(
        apiResponse(
          true,
          "Application submitted successfully. Wait for admin approval.",
          application,
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to submit application", error.message));
  }
};

// Get user's provider application status
export const getProviderApplicationStatus = async (req, res) => {
  try {
    const application = await ProviderApplication.findOne({
      userId: req.userId,
    }).sort({ submittedAt: -1 });

    if (!application) {
      return res.json(
        apiResponse(true, "No application found", { hasApplication: false }),
      );
    }

    res.json(
      apiResponse(true, "Application status retrieved", {
        hasApplication: true,
        application,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(
        apiResponse(false, "Failed to get application status", error.message),
      );
  }
};

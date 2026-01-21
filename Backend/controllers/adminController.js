import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Review from "../models/Review.js";
import PlatformConfig from "../models/PlatformConfig.js";
import ProviderApplication from "../models/ProviderApplication.js";
import { apiResponse } from "../utils/helpers.js";

// Test endpoint
export const test = (req, res) => {
  res.json(apiResponse(true, "Admin controller test", "OK"));
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

// Helper function to parse time ago string for sorting
function parseTimeAgo(timeStr) {
  const match = timeStr.match(/(\d+)\s+(\w+)/);
  if (!match) return Infinity;

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit.includes("second")) return value;
  if (unit.includes("minute")) return value * 60;
  if (unit.includes("hour")) return value * 3600;
  if (unit.includes("day")) return value * 86400;
  return Infinity;
}

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProviders = await Provider.countDocuments({
      status: "approved",
    });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({
      status: { $in: ["pending", "accepted"] },
    });
    const pendingApprovals = await Provider.countDocuments({
      status: "pending",
    });

    // Calculate revenue
    const revenueData = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Get recent activity
    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt");

    const recentProviders = await Provider.find({ status: "pending" })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await Booking.find({ status: "completed" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("totalAmount updatedAt");

    const recentPayments = await Payment.find({ status: "completed" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("amount createdAt");

    // Combine recent activity
    const recentActivity = [];

    recentUsers.forEach((user) => {
      recentActivity.push({
        type: "user",
        action: "New user registered",
        name: user.name,
        time: getTimeAgo(user.createdAt),
      });
    });

    recentProviders.forEach((provider) => {
      recentActivity.push({
        type: "provider",
        action: "Provider approval pending",
        name: provider.userId?.name || "Unknown",
        time: getTimeAgo(provider.createdAt),
      });
    });

    recentBookings.slice(0, 2).forEach((booking) => {
      recentActivity.push({
        type: "booking",
        action: "New booking completed",
        name: `Booking #${booking._id.toString().slice(-6)}`,
        time: getTimeAgo(booking.updatedAt),
      });
    });

    recentPayments.slice(0, 2).forEach((payment) => {
      recentActivity.push({
        type: "payment",
        action: "Payment received",
        name: `$${payment.amount.toFixed(2)}`,
        time: getTimeAgo(payment.createdAt),
      });
    });

    // Sort by time and limit to 4
    recentActivity.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });

    const stats = {
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      totalRevenue: totalRevenue.toFixed(2),
      activeBookings,
      pendingApprovals,
      recentActivity: recentActivity.slice(0, 4),
    };

    res.json(apiResponse(true, "Dashboard stats retrieved", stats));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get dashboard stats", error.message));
  }
};

// Get platform statistics
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProviders = await Provider.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const platformRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$platformFee" } } },
    ]);

    const stats = {
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      platformRevenue: platformRevenue[0]?.total || 0,
    };

    res.json(apiResponse(true, "Platform stats retrieved", stats));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get stats", error.message));
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // Get all users (both regular users and providers)
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Users retrieved", users));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get users", error.message));
  }
};

// Toggle block user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json(apiResponse(false, "Cannot block admin users"));
    }

    user.isBlocked = !user.isBlocked;
    user.updatedAt = Date.now();
    await user.save();

    res.json(
      apiResponse(true, "User status updated", {
        email: user.email,
        isBlocked: user.isBlocked,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update user", error.message));
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json(apiResponse(false, "Cannot delete admin users"));
    }

    // Delete related data
    await Booking.deleteMany({ userId: user._id });
    await Review.deleteMany({ userId: user._id });
    await Payment.deleteMany({ userId: user._id });

    // If user is a provider, delete provider data
    if (user.role === "provider") {
      const provider = await Provider.findOne({ userId: user._id });
      if (provider) {
        await Service.deleteMany({ providerId: provider._id });
        await Booking.deleteMany({ providerId: provider._id });
        await Provider.findByIdAndDelete(provider._id);
      }
    }

    await User.findByIdAndDelete(user._id);

    res.json(apiResponse(true, "User deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete user", error.message));
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json(apiResponse(false, "Cannot edit admin users"));
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json(apiResponse(false, "Email already in use"));
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    user.updatedAt = Date.now();

    await user.save();

    res.json(
      apiResponse(true, "User updated successfully", {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update user", error.message));
  }
};

// Reset provider rejection status - allow user to reapply
export const resetProviderRejection = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    user.providerRejected = false;
    user.providerRejectionReason = "";
    user.canReapply = true;
    await user.save();

    res.json(
      apiResponse(
        true,
        "User can now reapply for provider status",
        user.select("-password"),
      ),
    );
  } catch (error) {
    res
      .status(500)
      .json(
        apiResponse(false, "Failed to reset rejection status", error.message),
      );
  }
};

// Get all providers
export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Providers retrieved", providers));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get providers", error.message));
  }
};

// Update provider details
export const updateProvider = async (req, res) => {
  try {
    const { businessName, description, category, experience } = req.body;
    const provider = await Provider.findById(req.params.providerId);

    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    if (businessName) provider.businessName = businessName;
    if (description) provider.description = description;
    if (category) provider.category = category;
    if (experience !== undefined) provider.experience = experience;
    provider.updatedAt = Date.now();

    await provider.save();

    res.json(apiResponse(true, "Provider updated successfully", provider));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update provider", error.message));
  }
};

// Get pending providers
export const getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ status: "pending" })
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Pending providers retrieved", providers));
  } catch (error) {
    res
      .status(500)
      .json(
        apiResponse(false, "Failed to get pending providers", error.message),
      );
  }
};

// Approve provider
export const approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId);
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    provider.status = "approved";
    provider.updatedAt = Date.now();
    await provider.save();

    // Update user role to provider
    await User.findByIdAndUpdate(provider.userId, { role: "provider" });

    res.json(apiResponse(true, "Provider approved", provider));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to approve provider", error.message));
  }
};

// Reject provider
export const rejectProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId);
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    provider.status = "rejected";
    provider.updatedAt = Date.now();
    await provider.save();

    res.json(apiResponse(true, "Provider rejected", provider));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to reject provider", error.message));
  }
};

// Delete provider
export const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId);
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    // Delete all related data
    await Service.deleteMany({ providerId: provider._id });
    await Booking.deleteMany({ providerId: provider._id });
    await Payment.deleteMany({ providerId: provider._id });
    await Review.deleteMany({ providerId: provider._id });

    // Update user role back to user and reset provider fields
    await User.findByIdAndUpdate(
      provider.userId,
      {
        role: "user",
        providerRejected: false,
        providerRejectionReason: null,
        canReapply: true,
      },
      { new: true },
    );

    // Delete all provider applications (approved, rejected, or pending)
    await ProviderApplication.deleteMany({
      userId: provider.userId,
    });

    // Delete the provider
    await Provider.findByIdAndDelete(provider._id);

    res.json(
      apiResponse(
        true,
        "Provider deleted successfully and user role updated to user",
      ),
    );
  } catch (error) {
    console.error("Delete provider error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete provider", error.message));
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("providerId")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Services retrieved", services));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get services", error.message));
  }
};

// Update service details
export const updateService = async (req, res) => {
  try {
    const { title, description, category, price, pricingType, location } =
      req.body;
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price !== undefined) service.price = price;
    if (pricingType) service.pricingType = pricingType;
    if (location) service.location = location;
    service.updatedAt = Date.now();

    await service.save();

    res.json(apiResponse(true, "Service updated successfully", service));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update service", error.message));
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "-password")
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

// Update booking details
export const updateBooking = async (req, res) => {
  try {
    const { scheduledDate, scheduledTime, notes } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    if (scheduledDate) booking.scheduledDate = scheduledDate;
    if (scheduledTime) booking.scheduledTime = scheduledTime;
    if (notes !== undefined) booking.notes = notes;
    booking.updatedAt = Date.now();

    await booking.save();

    res.json(apiResponse(true, "Booking updated successfully", booking));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update booking", error.message));
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("providerId")
      .populate("bookingId")
      .sort({ createdAt: -1 });

    res.json(apiResponse(true, "Payments retrieved", payments));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get payments", error.message));
  }
};

// Get platform earnings
export const getPlatformEarnings = async (req, res) => {
  try {
    const earnings = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalPlatformFee: { $sum: "$platformFee" },
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const result = earnings[0] || { totalPlatformFee: 0, totalRevenue: 0 };

    res.json(apiResponse(true, "Platform earnings retrieved", result));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get earnings", error.message));
  }
};

// Update platform fee
export const updatePlatformFee = async (req, res) => {
  try {
    const { percentage } = req.body;

    if (percentage < 0 || percentage > 50) {
      return res
        .status(400)
        .json(apiResponse(false, "Fee percentage must be between 0 and 50"));
    }

    let config = await PlatformConfig.findOne();
    if (!config) {
      config = new PlatformConfig();
    }

    config.feePercentage = percentage;
    config.updatedAt = Date.now();
    await config.save();

    res.json(
      apiResponse(true, "Platform fee updated", {
        feePercentage: config.feePercentage,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update fee", error.message));
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("providerId", "businessName")
      .populate("serviceId", "name")
      .populate("bookingId", "bookingDate")
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating]++;
    });

    res.json(
      apiResponse(true, "Reviews retrieved", {
        reviews,
        stats: {
          totalReviews,
          averageRating: parseFloat(avgRating.toFixed(1)),
          distribution,
          visibleReviews: reviews.filter((r) => r.isVisible).length,
          hiddenReviews: reviews.filter((r) => !r.isVisible).length,
        },
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get reviews", error.message));
  }
};

// Toggle review visibility
export const toggleReviewVisibility = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json(apiResponse(false, "Review not found"));
    }

    review.isVisible = !review.isVisible;
    review.updatedAt = new Date();
    await review.save();

    // Update service rating if visibility changed
    const allServiceReviews = await Review.find({
      serviceId: review.serviceId,
      isVisible: true,
    });

    const newRating =
      allServiceReviews.length > 0
        ? allServiceReviews.reduce((sum, r) => sum + r.rating, 0) /
          allServiceReviews.length
        : 0;

    await Service.findByIdAndUpdate(review.serviceId, {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: allServiceReviews.length,
      updatedAt: Date.now(),
    });

    const updatedReview = await Review.findById(reviewId)
      .populate("userId", "name email")
      .populate("providerId", "businessName")
      .populate("serviceId", "name");

    res.json(
      apiResponse(
        true,
        review.isVisible ? "Review is now visible" : "Review is now hidden",
        updatedReview,
      ),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to update review", error.message));
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json(apiResponse(false, "Review not found"));
    }

    const serviceId = review.serviceId;
    await Review.findByIdAndDelete(reviewId);

    // Update service rating
    const allServiceReviews = await Review.find({
      serviceId,
      isVisible: true,
    });

    const newRating =
      allServiceReviews.length > 0
        ? allServiceReviews.reduce((sum, r) => sum + r.rating, 0) /
          allServiceReviews.length
        : 0;

    await Service.findByIdAndUpdate(serviceId, {
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: allServiceReviews.length,
      updatedAt: Date.now(),
    });

    res.json(apiResponse(true, "Review deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete review", error.message));
  }
};

// ==================== CATEGORY MANAGEMENT ====================

// Get all categories
export const getCategories = async (req, res) => {
  try {
    let config = await PlatformConfig.findOne();

    // Create default config if it doesn't exist
    if (!config) {
      config = new PlatformConfig();
      await config.save();
    }

    res.json(apiResponse(true, "Categories retrieved", config.categories));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Error fetching categories", error.message));
  }
};

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !category.trim()) {
      return res
        .status(400)
        .json(apiResponse(false, "Category name is required"));
    }

    let config = await PlatformConfig.findOne();

    if (!config) {
      config = new PlatformConfig();
    }

    // Check if category already exists (case-insensitive)
    const categoryExists = config.categories.some(
      (cat) => cat.toLowerCase() === category.trim().toLowerCase(),
    );

    if (categoryExists) {
      return res
        .status(400)
        .json(apiResponse(false, "Category already exists"));
    }

    config.categories.push(category.trim());
    config.updatedAt = Date.now();
    await config.save();

    res.json(
      apiResponse(true, "Category added successfully", config.categories),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Error adding category", error.message));
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;

    if (!oldCategory || !newCategory || !newCategory.trim()) {
      return res
        .status(400)
        .json(
          apiResponse(false, "Both old and new category names are required"),
        );
    }

    let config = await PlatformConfig.findOne();

    if (!config) {
      return res
        .status(404)
        .json(apiResponse(false, "Configuration not found"));
    }

    const categoryIndex = config.categories.findIndex(
      (cat) => cat === oldCategory,
    );

    if (categoryIndex === -1) {
      return res.status(404).json(apiResponse(false, "Category not found"));
    }

    // Check if new category name already exists
    const newCategoryExists = config.categories.some(
      (cat, idx) =>
        idx !== categoryIndex &&
        cat.toLowerCase() === newCategory.trim().toLowerCase(),
    );

    if (newCategoryExists) {
      return res
        .status(400)
        .json(apiResponse(false, "A category with this name already exists"));
    }

    config.categories[categoryIndex] = newCategory.trim();
    config.updatedAt = Date.now();
    await config.save();

    // Update all providers using the old category
    await Provider.updateMany(
      { category: oldCategory },
      { $set: { category: newCategory.trim() } },
    );

    res.json(
      apiResponse(true, "Category updated successfully", config.categories),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Error updating category", error.message));
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json(apiResponse(false, "Category name is required"));
    }

    let config = await PlatformConfig.findOne();

    if (!config) {
      return res
        .status(404)
        .json(apiResponse(false, "Configuration not found"));
    }

    const categoryIndex = config.categories.findIndex(
      (cat) => cat === category,
    );

    if (categoryIndex === -1) {
      return res.status(404).json(apiResponse(false, "Category not found"));
    }

    // Check if any providers are using this category
    const providersUsingCategory = await Provider.countDocuments({ category });

    if (providersUsingCategory > 0) {
      return res
        .status(400)
        .json(
          apiResponse(
            false,
            `Cannot delete category. ${providersUsingCategory} provider(s) are using this category.`,
          ),
        );
    }

    config.categories.splice(categoryIndex, 1);
    config.updatedAt = Date.now();
    await config.save();

    res.json(
      apiResponse(true, "Category deleted successfully", config.categories),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Error deleting category", error.message));
  }
};

// Get all provider applications
export const getProviderApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const applications = await ProviderApplication.find(filter)
      .populate("userId", "name email")
      .populate("reviewedBy", "name email")
      .sort({ submittedAt: -1 });

    res.json(
      apiResponse(true, "Applications retrieved successfully", applications),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get applications", error.message));
  }
};

// Get single provider application
export const getProviderApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await ProviderApplication.findById(id)
      .populate("userId", "name email phone address")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json(apiResponse(false, "Application not found"));
    }

    res.json(
      apiResponse(true, "Application retrieved successfully", application),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to get application", error.message));
  }
};

// Approve provider application
export const approveProviderApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const application = await ProviderApplication.findById(id);

    if (!application) {
      return res.status(404).json(apiResponse(false, "Application not found"));
    }

    if (application.status !== "pending") {
      return res
        .status(400)
        .json(apiResponse(false, `Application already ${application.status}`));
    }

    // Update user role to provider
    const user = await User.findById(application.userId);
    user.role = "provider";
    await user.save();

    // Create provider profile with approved status
    const provider = new Provider({
      userId: application.userId,
      businessName: application.businessName,
      description: application.businessDescription,
      category: application.category,
      experience: application.experience,
      contactInfo: {
        phone: application.phone,
        email: user.email,
        address: application.address,
      },
      certifications: application.certifications,
      portfolio: application.portfolio,
      status: "approved", // Set status to approved directly
      isActive: true,
      rating: 0,
      totalReviews: 0,
    });

    await provider.save();

    // Update application status
    application.status = "approved";
    application.adminNotes = adminNotes;
    application.reviewedBy = req.userId;
    application.reviewedAt = Date.now();
    await application.save();

    res.json(
      apiResponse(
        true,
        "Application approved successfully. User is now a provider.",
        {
          application,
          provider,
        },
      ),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to approve application", error.message));
  }
};

// Reject provider application
export const rejectProviderApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const application = await ProviderApplication.findById(id);

    if (!application) {
      return res.status(404).json(apiResponse(false, "Application not found"));
    }

    if (application.status !== "pending") {
      return res
        .status(400)
        .json(apiResponse(false, `Application already ${application.status}`));
    }

    // Update user with rejection flag
    const user = await User.findById(application.userId);
    user.providerRejected = true;
    user.providerRejectionReason =
      adminNotes || "Application rejected by admin";
    user.canReapply = false; // Prevent reapplication unless admin allows
    await user.save();

    // Update application status
    application.status = "rejected";
    application.adminNotes = adminNotes || "Application rejected by admin";
    application.reviewedBy = req.userId;
    application.reviewedAt = Date.now();
    await application.save();

    res.json(
      apiResponse(true, "Application rejected successfully", application),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Failed to reject application", error.message));
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    // Delete all bookings related to this service
    await Booking.deleteMany({ serviceId: service._id });
    await Payment.deleteMany({ serviceId: service._id });
    await Review.deleteMany({ serviceId: service._id });

    await Service.findByIdAndDelete(service._id);

    res.json(apiResponse(true, "Service deleted successfully"));
  } catch (error) {
    console.error("Delete service error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete service", error.message));
  }
};

// Update booking status (admin can change status)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    booking.status = status;
    await booking.save();

    res.json(apiResponse(true, "Booking status updated successfully", booking));
  } catch (error) {
    console.error("Update booking status error:", error);
    res
      .status(500)
      .json(
        apiResponse(false, "Failed to update booking status", error.message),
      );
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json(apiResponse(false, "Booking not found"));
    }

    // Delete related payments and reviews
    await Payment.deleteMany({ bookingId: booking._id });
    await Review.deleteMany({ bookingId: booking._id });

    await Booking.findByIdAndDelete(booking._id);

    res.json(apiResponse(true, "Booking deleted successfully"));
  } catch (error) {
    console.error("Delete booking error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete booking", error.message));
  }
};

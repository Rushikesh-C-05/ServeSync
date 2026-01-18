import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  // Provider response to the review
  providerResponse: {
    text: {
      type: String,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  // Whether the review is visible (for moderation)
  isVisible: {
    type: Boolean,
    default: true,
  },
  // Helpful votes count
  helpfulCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
reviewSchema.index({ serviceId: 1, createdAt: -1 });
reviewSchema.index({ providerId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);

import mongoose from "mongoose";

const platformConfigSchema = new mongoose.Schema({
  feePercentage: {
    type: Number,
    default: 10,
    required: true,
  },
  categories: {
    type: [String],
    default: [
      "Plumbing",
      "Electrical",
      "Cleaning",
      "Carpentry",
      "Painting",
      "Home Repair",
      "Landscaping",
      "Moving",
      "Pest Control",
      "Other",
    ],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PlatformConfig", platformConfigSchema);

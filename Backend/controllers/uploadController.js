import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Service from "../models/Service.js";
import { deleteImage } from "../config/cloudinary.js";
import { apiResponse } from "../utils/helpers.js";

// Upload user profile image
export const uploadUserProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(apiResponse(false, "No image file provided"));
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    // Delete old image if exists
    if (user.profileImage) {
      await deleteImage(user.profileImage);
    }

    // Update user with new image URL
    user.profileImage = req.file.path;
    user.updatedAt = Date.now();
    await user.save();

    res.json(
      apiResponse(true, "Profile image uploaded successfully", {
        profileImage: user.profileImage,
      }),
    );
  } catch (error) {
    console.error("Error uploading user profile image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to upload image", error.message));
  }
};

// Delete user profile image
export const deleteUserProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    if (user.profileImage) {
      await deleteImage(user.profileImage);
      user.profileImage = null;
      user.updatedAt = Date.now();
      await user.save();
    }

    res.json(apiResponse(true, "Profile image deleted successfully"));
  } catch (error) {
    console.error("Error deleting user profile image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete image", error.message));
  }
};

// Upload provider profile image
export const uploadProviderProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(apiResponse(false, "No image file provided"));
    }

    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    // Delete old image if exists
    if (provider.profileImage) {
      await deleteImage(provider.profileImage);
    }

    // Update provider with new image URL
    provider.profileImage = req.file.path;
    provider.updatedAt = Date.now();
    await provider.save();

    res.json(
      apiResponse(true, "Provider profile image uploaded successfully", {
        profileImage: provider.profileImage,
      }),
    );
  } catch (error) {
    console.error("Error uploading provider profile image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to upload image", error.message));
  }
};

// Delete provider profile image
export const deleteProviderProfileImage = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    if (provider.profileImage) {
      await deleteImage(provider.profileImage);
      provider.profileImage = null;
      provider.updatedAt = Date.now();
      await provider.save();
    }

    res.json(apiResponse(true, "Provider profile image deleted successfully"));
  } catch (error) {
    console.error("Error deleting provider profile image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete image", error.message));
  }
};

// Upload service image
export const uploadServiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(apiResponse(false, "No image file provided"));
    }

    const { serviceId } = req.params;

    // Get provider for current user
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    // Find service and verify ownership
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    if (service.providerId.toString() !== provider._id.toString()) {
      return res
        .status(403)
        .json(apiResponse(false, "Not authorized to update this service"));
    }

    // Delete old image if exists
    if (service.image) {
      await deleteImage(service.image);
    }

    // Update service with new image URL
    service.image = req.file.path;
    service.updatedAt = Date.now();
    await service.save();

    res.json(
      apiResponse(true, "Service image uploaded successfully", {
        image: service.image,
      }),
    );
  } catch (error) {
    console.error("Error uploading service image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to upload image", error.message));
  }
};

// Delete service image
export const deleteServiceImage = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Get provider for current user
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json(apiResponse(false, "Provider not found"));
    }

    // Find service and verify ownership
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    if (service.providerId.toString() !== provider._id.toString()) {
      return res
        .status(403)
        .json(apiResponse(false, "Not authorized to update this service"));
    }

    if (service.image) {
      await deleteImage(service.image);
      service.image = null;
      service.updatedAt = Date.now();
      await service.save();
    }

    res.json(apiResponse(true, "Service image deleted successfully"));
  } catch (error) {
    console.error("Error deleting service image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete image", error.message));
  }
};

// Admin: Upload service image (for any service)
export const adminUploadServiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(apiResponse(false, "No image file provided"));
    }

    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json(apiResponse(false, "Service not found"));
    }

    // Delete old image if exists
    if (service.image) {
      await deleteImage(service.image);
    }

    // Update service with new image URL
    service.image = req.file.path;
    service.updatedAt = Date.now();
    await service.save();

    res.json(
      apiResponse(true, "Service image uploaded successfully", {
        image: service.image,
      }),
    );
  } catch (error) {
    console.error("Error uploading service image:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to upload image", error.message));
  }
};

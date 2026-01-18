import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage for different types of images
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `servesync/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
  });
};

// User profile image storage
const userStorage = createStorage("users");
export const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Provider profile image storage
const providerStorage = createStorage("providers");
export const uploadProviderImage = multer({
  storage: providerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Service image storage
const serviceStorage = createStorage("services");
export const uploadServiceImage = multer({
  storage: serviceStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Delete image from Cloudinary
export const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) return;

    // Get the path after "upload/v{version}/"
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image: ${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export default cloudinary;

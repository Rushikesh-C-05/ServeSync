import { useState, useRef } from "react";
import { FiCamera, FiUpload, FiX, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

const ImageUpload = ({
  currentImage,
  onUpload,
  onDelete,
  type = "user", // 'user', 'provider', 'service'
  size = "md", // 'sm', 'md', 'lg'
  shape = "circle", // 'circle', 'square', 'rounded'
  disabled = false,
  loading = false,
  showDeleteButton = true,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      await onUpload(file);
      setPreview(null);
    } catch (error) {
      
      toast.error("Failed to upload image");
      setPreview(null);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      await onDelete();
    } catch (error) {
      
      toast.error("Failed to delete image");
    }
  };

  const displayImage = preview || currentImage;
  const isLoading = isUploading || loading;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main image container */}
      <div
        className={`
          ${sizeClasses[size]} 
          ${shapeClasses[shape]} 
          bg-gray-100 
          border-2 border-dashed border-gray-300 
          overflow-hidden 
          flex items-center justify-center
          ${!disabled && !isLoading ? "cursor-pointer hover:border-blue-400 hover:bg-gray-50" : ""}
          transition-all duration-200
          ${isLoading ? "opacity-50" : ""}
          relative
        `}
        onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
            <FiCamera
              size={iconSizes[size] * 0.7}
              className="text-gray-400 mb-1"
            />
            <span className="text-xs text-gray-500">Upload</span>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Action buttons below image */}
      {!disabled && !isLoading && (
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {displayImage ? "Change photo" : "Add photo"}
          </button>
          {displayImage && showDeleteButton && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isLoading}
      />
    </div>
  );
};

export default ImageUpload;

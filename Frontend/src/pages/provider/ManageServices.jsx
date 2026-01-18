import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiDollarSign,
  FiClock,
  FiMapPin,
  FiPackage,
  FiImage,
  FiCamera,
} from "react-icons/fi";
import { providerAPI, uploadAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImageUpload from "../../components/ImageUpload";

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [serviceImage, setServiceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    location: "",
    availability: true,
  });
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await providerAPI.getCategories();
        setCategories(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await providerAPI.getMyServices(user.id);
        setServices(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchServices();
      fetchCategories();
    }
  }, [user?.id]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getMyServices(user.id);
      setServices(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      // Map backend fields to form fields
      setFormData({
        title: service.name || service.title || "",
        description: service.description || "",
        category: service.category || "",
        price: service.price || "",
        duration: service.duration || "",
        location: service.location || "",
        availability: service.isAvailable ?? service.availability ?? true,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        duration: "",
        location: "",
        availability: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setServiceImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData({
      title: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      location: "",
      availability: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setServiceImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setServiceImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        // For editing, use JSON
        const serviceData = {
          name: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          location: formData.location,
          isAvailable: formData.availability,
        };
        await providerAPI.updateService(
          user.id,
          editingService._id,
          serviceData,
        );
        toast.success("Service updated successfully");
      } else {
        // For creating, use FormData to support image upload
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("price", parseFloat(formData.price));
        formDataToSend.append("duration", parseInt(formData.duration));
        formDataToSend.append("location", formData.location);
        formDataToSend.append("isAvailable", formData.availability);
        if (serviceImage) {
          formDataToSend.append("image", serviceImage);
        }

        await providerAPI.createService(user.id, formDataToSend);
        toast.success("Service created successfully");
      }
      handleCloseModal();
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await providerAPI.deleteService(user.id, serviceId);
      toast.success("Service deleted successfully");
      setDeleteConfirm(null);
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceImageUpload = async (serviceId, file) => {
    setImageLoading((prev) => ({ ...prev, [serviceId]: true }));
    try {
      const response = await uploadAPI.uploadServiceImage(serviceId, file);
      const newImageUrl = response.data?.data?.image;
      if (newImageUrl) {
        setServices((prev) =>
          prev.map((s) =>
            s._id === serviceId ? { ...s, image: newImageUrl } : s,
          ),
        );
        toast.success("Service image updated successfully");
      }
    } catch (error) {
      console.error("Error uploading service image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleServiceImageDelete = async (serviceId) => {
    setImageLoading((prev) => ({ ...prev, [serviceId]: true }));
    try {
      await uploadAPI.deleteServiceImage(serviceId);
      setServices((prev) =>
        prev.map((s) => (s._id === serviceId ? { ...s, image: null } : s)),
      );
      toast.success("Service image removed");
    } catch (error) {
      console.error("Error deleting service image:", error);
      toast.error("Failed to delete image");
    } finally {
      setImageLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Services</h1>
            <p className="text-gray-500 mt-1">Manage your service offerings</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No services yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first service to start receiving bookings
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Service Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiPackage className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.isAvailable
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  {/* Image Upload Button */}
                  <div className="absolute bottom-4 left-4">
                    <ImageUpload
                      currentImage={service.image}
                      onUpload={(file) =>
                        handleServiceImageUpload(service._id, file)
                      }
                      onDelete={() => handleServiceImageDelete(service._id)}
                      type="service"
                      size="sm"
                      shape="rounded"
                      loading={imageLoading[service._id]}
                      showDeleteButton={false}
                    />
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiDollarSign className="w-4 h-4 mr-2" />
                      <span>${service.price}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span>{service.duration} mins</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiMapPin className="w-4 h-4 mr-2" />
                      <span>{service.location || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(service)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(service._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Image Upload - Only for new services */}
                {!editingService && (
                  <div className="flex flex-col items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Service Image (Optional)
                    </label>
                    <div
                      className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Service preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <FiCamera className="text-3xl text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {imagePreview ? "Change photo" : "Add photo"}
                      </button>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., House Cleaning"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your service..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="60"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Service area"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="availability"
                    id="availability"
                    checked={formData.availability}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="availability"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Service is available for booking
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingService ? "Update Service" : "Create Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Service"
          message="Are you sure you want to delete this service? This action cannot be undone."
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </div>
  );
};

export default ManageServices;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiClock,
  FiToggleLeft,
  FiToggleRight,
  FiX,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { providerAPI } from "../../services/api";

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await providerAPI.getMyServices(user.id);
      const data = response.data?.data || response.data;
      setServices(data || []);
    } catch (error) {
      console.error("Error loading services:", error);
      alert(error.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseFloat(formData.duration),
      };

      await providerAPI.createService(user.id, serviceData);
      alert("Service created successfully!");
      setShowAddModal(false);
      setFormData({ name: "", description: "", category: "", price: "", duration: "" });
      loadServices();
    } catch (error) {
      console.error("Error creating service:", error);
      alert(error.response?.data?.message || "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseFloat(formData.duration),
      };

      await providerAPI.updateService(user.id, selectedService._id, serviceData);
      alert("Service updated successfully!");
      setShowEditModal(false);
      setSelectedService(null);
      setFormData({ name: "", description: "", category: "", price: "", duration: "" });
      loadServices();
    } catch (error) {
      console.error("Error updating service:", error);
      alert(error.response?.data?.message || "Failed to update service");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setShowEditModal(true);
  };

  const toggleServiceStatus = async (serviceId) => {
    try {
      await providerAPI.toggleAvailability(user.id, serviceId);
      setServices(
        services.map((s) =>
          s._id === serviceId ? { ...s, isAvailable: !s.isAvailable } : s
        )
      );
    } catch (error) {
      console.error("Error toggling service status:", error);
      alert(error.response?.data?.message || "Failed to toggle service status");
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await providerAPI.deleteService(user.id, serviceId);
        alert("Service deleted successfully!");
        loadServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert(error.response?.data?.message || "Failed to delete service");
      }
    }
  };

  const navLinks = [
    { path: "/provider/dashboard", label: "Dashboard" },
    { path: "/provider/services", label: "My Services" },
    { path: "/provider/requests", label: "Booking Requests" },
    { path: "/provider/earnings", label: "Earnings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar role="provider" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Services</h1>
              <p className="text-gray-400">
                Add, edit, or remove your services
              </p>
            </div>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus />
              <span>Add Service</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service._id}
              className="glass-card p-6 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {service.description}
                  </p>
                </div>
                <motion.button
                  onClick={() => toggleServiceStatus(service._id)}
                  className="ml-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {service.isAvailable ? (
                    <FiToggleRight className="text-3xl text-neon-green" />
                  ) : (
                    <FiToggleLeft className="text-3xl text-gray-500" />
                  )}
                </motion.button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-semibold">{service.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <FiDollarSign className="mr-1" /> Price:
                  </span>
                  <span className="font-bold text-neon-green">
                    ${service.price}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <FiClock className="mr-1" /> Duration:
                  </span>
                  <span>{service.duration}h</span>
                </div>
              </div>

              <div
                className={`text-xs px-3 py-1 rounded-full mb-4 text-center ${
                  service.isAvailable
                    ? "bg-neon-green/20 text-neon-green"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {service.isAvailable ? "Active" : "Inactive"}
              </div>

              <div className="flex space-x-2">
                <motion.button
                  onClick={() => openEditModal(service)}
                  className="flex-1 glass-card p-2 hover:bg-neon-blue/20 transition-colors flex items-center justify-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiEdit className="text-neon-blue" />
                  <span className="text-sm">Edit</span>
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 glass-card p-2 hover:bg-red-500/20 transition-colors flex items-center justify-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTrash2 className="text-red-400" />
                  <span className="text-sm">Delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">No services yet</p>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Service
            </motion.button>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Service</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field w-full h-24 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Moving">Moving</option>
                    <option value="Repair">Repair</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (hours) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      min="0.5"
                      step="0.5"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 glass-card p-3 hover:bg-white/10 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary bg-gradient-to-r from-purple-500 to-pink-500"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Service</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleEditService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field w-full h-24 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Moving">Moving</option>
                    <option value="Repair">Repair</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (hours) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      min="0.5"
                      step="0.5"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 glass-card p-3 hover:bg-white/10 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary bg-gradient-to-r from-purple-500 to-pink-500"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageServices;

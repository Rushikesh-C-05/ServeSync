import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiDollarSign,
  FiEdit,
  FiEye,
  FiSearch,
  FiTrash2,
  FiPackage,
  FiMapPin,
  FiTag,
  FiImage,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImageUpload from "../../components/ImageUpload";
import { adminAPI, uploadAPI } from "../../services/api";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageLoading, setImageLoading] = useState({});
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    pricingType: "fixed",
    location: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await adminAPI.getAllServices();
      const data = response.data?.data || response.data || [];
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await adminAPI.deleteService(serviceId);
      setServices(services.filter((s) => s._id !== serviceId));
      toast.success("Service deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setEditForm({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price || 0,
      pricingType: service.pricingType || "fixed",
      location: service.location || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateService(editingService._id, editForm);
      setShowEditModal(false);
      await loadServices();
      toast.success("Service updated successfully");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.message || "Failed to update service");
    }
  };

  const handleAdminImageUpload = async (serviceId, file) => {
    setImageLoading((prev) => ({ ...prev, [serviceId]: true }));
    try {
      const response = await uploadAPI.adminUploadServiceImage(serviceId, file);
      const newImageUrl = response.data?.data?.image;
      if (newImageUrl) {
        setServices((prev) =>
          prev.map((s) =>
            s._id === serviceId ? { ...s, image: newImageUrl } : s,
          ),
        );
        if (selectedService?._id === serviceId) {
          setSelectedService((prev) => ({ ...prev, image: newImageUrl }));
        }
        toast.success("Service image updated successfully");
      }
    } catch (error) {
      console.error("Error uploading service image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerId?.businessName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map((s) => s.category))];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Services</h1>
          <p className="text-gray-500">
            Monitor and manage all services on the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Services</p>
                <p className="text-3xl font-bold text-blue-600">
                  {services.length}
                </p>
              </div>
              <FiPackage className="text-4xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {categories.length}
                </p>
              </div>
              <FiTag className="text-4xl text-indigo-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Price</p>
                <p className="text-3xl font-bold text-green-600">
                  $
                  {services.length > 0
                    ? (
                        services.reduce((sum, s) => sum + (s.price || 0), 0) /
                        services.length
                      ).toFixed(2)
                    : 0}
                </p>
              </div>
              <FiDollarSign className="text-4xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services by title, description, or provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            Services ({filteredServices.length})
          </h2>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No services found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr
                      key={service._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiPackage className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {service.title || service.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">
                            {service.providerId?.businessName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {service.providerId?.userId?.name || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-green-600">
                          ${service.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.pricingType}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMapPin className="mr-1" />
                          {service.location || "Not specified"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(service)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FiEye className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <FiEdit className="text-green-600" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(service._id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Service Details Modal */}
        {showModal && selectedService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Service Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Service Image with Upload */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Service Image</p>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {selectedService.image ? (
                      <img
                        src={selectedService.image}
                        alt={selectedService.title || selectedService.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiPackage className="text-gray-400" size={32} />
                    )}
                  </div>
                  <ImageUpload
                    currentImage={selectedService.image}
                    onUpload={(file) =>
                      handleAdminImageUpload(selectedService._id, file)
                    }
                    type="service"
                    size="md"
                    shape="rounded"
                    loading={imageLoading[selectedService._id]}
                    showDeleteButton={false}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="text-lg font-semibold">
                    {selectedService.title || selectedService.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{selectedService.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-gray-700">{selectedService.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-gray-700">
                      ${selectedService.price} ({selectedService.pricingType})
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-700">
                    {selectedService.location || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="text-gray-700">
                    {selectedService.providerId?.businessName} (
                    {selectedService.providerId?.userId?.name})
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service ID</p>
                  <p className="text-xs text-gray-400">{selectedService._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-700">
                    {new Date(selectedService.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleEdit(selectedService);
                  }}
                  className="flex-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                >
                  Edit Service
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleDelete(selectedService._id);
                  }}
                  className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-lg transition-colors"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Service Modal */}
        {showEditModal && editingService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Service</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pricing Type
                    </label>
                    <select
                      value={editForm.pricingType}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          pricingType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="hourly">Hourly</option>
                      <option value="per_project">Per Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Service"
          message="Are you sure you want to delete this service? This will also delete all related bookings, payments, and reviews."
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default ManageServices;

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
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await adminAPI.deleteService(serviceId);
      setServices(services.filter((s) => s.id !== serviceId));
      toast.success("Service deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
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
      await adminAPI.updateService(editingService.id, editForm);
      setShowEditModal(false);
      await loadServices();
      toast.success("Service updated successfully");
    } catch (error) {
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
            s.id === serviceId ? { ...s, image: newImageUrl } : s,
          ),
        );
        if (selectedService?.id === serviceId) {
          setSelectedService((prev) => ({ ...prev, image: newImageUrl }));
        }
        toast.success("Service image updated successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setImageLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider?.businessName
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
              <Input
                type="text"
                placeholder="Search services by title, description, or provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {service.provider?.businessName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {service.provider?.user?.name || "Unknown"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600">
                          {service.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-green-600">
                          ${service.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.pricingType}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMapPin className="mr-1" />
                          {service.location || "Not specified"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleViewDetails(service)}
                            variant="ghost"
                            size="icon"
                          >
                            <FiEye className="text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(service)}
                            variant="ghost"
                            size="icon"
                          >
                            <FiEdit className="text-green-600" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(service.id)}
                            variant="ghost"
                            size="icon"
                          >
                            <FiTrash2 className="text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                      handleAdminImageUpload(selectedService.id, file)
                    }
                    type="service"
                    size="md"
                    shape="rounded"
                    loading={imageLoading[selectedService.id]}
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
                    {selectedService.provider?.businessName} (
                    {selectedService.provider?.user?.name})
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service ID</p>
                  <p className="text-xs text-gray-400">{selectedService.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-700">
                    {new Date(selectedService.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    handleEdit(selectedService);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Service
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    handleDelete(selectedService.id);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  Delete Service
                </Button>
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
                  <Input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Category
                    </label>
                    <Input
                      type="text"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Price ($)
                    </label>
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pricing Type
                    </label>
                    <Select
                      value={editForm.pricingType}
                      onValueChange={(value) =>
                        setEditForm({
                          ...editForm,
                          pricingType: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="per_project">Per Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Location
                    </label>
                    <Input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="admin"
                  className="flex-1"
                >
                  Save Changes
                </Button>
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

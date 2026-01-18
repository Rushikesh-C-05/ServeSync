import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiEdit,
  FiMail,
  FiPhone,
  FiSearch,
  FiStar,
  FiTrash2,
  FiXCircle,
  FiUser,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import { adminAPI } from "../../services/api";

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [rejectConfirm, setRejectConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editForm, setEditForm] = useState({
    businessName: "",
    description: "",
    category: "",
    experience: 0,
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await adminAPI.getAllProviders();
      const data = response.data?.data || response.data || [];

      const formattedProviders = data.map((provider) => ({
        _id: provider._id,
        name: provider.userId?.name || "Unknown",
        email: provider.userId?.email || "N/A",
        phone: provider.userId?.phone || "N/A",
        profileImage:
          provider.profileImage || provider.userId?.profileImage || null,
        businessName: provider.businessName,
        status: provider.status,
        rating: provider.rating || 0,
        services: 0,
        bookings: 0,
        createdAt: provider.createdAt,
      }));

      setProviders(formattedProviders);
    } catch (error) {
      console.error("Error loading providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId) => {
    try {
      await adminAPI.approveProvider(providerId);
      toast.success("Provider approved successfully");
      await loadProviders();
    } catch (error) {
      console.error("Error approving provider:", error);
      toast.error("Failed to approve provider");
    }
  };

  const handleReject = async (providerId) => {
    try {
      await adminAPI.rejectProvider(providerId);
      toast.success("Provider rejected");
      setRejectConfirm(null);
      await loadProviders();
    } catch (error) {
      console.error("Error rejecting provider:", error);
      toast.error("Failed to reject provider");
    }
  };

  const handleEdit = async (provider) => {
    const response = await adminAPI.getAllProviders();
    const fullData = response.data?.data || response.data || [];
    const fullProvider = fullData.find((p) => p._id === provider._id);

    setEditingProvider(fullProvider);
    setEditForm({
      businessName: fullProvider.businessName || "",
      description: fullProvider.description || "",
      category: fullProvider.category || "",
      experience: fullProvider.experience || 0,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateProvider(editingProvider._id, editForm);
      setShowEditModal(false);
      await loadProviders();
      toast.success("Provider updated successfully");
    } catch (error) {
      console.error("Error updating provider:", error);
      toast.error(error.response?.data?.message || "Failed to update provider");
    }
  };

  const handleDelete = async (providerId) => {
    try {
      await adminAPI.deleteProvider(providerId);
      setProviders(providers.filter((p) => p._id !== providerId));
      toast.success("Provider deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting provider:", error);
      toast.error("Failed to delete provider");
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.businessName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && provider.status === "approved") ||
      (filter === "pending" && provider.status === "pending");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Providers</h1>
          <p className="text-gray-500">
            Approve, monitor, and manage service providers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "active", "pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Providers List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Providers ({filteredProviders.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      {/* Provider Profile Image */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={provider.businessName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-gray-400" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold">
                            {provider.businessName}
                          </h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              provider.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : provider.status === "pending"
                                  ? "bg-orange-100 text-orange-500"
                                  : "bg-red-100 text-red-500"
                            }`}
                          >
                            {provider.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{provider.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500 mb-3 ml-16">
                      <div className="flex items-center space-x-2">
                        <FiMail className="text-blue-600" />
                        <span>{provider.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiPhone className="text-green-600" />
                        <span>{provider.phone}</span>
                      </div>
                      {provider.status === "approved" &&
                        provider.rating > 0 && (
                          <div className="flex items-center space-x-2">
                            <FiStar className="text-yellow-500" />
                            <span>Rating: {provider.rating}/5</span>
                          </div>
                        )}
                    </div>

                    <div className="text-xs text-gray-500 ml-16">
                      Joined:{" "}
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {provider.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(provider._id)}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <FiCheckCircle className="text-green-600" />
                        </button>
                        <button
                          onClick={() => setRejectConfirm(provider._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <FiXCircle className="text-red-500" />
                        </button>
                      </>
                    )}
                    {provider.status === "approved" && (
                      <>
                        <button
                          onClick={() => handleEdit(provider)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(provider._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No providers found matching your criteria.
            </p>
          )}
        </div>

        {/* Edit Provider Modal */}
        {showEditModal && editingProvider && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Provider</h2>
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
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={editForm.businessName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, businessName: e.target.value })
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
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={editForm.experience}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        experience: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
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
          isOpen={!!rejectConfirm}
          onClose={() => setRejectConfirm(null)}
          onConfirm={() => handleReject(rejectConfirm)}
          title="Reject Provider"
          message="Are you sure you want to reject this provider?"
          confirmText="Reject"
          confirmStyle="danger"
        />

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Provider"
          message="Are you sure you want to delete this provider? This action cannot be undone and will delete all associated services and bookings."
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default ManageProviders;

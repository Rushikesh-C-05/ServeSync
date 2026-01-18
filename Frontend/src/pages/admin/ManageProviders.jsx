import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiStar,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";
import { adminAPI } from "../../services/api";

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, pending
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      // Fetch providers from backend
      const response = await adminAPI.getAllProviders();
      const data = response.data?.data || response.data || [];

      // Format the provider data
      const formattedProviders = data.map((provider) => ({
        _id: provider._id,
        name: provider.userId?.name || "Unknown",
        email: provider.userId?.email || "N/A",
        phone: provider.userId?.phone || "N/A",
        businessName: provider.businessName,
        status: provider.status,
        rating: provider.rating || 0,
        services: 0, // Will be calculated from services
        bookings: 0, // Will be calculated from bookings
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
      // Reload providers to reflect changes
      await loadProviders();
    } catch (error) {
      console.error("Error approving provider:", error);
      alert("Failed to approve provider");
    }
  };

  const handleReject = async (providerId) => {
    if (window.confirm("Are you sure you want to reject this provider?")) {
      try {
        await adminAPI.rejectProvider(providerId);
        // Reload providers to reflect changes
        await loadProviders();
      } catch (error) {
        console.error("Error rejecting provider:", error);
        alert("Failed to reject provider");
      }
    }
  };

  const handleDelete = async (providerId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this provider? This action cannot be undone and will delete all associated services and bookings.",
      )
    ) {
      try {
        await adminAPI.deleteProvider(providerId);
        // Remove from local state
        setProviders(providers.filter((p) => p._id !== providerId));
      } catch (error) {
        console.error("Error deleting provider:", error);
        alert("Failed to delete provider");
      }
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

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Manage Users" },
    { path: "/admin/providers", label: "Manage Providers" },
    { path: "/admin/stats", label: "Platform Stats" },
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
      <Navbar role="admin" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Manage Providers</h1>
          <p className="text-gray-400">
            Approve, monitor, and manage service providers
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "active", "pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    filter === f
                      ? "bg-neon-blue text-white"
                      : "glass-card hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Providers List */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Providers ({filteredProviders.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider._id}
                className="glass-card p-6 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold">
                        {provider.businessName}
                      </h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          provider.status === "approved"
                            ? "bg-neon-green/20 text-neon-green"
                            : provider.status === "pending"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {provider.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiMail className="text-neon-blue" />
                        <span>{provider.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiPhone className="text-neon-green" />
                        <span>{provider.phone}</span>
                      </div>
                      {provider.status === "approved" &&
                        provider.rating > 0 && (
                          <>
                            <div className="flex items-center space-x-2">
                              <FiStar className="text-yellow-500" />
                              <span>Rating: {provider.rating}/5</span>
                            </div>
                          </>
                        )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Joined:{" "}
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {provider.status === "pending" && (
                      <>
                        <motion.button
                          onClick={() => handleApprove(provider._id)}
                          className="p-2 hover:bg-neon-green/20 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Approve"
                        >
                          <FiCheckCircle className="text-neon-green" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleReject(provider._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Reject"
                        >
                          <FiXCircle className="text-red-400" />
                        </motion.button>
                      </>
                    )}
                    {provider.status === "approved" && (
                      <>
                        <motion.button
                          onClick={() => handleDelete(provider._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete"
                        >
                          <FiTrash2 className="text-red-400" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              No providers found matching your criteria.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageProviders;

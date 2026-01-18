import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";
import { adminAPI } from "../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Fetch users from backend
      const response = await adminAPI.getAllUsers();
      const data = response.data?.data || response.data || [];

      // Filter only regular users (not providers)
      const regularUsers = data.filter((u) => u.role === "user");
      setUsers(regularUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      await adminAPI.toggleBlockUser(userId);
      // Reload users to reflect changes
      await loadUsers();
    } catch (error) {
      console.error("Error toggling user block:", error);
      alert("Failed to update user status");
    }
  };

  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone and will delete all associated bookings and reviews.",
      )
    ) {
      try {
        await adminAPI.deleteUser(userId);
        // Remove from local state
        setUsers(users.filter((u) => u._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
          <p className="text-gray-400">View and manage all platform users</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Users ({filteredUsers.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                className="glass-card p-6 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          user.isBlocked
                            ? "bg-red-500/20 text-red-400"
                            : "bg-neon-green/20 text-neon-green"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <FiMail className="text-neon-blue" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiPhone className="text-neon-green" />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="text-neon-purple" />
                        <span>{user.address || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        {user.isBlocked ? "Blocked" : "Active"}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleToggleBlock(user._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBlocked
                          ? "hover:bg-neon-green/20"
                          : "hover:bg-orange-500/20"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                    >
                      {user.isBlocked ? (
                        <FiUnlock className="text-neon-green" />
                      ) : (
                        <FiLock className="text-orange-400" />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 className="text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              No users found matching your search.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageUsers;

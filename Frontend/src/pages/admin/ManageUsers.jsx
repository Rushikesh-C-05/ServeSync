import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiUnlock,
  FiUserCheck,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { adminAPI } from "../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      const data = response.data?.data || response.data || [];
      setUsers(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      await adminAPI.toggleBlockUser(userId);
      toast.success("User status updated");
      await loadUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateUser(editingUser.id, editForm);
      setShowEditModal(false);
      await loadUsers();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleResetRejection = async (userId) => {
    try {
      await adminAPI.resetProviderRejection(userId);
      await loadUsers();
      toast.success("User can now reapply for provider status");
      setResetConfirm(null);
    } catch (error) {
      toast.error("Failed to reset rejection status");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
          <p className="text-gray-500">View and manage all platform users</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Users ({filteredUsers.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      {/* User Profile Image */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-gray-400" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold">{user.name}</h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              user.isBlocked
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                          {user.role === "provider" && (
                            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600">
                              Provider
                            </span>
                          )}
                          {user.providerRejected && (
                            <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600">
                              Application Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500 ml-16">
                      <div className="flex items-center space-x-2">
                        <FiMail className="text-blue-600" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiPhone className="text-green-600" />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="text-indigo-600" />
                        <span>{user.address || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Role:</span> {user.role}
                      </div>
                    </div>

                    {user.providerRejected && user.providerRejectionReason && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        <FiAlertCircle className="inline mr-2" />
                        Rejection Reason: {user.providerRejectionReason}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {user.providerRejected && !user.canReapply && (
                      <button
                        onClick={() => setResetConfirm(user.id)}
                        className="p-2 rounded-lg transition-colors hover:bg-green-100"
                        title="Allow Reapplication"
                      >
                        <FiUserCheck className="text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleBlock(user.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBlocked
                          ? "hover:bg-green-100"
                          : "hover:bg-orange-100"
                      }`}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                    >
                      {user.isBlocked ? (
                        <FiUnlock className="text-green-600" />
                      ) : (
                        <FiLock className="text-orange-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <FiEdit className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No users found matching your search.
            </p>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit User</h2>
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
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
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone and will delete all associated bookings and reviews."
          confirmText="Delete"
          confirmStyle="danger"
        />

        <ConfirmDialog
          isOpen={!!resetConfirm}
          onClose={() => setResetConfirm(null)}
          onConfirm={() => handleResetRejection(resetConfirm)}
          title="Allow Reapplication"
          message="Are you sure you want to allow this user to reapply for provider status?"
          confirmText="Allow"
          confirmStyle="primary"
        />
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;

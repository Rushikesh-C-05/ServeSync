import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Add category state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Edit category state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await adminAPI.addCategory(newCategory.trim());
      if (response.data.success) {
        setCategories(response.data.data);
        setNewCategory("");
        setShowAddForm(false);
        showSuccess("Category added successfully");
      }
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleUpdateCategory = async (oldCategory) => {
    if (!editValue.trim() || editValue === oldCategory) {
      setEditingCategory(null);
      return;
    }

    try {
      const response = await adminAPI.updateCategory(
        oldCategory,
        editValue.trim(),
      );
      if (response.data.success) {
        setCategories(response.data.data);
        setEditingCategory(null);
        setEditValue("");
        showSuccess("Category updated successfully");
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (category) => {
    if (
      !confirm(
        `Are you sure you want to delete "${category}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await adminAPI.deleteCategory(category);
      if (response.data.success) {
        setCategories(response.data.data);
        showSuccess("Category deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Manage Users" },
    { path: "/admin/providers", label: "Manage Providers" },
    { path: "/admin/categories", label: "Manage Categories" },
    { path: "/admin/stats", label: "Platform Stats" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navbar role="admin" links={navLinks} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar role="admin" links={navLinks} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FiTag className="text-orange-500" />
                Manage Categories
              </h1>
              <p className="text-gray-400">
                Add, edit, or remove service categories
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              {showAddForm ? <FiX /> : <FiPlus />}
              {showAddForm ? "Cancel" : "Add Category"}
            </motion.button>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 flex items-center gap-2"
            >
              <FiAlertCircle />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-2"
          >
            <FiAlertCircle />
            {error}
          </motion.div>
        )}

        {/* Add Category Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCategory}
              className="mb-6 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Add New Category
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newCategory.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Add
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:border-orange-500/50 transition-all group"
              >
                {editingCategory === category ? (
                  // Edit Mode
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateCategory(category);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateCategory(category)}
                        className="flex-1 px-3 py-2 bg-green-500/20 border border-green-500/50 text-green-300 rounded hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <FiSave size={16} />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-2 bg-gray-500/20 border border-gray-500/50 text-gray-300 rounded hover:bg-gray-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <FiX size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <FiTag className="text-orange-400" size={20} />
                      </div>
                      <span className="text-white font-medium">{category}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded hover:bg-blue-500/30 transition-all"
                        title="Edit category"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded hover:bg-red-500/30 transition-all"
                        title="Delete category"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiTag className="mx-auto text-6xl text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No categories yet</p>
            <p className="text-gray-500 text-sm">
              Click "Add Category" to create your first category
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Categories</p>
              <p className="text-3xl font-bold text-white">
                {categories.length}
              </p>
            </div>
            <FiTag className="text-5xl text-orange-500/50" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageCategories;

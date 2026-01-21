import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import { adminAPI } from "../../services/api";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");

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
      
      toast.error("Failed to load categories");
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
        toast.success("Category added successfully");
      }
    } catch (err) {
      
      toast.error(err.response?.data?.message || "Failed to add category");
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
        toast.success("Category updated successfully");
      }
    } catch (err) {
      
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const response = await adminAPI.deleteCategory(category);
      if (response.data.success) {
        setCategories(response.data.data);
        toast.success("Category deleted successfully");
        setDeleteConfirm(null);
      }
    } catch (err) {
      
      toast.error(err.response?.data?.message || "Failed to delete category");
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <FiTag className="text-orange-500" />
                Manage Categories
              </h1>
              <p className="text-gray-500">
                Add, edit, or remove service categories
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg transition-all"
            >
              {showAddForm ? <FiX /> : <FiPlus />}
              {showAddForm ? "Cancel" : "Add Category"}
            </button>
          </div>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddCategory}
            className="mb-6 p-6 bg-white border border-gray-200 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Category
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newCategory.trim()}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="p-5 bg-white border border-gray-200 rounded-lg hover:border-orange-400 transition-all group"
            >
              {editingCategory === category ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateCategory(category);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCategory(category)}
                      className="flex-1 px-3 py-2 bg-green-100 border border-green-300 text-green-600 rounded hover:bg-green-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FiSave size={16} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FiTag className="text-orange-500" size={20} />
                    </div>
                    <span className="text-gray-700 font-medium">{category}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 bg-blue-100 border border-blue-300 text-blue-600 rounded hover:bg-blue-200 transition-all"
                      title="Edit category"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category)}
                      className="p-2 bg-red-100 border border-red-300 text-red-600 rounded hover:bg-red-200 transition-all"
                      title="Delete category"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <FiTag className="mx-auto text-6xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No categories yet</p>
            <p className="text-gray-400 text-sm">
              Click "Add Category" to create your first category
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Categories</p>
              <p className="text-3xl font-bold text-gray-800">
                {categories.length}
              </p>
            </div>
            <FiTag className="text-5xl text-orange-300" />
          </div>
        </div>

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteCategory(deleteConfirm)}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteConfirm}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default ManageCategories;

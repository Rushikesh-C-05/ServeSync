import { useEffect, useState } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

const AdminDashboard = () => {
  useAuth(); // Verify admin authentication
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch dashboard stats from backend
      const response = await adminAPI.getDashboardStats();
      const data = response.data?.data || response.data;

      setStats({
        totalUsers: data.totalUsers || 0,
        totalProviders: data.totalProviders || 0,
        totalServices: data.totalServices || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: parseFloat(data.totalRevenue) || 0,
        activeBookings: data.activeBookings || 0,
        pendingApprovals: data.pendingApprovals || 0,
      });

      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 border-l-4 border-l-slate-700">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Dashboard 👨‍💼
          </h1>
          <p className="text-gray-500">
            Monitor and manage the entire platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.totalUsers || 0}
            color="blue"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Providers"
            value={stats?.totalProviders || 0}
            color="purple"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Bookings"
            value={stats?.totalBookings || 0}
            color="green"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
            color="green"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="blue"
          />
          <StatCard
            icon={FiAlertCircle}
            label="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            color="amber"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiUsers className="text-2xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">View and manage all users</p>
            </button>

            <button
              onClick={() => navigate("/admin/providers")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiShoppingBag className="text-2xl text-indigo-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Providers</h3>
              <p className="text-sm text-gray-500">
                Approve and monitor providers
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/applications")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiAlertCircle className="text-2xl text-amber-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Applications</h3>
              <p className="text-sm text-gray-500">
                Review provider applications
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/categories")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiSettings className="text-2xl text-slate-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-500">
                Add, edit, or remove categories
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {activity.type === "user" && (
                        <FiUsers className="text-blue-600" />
                      )}
                      {activity.type === "provider" && (
                        <FiShoppingBag className="text-indigo-600" />
                      )}
                      {activity.type === "booking" && (
                        <FiCheckCircle className="text-green-600" />
                      )}
                      {activity.type === "payment" && (
                        <FiDollarSign className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.name}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

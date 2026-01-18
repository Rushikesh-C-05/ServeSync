import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";

const AdminDashboard = () => {
  const { user } = useAuth();
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

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Manage Users" },
    { path: "/admin/providers", label: "Manage Providers" },
    { path: "/admin/categories", label: "Manage Categories" },
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
        {/* Welcome Banner */}
        <motion.div
          className="glass-card p-8 mb-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-l-4 border-orange-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
          <p className="text-gray-400">
            Monitor and manage the entire platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.totalUsers || 0}
            color="neon-blue"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Providers"
            value={stats?.totalProviders || 0}
            color="neon-purple"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Bookings"
            value={stats?.totalBookings || 0}
            color="neon-green"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
            color="neon-green"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="neon-blue"
          />
          <StatCard
            icon={FiAlertCircle}
            label="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            color="orange-500"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button
              onClick={() => navigate("/admin/users")}
              className="glass-card p-4 hover:bg-neon-blue/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUsers className="text-3xl text-neon-blue mb-2" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-400">View and manage all users</p>
            </motion.button>

            <motion.button
              onClick={() => navigate("/admin/providers")}
              className="glass-card p-4 hover:bg-neon-purple/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiShoppingBag className="text-3xl text-neon-purple mb-2" />
              <h3 className="font-semibold">Manage Providers</h3>
              <p className="text-sm text-gray-400">
                Approve and monitor providers
              </p>
            </motion.button>

            <motion.button
              onClick={() => navigate("/admin/categories")}
              className="glass-card p-4 hover:bg-orange-500/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSettings className="text-3xl text-orange-500 mb-2" />
              <h3 className="font-semibold">Manage Categories</h3>
              <p className="text-sm text-gray-400">
                Add, edit, or remove categories
              </p>
            </motion.button>

            <motion.button
              onClick={() => navigate("/admin/stats")}
              className="glass-card p-4 hover:bg-neon-green/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiTrendingUp className="text-3xl text-neon-green mb-2" />
              <h3 className="font-semibold">Platform Stats</h3>
              <p className="text-sm text-gray-400">View detailed analytics</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="glass-card p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                      {activity.type === "user" && (
                        <FiUsers className="text-neon-blue" />
                      )}
                      {activity.type === "provider" && (
                        <FiShoppingBag className="text-neon-purple" />
                      )}
                      {activity.type === "booking" && (
                        <FiCheckCircle className="text-neon-green" />
                      )}
                      {activity.type === "payment" && (
                        <FiDollarSign className="text-neon-green" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{activity.action}</p>
                      <p className="text-sm text-gray-400">{activity.name}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

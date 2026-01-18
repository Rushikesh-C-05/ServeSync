import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import ServiceCard from "../../components/ServiceCard";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { serviceAPI, userAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch dashboard stats from backend
      const response = await userAPI.getDashboardStats(user.id);
      const data = response.data?.data || response.data;

      setStats({
        activeBookings: data.activeBookings || 0,
        completedBookings: data.completedBookings || 0,
        totalSpent: data.totalSpent || "0.00",
      });

      setServices(data.featuredServices || []);
      setBookings(data.recentBookings || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: "/user/dashboard", label: "Dashboard" },
    { path: "/user/services", label: "Browse Services" },
    { path: "/user/bookings", label: "My Bookings" },
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
      <Navbar role="user" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          className="glass-card p-8 mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-l-4 border-neon-blue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">Ready to book your next service?</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiShoppingBag}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="neon-blue"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Completed"
            value={stats?.completedBookings || 0}
            color="neon-green"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Spent"
            value={`$${stats?.totalSpent || 0}`}
            color="neon-purple"
          />
        </div>

        {/* Become a Provider CTA */}
        {user?.role === "user" && (
          <motion.div
            className="glass-card p-8 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-neon-purple overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                  <FiBriefcase className="text-4xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Become a Service Provider
                  </h3>
                  <p className="text-gray-400">
                    Start earning by offering your services to thousands of
                    customers
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/user/become-provider")}
                className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500 flex items-center space-x-2 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <FiArrowRight />
              </motion.button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          </motion.div>
        )}

        {/* Recent Bookings */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <button
              onClick={() => navigate("/user/bookings")}
              className="text-neon-blue hover:text-neon-purple transition-colors text-sm"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="glass-card p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {booking.serviceId?.name || "Service"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        <FiClock className="inline mr-1" />
                        {new Date(
                          booking.bookingDate,
                        ).toLocaleDateString()} at {booking.bookingTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={booking.status} />
                      <p className="text-lg font-bold text-neon-green mt-2">
                        ${booking.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No bookings yet</p>
            )}
          </div>
        </motion.div>

        {/* Featured Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Services</h2>
            <button
              onClick={() => navigate("/user/services")}
              className="text-neon-blue hover:text-neon-purple transition-colors text-sm"
            >
              Browse All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onClick={() => navigate(`/user/booking/${service._id}`)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;

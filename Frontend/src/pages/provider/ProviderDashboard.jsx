import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { providerAPI } from "../../services/api";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch dashboard stats from backend
      const response = await providerAPI.getDashboardStats(user.id);
      const data = response.data?.data || response.data;

      setStats({
        totalServices: data.totalServices || 0,
        activeBookings: data.activeBookings || 0,
        completedBookings: data.completedBookings || 0,
        totalEarnings: parseFloat(data.totalEarnings) || 0,
        rating: data.rating || 0,
        pendingRequests: data.pendingRequests || 0,
      });

      // Format bookings data
      const formattedBookings = (data.recentBookings || []).map((booking) => ({
        _id: booking._id,
        serviceName: booking.serviceId?.name || "Service",
        customerName: booking.userId?.name || "Customer",
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        status: booking.status,
        totalAmount: booking.totalAmount || 0,
      }));

      setBookings(formattedBookings);
      setServices(data.services || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: "/provider/dashboard", label: "Dashboard" },
    { path: "/provider/services", label: "My Services" },
    { path: "/provider/requests", label: "Booking Requests" },
    { path: "/provider/earnings", label: "Earnings" },
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
      <Navbar role="provider" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          className="glass-card p-8 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-neon-purple"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 🛠️
          </h1>
          <p className="text-gray-400">Manage your services and bookings</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiShoppingBag}
            label="Total Services"
            value={stats?.totalServices || 0}
            color="neon-purple"
          />
          <StatCard
            icon={FiClock}
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
            label="Total Earnings"
            value={`$${stats?.totalEarnings?.toLocaleString() || 0}`}
            color="neon-green"
          />
          <StatCard
            icon={FiStar}
            label="Rating"
            value={`${stats?.rating || 0} ⭐`}
            color="yellow-500"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Pending Requests"
            value={stats?.pendingRequests || 0}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              onClick={() => navigate("/provider/services")}
              className="glass-card p-4 hover:bg-neon-purple/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiShoppingBag className="text-3xl text-neon-purple mb-2" />
              <h3 className="font-semibold">Manage Services</h3>
              <p className="text-sm text-gray-400">Add or edit your services</p>
            </motion.button>

            <motion.button
              onClick={() => navigate("/provider/requests")}
              className="glass-card p-4 hover:bg-neon-blue/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiClock className="text-3xl text-neon-blue mb-2" />
              <h3 className="font-semibold">View Requests</h3>
              <p className="text-sm text-gray-400">
                {stats?.pendingRequests || 0} pending requests
              </p>
            </motion.button>

            <motion.button
              onClick={() => navigate("/provider/earnings")}
              className="glass-card p-4 hover:bg-neon-green/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiDollarSign className="text-3xl text-neon-green mb-2" />
              <h3 className="font-semibold">View Earnings</h3>
              <p className="text-sm text-gray-400">Track your revenue</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <button
              onClick={() => navigate("/provider/requests")}
              className="text-neon-purple hover:text-neon-blue transition-colors text-sm"
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
                        {booking.serviceName}
                      </h3>
                      <p className="text-sm text-gray-400 mb-1">
                        Customer: {booking.customerName}
                      </p>
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
                        ${booking.totalAmount.toFixed(2)}
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

        {/* My Services */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Services</h2>
            <button
              onClick={() => navigate("/provider/services")}
              className="text-neon-purple hover:text-neon-blue transition-colors text-sm"
            >
              Manage All →
            </button>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="glass-card p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-400">
                      {service.bookings} total bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-neon-green">
                      ${service.price}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        service.status === "active"
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiX,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await userAPI.getMyBookings(user.id);
      const data = response.data?.data || response.data || [];
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await userAPI.cancelBooking(user.id, bookingId);
      alert("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-400 mb-8">Manage your service bookings</p>

          {/* Filter Tabs */}
          <div className="glass-card p-4 mb-6">
            <div className="flex space-x-2 overflow-x-auto">
              {["all", "pending", "accepted", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      filter === status
                        ? "bg-neon-blue text-white"
                        : "bg-dark-card text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  className="glass-card p-6 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {booking.serviceId?.name || "Service"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Provider:{" "}
                            {booking.providerId?.businessName || "N/A"}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-300">
                          <FiCalendar className="mr-2 text-neon-blue" />
                          <span>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <FiClock className="mr-2 text-neon-blue" />
                          <span>{booking.bookingTime}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <FiMapPin className="mr-2 text-neon-blue" />
                          <span className="truncate">
                            {booking.userAddress}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <FiDollarSign className="mr-2 text-neon-green" />
                          <span className="font-bold text-neon-green">
                            ${booking.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-dark-card rounded-lg">
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold">Notes:</span>{" "}
                            {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn-secondary flex items-center justify-center gap-2"
                        >
                          <FiX />
                          Cancel
                        </button>
                      )}
                      {booking.status === "completed" && (
                        <button
                          onClick={() =>
                            navigate(`/user/review/${booking._id}`)
                          }
                          className="btn-primary"
                        >
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400 text-lg mb-4">
                  {filter === "all"
                    ? "No bookings found"
                    : `No ${filter} bookings`}
                </p>
                <button
                  onClick={() => navigate("/user/services")}
                  className="btn-primary"
                >
                  Browse Services
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookings;

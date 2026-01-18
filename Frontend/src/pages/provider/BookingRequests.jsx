import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { providerAPI } from "../../services/api";

const BookingRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, accepted, completed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await providerAPI.getBookingRequests(user.id);
      const data = response.data?.data || response.data;
      
      // Format bookings data
      const formattedBookings = (data || []).map((booking) => ({
        _id: booking._id,
        serviceName: booking.serviceId?.name || "Service",
        customerName: booking.userId?.name || "Customer",
        customerPhone: booking.userId?.phone || "N/A",
        customerAddress: booking.address || "N/A",
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        status: booking.status,
        totalAmount: booking.totalAmount || 0,
        notes: booking.notes || "",
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      alert(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await providerAPI.acceptBooking(user.id, bookingId);
      alert("Booking accepted successfully!");
      loadBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert(error.response?.data?.message || "Failed to accept booking");
    }
  };

  const handleReject = async (bookingId) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        await providerAPI.rejectBooking(user.id, bookingId);
        alert("Booking rejected successfully!");
        loadBookings();
      } catch (error) {
        console.error("Error rejecting booking:", error);
        alert(error.response?.data?.message || "Failed to reject booking");
      }
    }
  };

  const handleComplete = async (bookingId) => {
    if (window.confirm("Mark this booking as completed?")) {
      try {
        await providerAPI.completeBooking(user.id, bookingId);
        alert("Booking marked as completed!");
        loadBookings();
      } catch (error) {
        console.error("Error completing booking:", error);
        alert(error.response?.data?.message || "Failed to complete booking");
      }
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter,
  );

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
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Booking Requests</h1>
          <p className="text-gray-400">Manage your booking requests</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex space-x-2 overflow-x-auto">
            {["all", "pending", "accepted", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors whitespace-nowrap ${
                  filter === f
                    ? "bg-neon-purple text-white"
                    : "glass-card hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="glass-card p-6 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold">
                      {booking.serviceName}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FiUser className="text-neon-blue" />
                      <span>{booking.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FiPhone className="text-neon-green" />
                      <span>{booking.customerPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FiMapPin className="text-neon-purple" />
                      <span>{booking.customerAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FiClock className="text-orange-500" />
                      <span>
                        {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                        {booking.bookingTime}
                      </span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="glass-card p-3 mt-3">
                      <p className="text-sm text-gray-400">Notes:</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neon-green">
                      ${booking.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleAccept(booking._id)}
                        className="glass-card px-4 py-2 hover:bg-neon-green/20 transition-colors flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiCheckCircle className="text-neon-green" />
                        <span>Accept</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleReject(booking._id)}
                        className="glass-card px-4 py-2 hover:bg-red-500/20 transition-colors flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiXCircle className="text-red-400" />
                        <span>Reject</span>
                      </motion.button>
                    </div>
                  )}

                  {booking.status === "accepted" && (
                    <motion.button
                      onClick={() => handleComplete(booking._id)}
                      className="glass-card px-4 py-2 hover:bg-neon-blue/20 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiCheckCircle className="text-neon-blue" />
                      <span>Mark Complete</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400">
              No {filter !== "all" && filter} bookings found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequests;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiClock,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiX,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelConfirm, setCancelConfirm] = useState(null);

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
    try {
      await userAPI.cancelBooking(user.id, bookingId);
      toast.success("Booking cancelled successfully");
      setCancelConfirm(null);
      loadBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500 mb-8">Manage your service bookings</p>

          {/* Filter Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex space-x-2 overflow-x-auto">
              {["all", "pending", "accepted", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                <div
                  key={booking._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {booking.serviceId?.name || "Service"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Provider:{" "}
                            {booking.providerId?.businessName || "N/A"}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="mr-2 text-blue-600" />
                          <span>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiClock className="mr-2 text-blue-600" />
                          <span>{booking.bookingTime}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiMapPin className="mr-2 text-blue-600" />
                          <span className="truncate">
                            {booking.userAddress}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiDollarSign className="mr-2 text-green-600" />
                          <span className="font-bold text-green-600">
                            ${booking.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Notes:</span>{" "}
                            {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => setCancelConfirm(booking._id)}
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
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
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
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        onConfirm={() => handleCancelBooking(cancelConfirm)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Cancel Booking"
        confirmStyle="danger"
      />
    </div>
  );
};

export default MyBookings;

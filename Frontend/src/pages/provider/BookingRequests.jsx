import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiEye,
} from "react-icons/fi";
import { providerAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";

const BookingRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Confirm",
    confirmStyle: "primary",
  });

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getBookingRequests(user.id);
      setBookings(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await providerAPI.acceptBooking(user.id, bookingId);
      toast.success("Booking accepted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to accept booking");
    }
  };

  const handleReject = (bookingId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject Booking",
      message:
        "Are you sure you want to reject this booking? This action cannot be undone.",
      confirmText: "Reject",
      confirmStyle: "danger",
      onConfirm: async () => {
        try {
          await providerAPI.rejectBooking(user.id, bookingId);
          toast.success("Booking rejected");
          fetchBookings();
        } catch (error) {
          console.error("Error rejecting booking:", error);
          toast.error("Failed to reject booking");
        }
      },
    });
  };

  const handleComplete = (bookingId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Complete Booking",
      message:
        "Are you sure you want to mark this booking as completed? Make sure the service has been fully delivered.",
      confirmText: "Mark Complete",
      confirmStyle: "primary",
      onConfirm: async () => {
        try {
          await providerAPI.completeBooking(user.id, bookingId);
          toast.success("Booking marked as completed");
          fetchBookings();
        } catch (error) {
          console.error("Error completing booking:", error);
          toast.error("Failed to complete booking");
        }
      },
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Booking Requests</h1>
          <p className="text-gray-500 mt-1">
            Manage your incoming booking requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 mb-6 inline-flex">
          {["all", "pending", "accepted", "completed", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md capitalize transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-400">
              {filter === "all"
                ? "You don't have any bookings yet"
                : `No ${filter} bookings`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-800">
                        {booking.serviceId?.name || "Service"}
                      </h3>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <FiUser className="w-4 h-4 mr-2" />
                        <span>{booking.userId?.name || "Customer"}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FiClock className="w-4 h-4 mr-2" />
                        <span>{booking.bookingTime}</span>
                      </div>
                      <div className="flex items-center text-green-600 font-medium">
                        ${booking.totalAmount?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>

                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(booking._id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Accept"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <FiXCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() => handleComplete(booking._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Booking Details
                  </h2>
                  <p className="text-gray-500 text-sm">
                    #{selectedBooking._id?.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedBooking.serviceId?.name}
                  </h3>
                  <StatusBadge status={selectedBooking.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">
                      {selectedBooking.userId?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedBooking.userId?.email}
                    </p>
                    {selectedBooking.userId?.phone && (
                      <p className="text-sm text-gray-400">
                        {selectedBooking.userId?.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedBooking.totalAmount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Service: ${selectedBooking.serviceAmount?.toFixed(2)} |
                      Platform Fee: ${selectedBooking.platformFee?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service Address</p>
                  <div className="flex items-start mt-1">
                    <FiMapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">
                      {selectedBooking.userAddress}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(
                        selectedBooking.bookingDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedBooking.bookingTime}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {selectedBooking.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleAccept(selectedBooking._id);
                          setShowModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          handleReject(selectedBooking._id);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedBooking.status === "accepted" && (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleComplete(selectedBooking._id);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={() => {
            confirmDialog.onConfirm();
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          confirmStyle={confirmDialog.confirmStyle}
        />
      </div>
    </div>
  );
};

export default BookingRequests;

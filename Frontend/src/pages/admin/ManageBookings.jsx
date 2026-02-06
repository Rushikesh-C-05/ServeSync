import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiEye,
  FiSearch,
  FiTrash2,
  FiUser,
  FiPackage,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import { adminAPI } from "../../services/api";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editForm, setEditForm] = useState({
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      const data = response.data?.data || response.data || [];
      setBookings(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await adminAPI.deleteBooking(bookingId);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      toast.success("Booking deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete booking");
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, newStatus);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
      toast.success("Booking status updated successfully");
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      scheduledDate: booking.scheduledDate
        ? new Date(booking.scheduledDate).toISOString().split("T")[0]
        : "",
      scheduledTime: booking.scheduledTime || "",
      notes: booking.notes || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateBooking(editingBooking.id, editForm);
      setShowEditModal(false);
      await loadBookings();
      toast.success("Booking updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceId?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0,
  );
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
          <p className="text-gray-500">
            Monitor and manage all bookings on the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600">
                  {bookings.length}
                </p>
              </div>
              <FiCalendar className="text-4xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {pendingBookings}
                </p>
              </div>
              <FiClock className="text-4xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedBookings}
                </p>
              </div>
              <FiPackage className="text-4xl text-green-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-indigo-600">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <FiDollarSign className="text-4xl text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by user, service, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            Bookings ({filteredBookings.length})
          </h2>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <p className="text-xs text-gray-500 font-mono">
                          #{booking.id?.slice(-8)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {booking.userId?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.userId?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {booking.serviceId?.title || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.serviceId?.category}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {booking.provider?.businessName || "N/A"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(
                              booking.scheduledDate,
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.scheduledTime}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-green-600">
                          ${booking.totalAmount?.toFixed(2)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleViewDetails(booking)}
                            variant="ghost"
                            size="icon"
                          >
                            <FiEye className="text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(booking)}
                            variant="ghost"
                            size="icon"
                          >
                            <FiEdit className="text-green-600" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(booking.id)}
                            variant="ghost"
                            size="icon"
                          >
                            <FiTrash2 className="text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="text-gray-700 font-mono">
                    #{selectedBooking.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="text-gray-700">
                      {selectedBooking.userId?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedBooking.userId?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="text-gray-700">
                      {selectedBooking.provider?.businessName}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="text-gray-700 font-semibold">
                    {selectedBooking.serviceId?.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {selectedBooking.serviceId?.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Date</p>
                    <p className="text-gray-700">
                      {new Date(
                        selectedBooking.scheduledDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Time</p>
                    <p className="text-gray-700">
                      {selectedBooking.scheduledTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-gray-700 font-semibold text-lg">
                      ${selectedBooking.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-700">
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Status Update */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "pending",
                      "accepted",
                      "completed",
                      "cancelled",
                      "rejected",
                    ].map((status) => (
                      <Button
                        key={status}
                        onClick={() => {
                          handleUpdateStatus(selectedBooking.id, status);
                          setSelectedBooking({ ...selectedBooking, status });
                        }}
                        disabled={selectedBooking.status === status}
                        variant="outline"
                        size="sm"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    handleEdit(selectedBooking);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Booking
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    handleDelete(selectedBooking.id);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  Delete Booking
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showEditModal && editingBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Booking</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Scheduled Date
                  </label>
                  <Input
                    type="date"
                    value={editForm.scheduledDate}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Scheduled Time
                  </label>
                  <Input
                    type="time"
                    value={editForm.scheduledTime}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        scheduledTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4}
                    placeholder="Add notes about this booking..."
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="admin"
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This will also delete related payments and reviews."
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default ManageBookings;

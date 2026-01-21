import { useEffect, useState } from "react";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import ImageUpload from "../../components/ImageUpload";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { providerAPI, uploadAPI } from "../../services/api";

const ProviderDashboard = () => {
  const { user, updateUserImage } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [providerImage, setProviderImage] = useState(null);

  useEffect(() => {
    loadData();
    loadProviderProfile();
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
    } finally {
      setLoading(false);
    }
  };

  const loadProviderProfile = async () => {
    try {
      const response = await providerAPI.getProfile(user.id);
      const data = response.data?.data || response.data;
      setProviderImage(data.profileImage || null);
    } catch (error) {}
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);
    try {
      const response = await uploadAPI.uploadProviderProfileImage(file);
      const newImageUrl = response.data?.data?.profileImage;
      if (newImageUrl) {
        setProviderImage(newImageUrl);
        toast.success("Profile image updated successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageDelete = async () => {
    setImageLoading(true);
    try {
      await uploadAPI.deleteProviderProfileImage();
      setProviderImage(null);
      toast.success("Profile image removed");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setImageLoading(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/provider/dashboard", label: "Dashboard" },
    { path: "/provider/services", label: "My Services" },
    { path: "/provider/requests", label: "Booking Requests" },
    { path: "/provider/reviews", label: "Reviews" },
    { path: "/provider/earnings", label: "Earnings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="provider" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 border-l-4 border-l-indigo-600">
          <div className="flex items-center space-x-6">
            <ImageUpload
              currentImage={providerImage}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
              type="provider"
              size="lg"
              shape="circle"
              loading={imageLoading}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 🛠️
              </h1>
              <p className="text-gray-500">Manage your services and bookings</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiShoppingBag}
            label="Total Services"
            value={stats?.totalServices || 0}
            color="purple"
          />
          <StatCard
            icon={FiClock}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="blue"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Completed"
            value={stats?.completedBookings || 0}
            color="green"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Earnings"
            value={`$${stats?.totalEarnings?.toLocaleString() || 0}`}
            color="green"
          />
          <StatCard
            icon={FiStar}
            label="Rating"
            value={`${stats?.rating || 0} ⭐`}
            color="amber"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Pending Requests"
            value={stats?.pendingRequests || 0}
            color="amber"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/provider/services")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiShoppingBag className="text-2xl text-indigo-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Services</h3>
              <p className="text-sm text-gray-500">Add or edit your services</p>
            </button>

            <button
              onClick={() => navigate("/provider/requests")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiClock className="text-2xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Requests</h3>
              <p className="text-sm text-gray-500">
                {stats?.pendingRequests || 0} pending requests
              </p>
            </button>

            <button
              onClick={() => navigate("/provider/earnings")}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left"
            >
              <FiDollarSign className="text-2xl text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Earnings</h3>
              <p className="text-sm text-gray-500">Track your revenue</p>
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button
              onClick={() => navigate("/provider/requests")}
              className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {booking.serviceName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Customer: {booking.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <FiClock className="inline mr-1" />
                        {new Date(
                          booking.bookingDate,
                        ).toLocaleDateString()} at {booking.bookingTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={booking.status} />
                      <p className="text-lg font-bold text-green-600 mt-2">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No bookings yet</p>
            )}
          </div>
        </div>

        {/* My Services */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Services</h2>
            <button
              onClick={() => navigate("/provider/services")}
              className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm font-medium"
            >
              Manage All →
            </button>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {service.bookings} total bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${service.price}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        service.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

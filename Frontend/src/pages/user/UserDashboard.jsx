import { useEffect, useState } from "react";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import ServiceCard from "../../components/ServiceCard";
import StatusBadge from "../../components/StatusBadge";
import ImageUpload from "../../components/ImageUpload";
import { useAuth } from "../../context/AuthContext";
import { serviceAPI, userAPI, uploadAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const UserDashboard = () => {
  const { user, updateUserImage } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);
    try {
      const response = await uploadAPI.uploadUserProfileImage(file);
      const newImageUrl = response.data?.data?.profileImage;
      if (newImageUrl) {
        updateUserImage(newImageUrl);
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
      await uploadAPI.deleteUserProfileImage();
      updateUserImage(null);
      toast.success("Profile image removed");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setImageLoading(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/user/dashboard", label: "Dashboard" },
    { path: "/user/services", label: "Browse Services" },
    { path: "/user/bookings", label: "My Bookings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen user-theme flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-user border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen user-theme">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <Card className="mb-8 border-l-4 border-l-user">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <ImageUpload
                currentImage={user?.profileImage}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
                type="user"
                size="lg"
                shape="circle"
                loading={imageLoading}
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Ready to book your next service?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiShoppingBag}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="user"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Completed"
            value={stats?.completedBookings || 0}
            color="green"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Spent"
            value={`$${stats?.totalSpent || 0}`}
            color="purple"
          />
        </div>

        {/* Become a Provider CTA */}
        {user?.role === "user" && (
          <Card className="mb-8 border-l-4 border-l-provider">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="bg-provider p-4 rounded-xl">
                    <FiBriefcase className="text-3xl text-provider-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      Become a Service Provider
                    </h3>
                    <p className="text-muted-foreground">
                      Start earning by offering your services to thousands of
                      customers
                    </p>
                  </div>
                </div>
                <Button
                  variant="provider"
                  onClick={() => navigate("/user/become-provider")}
                  className="whitespace-nowrap"
                >
                  Get Started
                  <FiArrowRight className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button
              onClick={() => navigate("/user/bookings")}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {booking.serviceId?.name || "Service"}
                      </h3>
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
                        ${booking.totalAmount?.toFixed(2) || "0.00"}
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

        {/* Featured Services */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Popular Services
            </h2>
            <button
              onClick={() => navigate("/user/services")}
              className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              Browse All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => navigate(`/user/booking/${service.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

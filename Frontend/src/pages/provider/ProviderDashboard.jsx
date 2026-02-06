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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

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
        id: booking.id,
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
      <div className="min-h-screen provider-theme flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-provider border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen provider-theme">
      <Navbar role="provider" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <Card className="mb-8 border-l-4 border-l-provider">
          <CardContent className="p-8">
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
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome back, {user?.name}! 🛠️
                </h1>
                <p className="text-muted-foreground">
                  Manage your services and bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiShoppingBag}
            label="Total Services"
            value={stats?.totalServices || 0}
            color="provider"
          />
          <StatCard
            icon={FiClock}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="provider"
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/provider/services")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiShoppingBag className="text-2xl text-provider mb-2" />
                <h3 className="font-semibold text-foreground">
                  Manage Services
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add or edit your services
                </p>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/provider/requests")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiClock className="text-2xl text-provider mb-2" />
                <h3 className="font-semibold text-foreground">View Requests</h3>
                <p className="text-sm text-muted-foreground">
                  {stats?.pendingRequests || 0} pending requests
                </p>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/provider/earnings")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiDollarSign className="text-2xl text-emerald-600 mb-2" />
                <h3 className="font-semibold text-foreground">View Earnings</h3>
                <p className="text-sm text-muted-foreground">
                  Track your revenue
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button
                variant="ghost"
                onClick={() => navigate("/provider/requests")}
                className="text-provider hover:text-provider/80"
              >
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-accent/50 border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {booking.serviceName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          Customer: {booking.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <FiClock className="inline mr-1" />
                          {new Date(
                            booking.bookingDate,
                          ).toLocaleDateString()}{" "}
                          at {booking.bookingTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={booking.status} />
                        <p className="text-lg font-bold text-emerald-600 mt-2">
                          ${booking.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No bookings yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Services</CardTitle>
              <Button
                variant="ghost"
                onClick={() => navigate("/provider/services")}
                className="text-provider hover:text-provider/80"
              >
                Manage All →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-accent/50 border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {service.bookings} total bookings
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-lg font-bold text-emerald-600">
                        ${service.price}
                      </p>
                      <StatusBadge status={service.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;

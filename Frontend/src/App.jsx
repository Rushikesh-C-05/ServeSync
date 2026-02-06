import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Landing from "./pages/public/Landing";
import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import ProviderLogin from "./pages/auth/ProviderLogin";
import AdminLogin from "./pages/auth/AdminLogin";

// Redirect Components
const AdminRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/login" replace />;
};

const ProviderRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user && user.role === "provider") {
    return <Navigate to="/provider/dashboard" replace />;
  }

  return <Navigate to="/provider/login" replace />;
};

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import BrowseServices from "./pages/user/BrowseServices";
import BookingDetails from "./pages/user/BookingDetails";
import MyBookings from "./pages/user/MyBookings";
import BecomeProvider from "./pages/user/BecomeProvider";
import WriteReview from "./pages/user/WriteReview";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderManageServices from "./pages/provider/ManageServices";
import BookingRequests from "./pages/provider/BookingRequests";
import Earnings from "./pages/provider/Earnings";
import ProviderReviews from "./pages/provider/Reviews";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProviders from "./pages/admin/ManageProviders";
import AdminManageServices from "./pages/admin/ManageServices";
import AdminManageBookings from "./pages/admin/ManageBookings";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageApplications from "./pages/admin/ManageApplications";
import ManageReviews from "./pages/admin/ManageReviews";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Base path redirects */}
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/provider" element={<ProviderRedirect />} />

          {/* User Routes */}
          <Route path="/user" element={<ProtectedRoute role="user" />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="services" element={<BrowseServices />} />
            <Route path="booking/:id" element={<BookingDetails />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="become-provider" element={<BecomeProvider />} />
            <Route path="review/:bookingId" element={<WriteReview />} />
          </Route>

          {/* Provider Routes */}
          <Route path="/provider" element={<ProtectedRoute role="provider" />}>
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="services" element={<ProviderManageServices />} />
            <Route path="requests" element={<BookingRequests />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="reviews" element={<ProviderReviews />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="providers" element={<ManageProviders />} />
            <Route path="services" element={<AdminManageServices />} />
            <Route path="bookings" element={<AdminManageBookings />} />
            <Route path="applications" element={<ManageApplications />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="reviews" element={<ManageReviews />} />
          </Route>

          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#10B981",
              },
            },
            error: {
              style: {
                background: "#EF4444",
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Landing from "./pages/public/Landing";
import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import ProviderLogin from "./pages/auth/ProviderLogin";
import ProviderRegister from "./pages/auth/ProviderRegister";
import AdminLogin from "./pages/auth/AdminLogin";

// Redirect Components
const AdminRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
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
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
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

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ManageServices from "./pages/provider/ManageServices";
import BookingRequests from "./pages/provider/BookingRequests";
import Earnings from "./pages/provider/Earnings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProviders from "./pages/admin/ManageProviders";
import ManageCategories from "./pages/admin/ManageCategories";
import PlatformStats from "./pages/admin/PlatformStats";

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
          <Route path="/provider/register" element={<ProviderRegister />} />
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
          </Route>

          {/* Provider Routes */}
          <Route path="/provider" element={<ProtectedRoute role="provider" />}>
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="requests" element={<BookingRequests />} />
            <Route path="earnings" element={<Earnings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="providers" element={<ManageProviders />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="stats" element={<PlatformStats />} />
          </Route>

          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

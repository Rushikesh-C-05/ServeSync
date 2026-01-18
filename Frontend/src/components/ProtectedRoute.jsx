import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    const loginPath = role === "user" ? "/login" : `/${role}/login`;
    return <Navigate to={loginPath} replace />;
  }

  // Allow providers to access user routes (they are users too)
  // But don't allow users to access provider/admin routes
  const hasAccess =
    user.role === role || (role === "user" && user.role === "provider");

  if (!hasAccess) {
    const loginPath = role === "user" ? "/login" : `/${role}/login`;
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

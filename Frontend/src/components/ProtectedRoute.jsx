import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
          <div className="absolute inset-0 rounded-full blur-xl bg-neon-blue/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    const loginPath = role === "user" ? "/login" : `/${role}/login`;
    return <Navigate to={loginPath} replace />;
  }

  if (user.role !== role) {
    const loginPath = role === "user" ? "/login" : `/${role}/login`;
    return <Navigate to={loginPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

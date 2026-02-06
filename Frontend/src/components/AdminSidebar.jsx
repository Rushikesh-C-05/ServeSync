import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiAlertCircle,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiPackage,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: FiHome,
    },
    {
      path: "/admin/users",
      label: "Manage Users",
      icon: FiUsers,
    },
    {
      path: "/admin/providers",
      label: "Manage Providers",
      icon: FiShoppingBag,
    },
    {
      path: "/admin/services",
      label: "Manage Services",
      icon: FiPackage,
    },
    {
      path: "/admin/bookings",
      label: "Manage Bookings",
      icon: FiCalendar,
    },
    {
      path: "/admin/reviews",
      label: "Manage Reviews",
      icon: FiStar,
    },
    {
      path: "/admin/applications",
      label: "Applications",
      icon: FiAlertCircle,
    },
    {
      path: "/admin/categories",
      label: "Manage Categories",
      icon: FiSettings,
    },
  ];

  return (
    <aside
      className={cn(
        "bg-card border-r h-screen sticky top-0 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-admin rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-admin-foreground">
                  S
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                ServeSync
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/admin/dashboard" className="flex justify-center w-full">
              <div className="w-10 h-10 bg-admin rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-admin-foreground">
                  S
                </span>
              </div>
            </Link>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <FiMenu size={20} />
            </Button>
          )}
        </div>
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mt-2"
          >
            <FiX size={20} />
          </Button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-md transition-colors",
                    isActive
                      ? "bg-admin-light text-admin"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FiLogOut className="text-red-600" />
              <span className="text-red-600 font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex justify-center"
          >
            <FiLogOut className="text-red-600" size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;

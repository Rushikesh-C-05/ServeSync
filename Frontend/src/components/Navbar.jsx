import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const Navbar = ({ role, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleColors = {
    admin: "bg-admin",
    provider: "bg-provider",
    user: "bg-user",
  };

  return (
    <nav className="bg-card border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={`/${role}/dashboard`}
            className="flex items-center space-x-2"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                roleColors[role] || roleColors.user,
              )}
            >
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">ServeSync</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? role === "admin"
                      ? "text-admin"
                      : role === "provider"
                        ? "text-provider"
                        : "text-user"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-3 pl-4 border-l">
              {/* Profile Image */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-muted-foreground" size={20} />
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <FiLogOut size={20} />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Mobile Profile Image */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-gray-400" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="text-red-500" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

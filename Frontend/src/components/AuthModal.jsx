import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiTool,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

const AuthModal = ({ isOpen, onClose, type = "user-login", onSwitchModal }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Determine if this is a login or register modal
  const isLogin = type.includes("login");
  const isRegister = type === "user-register";
  const isAdmin = type === "admin-login";

  // Role state for login (user or provider)
  const [selectedRole, setSelectedRole] = useState(
    type === "provider-login" ? "provider" : "user",
  );

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Registration validation
    if (type === "user-register") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    try {
      if (type === "user-register") {
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);
        submitData.append("phone", formData.phone);
        submitData.append("address", formData.address);
        if (profileImage) {
          submitData.append("profileImage", profileImage);
        }
        await register(submitData);
        await login(formData.email, formData.password, "user");
        navigate("/user/dashboard");
      } else {
        // Use selected role for login
        const role = isAdmin ? "admin" : selectedRole;
        await login(formData.email, formData.password, role);
        navigate(`/${role}/dashboard`);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getModalConfig = () => {
    const configs = {
      "user-login": {
        title: "Customer Login",
        subtitle: "Welcome back! Book your next service",
        icon: FiUser,
        iconBg: "bg-user",
        image: "/UserLoginPageImage.png",
        color: "bg-user",
        overlayText: {
          title: "Welcome Back!",
          subtitle: "Access your bookings and discover new services",
        },
      },
      "user-register": {
        title: "Create Account",
        subtitle: "Join ServeSync and start booking",
        icon: FiUser,
        iconBg: "bg-user",
        image: "/UserRegisterPageImage.png",
        color: "bg-user",
        overlayText: {
          title: "Join ServeSync Today!",
          subtitle: "Start booking trusted services in your area",
        },
      },
      "provider-login": {
        title: "Provider Login",
        subtitle: "Manage your services & earnings",
        icon: FiTool,
        iconBg: "bg-provider",
        image: "/ProviderLoginPageImage.png",
        color: "bg-provider",
        overlayText: {
          title: "Grow Your Business",
          subtitle: "Manage bookings and track your earnings",
        },
      },
      "admin-login": {
        title: "Admin Login",
        subtitle: "Access admin dashboard",
        icon: FiShield,
        iconBg: "bg-admin",
        image: null,
        color: "bg-admin",
        overlayText: {
          title: "Admin Portal",
          subtitle: "Manage platform operations",
        },
      },
    };
    return configs[type] || configs["user-login"];
  };

  const config = getModalConfig();
  const IconComponent = config.icon;

  // Dynamic image and color based on selected role for login
  const currentImage =
    isLogin && !isAdmin
      ? selectedRole === "provider"
        ? "/ProviderLoginPageImage.png"
        : "/UserLoginPageImage.png"
      : config.image;

  const currentColor =
    isLogin && !isAdmin
      ? selectedRole === "provider"
        ? "bg-provider"
        : "bg-user"
      : config.color;

  const currentOverlayText =
    isLogin && !isAdmin
      ? selectedRole === "provider"
        ? {
            title: "Grow Your Business",
            subtitle: "Manage bookings and track your earnings",
          }
        : {
            title: "Welcome Back!",
            subtitle: "Access your bookings and discover new services",
          }
      : config.overlayText;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl p-0 overflow-hidden flex"
        onClose={onClose}
      >
        {/* Left Side - Image */}
        <div
          className={`hidden lg:block lg:w-1/2 ${currentColor} relative transition-all duration-300`}
        >
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={config.title}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/30"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {currentOverlayText.title}
                </h2>
                <p className="text-white/90">{currentOverlayText.subtitle}</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <IconComponent className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <h2 className="text-3xl font-bold mb-2">
                  {currentOverlayText.title}
                </h2>
                <p className="text-white/90">{currentOverlayText.subtitle}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto relative">
          {/* Role Selector for Login (Not Admin, Not Register) */}
          {isLogin && !isAdmin && !isRegister && (
            <div className="mb-6">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setSelectedRole("user")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedRole === "user"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiUser className="w-4 h-4" />
                  <span>I'm a Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("provider")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedRole === "provider"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiTool className="w-4 h-4" />
                  <span>I'm a Provider</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            {/* Dynamic Icon based on selected role for login */}
            {isLogin && !isAdmin ? (
              <div
                className={`w-14 h-14 ${selectedRole === "provider" ? "bg-indigo-600" : "bg-blue-600"} rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors`}
              >
                {selectedRole === "provider" ? (
                  <FiTool className="text-2xl text-white" />
                ) : (
                  <FiUser className="text-2xl text-white" />
                )}
              </div>
            ) : (
              <div
                className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}
              >
                <IconComponent className="text-2xl text-white" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin && !isAdmin
                ? selectedRole === "provider"
                  ? "Provider Login"
                  : "Customer Login"
                : config.title}
            </h2>
            <p className="text-gray-500">
              {isLogin && !isAdmin
                ? selectedRole === "provider"
                  ? "Manage your services & earnings"
                  : "Welcome back! Book your next service"
                : config.subtitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Registration Fields */}
            {type === "user-register" && (
              <>
                {/* Profile Image Upload */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <FiCamera className="w-4 h-4" />
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Registration Additional Fields */}
            {type === "user-register" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="+1 234 567 8900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="123 Main St, City"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Remember Me / Forgot Password (Login only) */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-300"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className={`${
                    isAdmin
                      ? "text-gray-800 hover:text-gray-900"
                      : selectedRole === "provider"
                        ? "text-indigo-600 hover:text-indigo-700"
                        : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all ${
                isAdmin
                  ? "bg-gray-800 hover:bg-gray-900"
                  : isLogin && selectedRole === "provider"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          {/* Footer Links */}
          {type !== "admin-login" && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {type === "user-register" ? (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => onSwitchModal?.("user-login")}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => onSwitchModal?.("user-register")}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

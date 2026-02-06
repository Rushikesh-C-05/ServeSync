import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiMapPin,
  FiArrowLeft,
  FiCamera,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, login } = useAuth();
  const navigate = useNavigate();

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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      if (profileImage) {
        submitData.append("profileImage", profileImage);
      }

      // Register the user with FormData
      await register(submitData);

      // Auto-login after registration
      await login(formData.email, formData.password, "user");
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex max-h-[90vh]">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 bg-user relative">
          <img
            src="/UserRegisterPageImage.png"
            alt="Join our community"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-slate-900/30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Join ServeSync Today!</h2>
            <p className="text-slate-100">
              Start booking trusted services in your area
            </p>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-user rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-2xl text-user-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500">Join ServeSync to book services</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-4">
              <div
                className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <FiCamera className="text-2xl text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-user hover:text-user/80 font-medium"
                >
                  {imagePreview ? "Change photo" : "Add photo"}
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
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

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
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

            <div>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Phone Number
              </Label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="address"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Address
              </Label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10"
                  rows={2}
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="user"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-user hover:text-user/80 font-medium"
            >
              Sign in
            </Link>
          </div>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default UserRegister;

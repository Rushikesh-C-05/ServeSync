import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiAward,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCamera,
  FiX,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { userAPI, adminAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BecomeProvider = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [businessImage, setBusinessImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    category: "",
    experience: "",
    phone: "",
    address: "",
    certifications: "",
    portfolio: "",
  });

  useEffect(() => {
    checkApplicationStatus();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      // Check if user is already a provider
      if (user.role === "provider") {
        setCheckingStatus(false);
        return;
      }

      const response = await userAPI.getProviderApplicationStatus(user.id);
      console.log("Application status response:", response.data);

      // Handle different response structures
      const responseData = response.data.data || response.data;

      if (responseData.hasApplication && responseData.application) {
        // Double-check: if application is approved but user role is not provider,
        // ignore the application status (it means provider was deleted)
        if (
          responseData.application.status === "approved" &&
          user.role !== "provider"
        ) {
          console.log(
            "Application approved but user is not a provider - ignoring stale application",
          );
          setApplicationStatus(null);
        } else {
          setApplicationStatus(responseData.application);
        }
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setBusinessImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setBusinessImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      if (businessImage) {
        submitData.append("businessImage", businessImage);
      }

      await userAPI.submitProviderApplication(user.id, submitData);
      toast.success(
        "Application submitted successfully! Your application is under review.",
      );
      await checkApplicationStatus();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: "/user/dashboard", label: "Dashboard" },
    { path: "/user/services", label: "Browse Services" },
    { path: "/user/bookings", label: "My Bookings" },
  ];

  const benefits = [
    {
      icon: FiBriefcase,
      title: "Grow Your Business",
      description: "Reach thousands of customers looking for your services",
    },
    {
      icon: FiTrendingUp,
      title: "Flexible Schedule",
      description: "Work on your own terms and manage your own time",
    },
    {
      icon: FiAward,
      title: "Build Your Reputation",
      description: "Earn reviews and ratings to stand out from the crowd",
    },
  ];

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Checking application status...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is already a provider, show success message
  if (user.role === "provider") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <FiCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              You're Already a Provider! 🎉
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              You have full access to all provider features
            </p>
            <button
              onClick={() => navigate("/provider/dashboard")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Go to Provider Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show application status if exists
  if (applicationStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center mb-8">
              {applicationStatus.status === "pending" && (
                <>
                  <FiClock className="text-5xl text-amber-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Under Review ⏳
                  </h1>
                  <p className="text-lg text-gray-500 mb-2">
                    Your provider application is currently being reviewed by our
                    admin team
                  </p>
                  <p className="text-sm text-gray-400">
                    This usually takes 1-2 business days. We'll notify you once
                    a decision is made.
                  </p>
                </>
              )}
              {applicationStatus.status === "approved" && (
                <>
                  <FiCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Approved! 🎉
                  </h1>
                  <p className="text-gray-500">
                    Congratulations! You are now a provider.
                  </p>
                  <button
                    onClick={() => navigate("/provider/dashboard")}
                    className="btn-primary mt-4"
                  >
                    Go to Provider Dashboard
                  </button>
                </>
              )}
              {applicationStatus.status === "rejected" && (
                <>
                  <FiAlertCircle className="text-5xl text-red-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Not Approved
                  </h1>
                  <p className="text-gray-500 mb-4">
                    Unfortunately, your application was not approved
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-red-700">
                      You cannot submit another application at this time. Please
                      contact the administrator for more information.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium text-gray-900">
                    {applicationStatus.businessName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">
                    {applicationStatus.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-gray-900">
                    {applicationStatus.experience}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      applicationStatus.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : applicationStatus.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {applicationStatus.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {applicationStatus.adminNotes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Admin Notes</p>
                  <p className="text-gray-700">
                    {applicationStatus.adminNotes}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 border-l-4 border-l-indigo-600">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Become a Service Provider 🚀
          </h1>
          <p className="text-lg text-gray-500">
            Submit your application to join our platform and start earning
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center"
            >
              <benefit.icon className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Provider Application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Business Image (Optional)
              </label>
              <div
                className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Business preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <FiCamera className="text-3xl text-gray-400 mb-2" />
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
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., John's Plumbing Services"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                className="input-field w-full h-32 resize-none"
                placeholder="Describe your services, expertise, and what makes you unique..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="e.g., 5 years"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="e.g., 123 Main St, City"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications (Optional)
              </label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., Licensed Electrician, HVAC Certified"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio/Website (Optional)
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="e.g., https://yourwebsite.com"
              />
            </div>

            {/* Terms & Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    By submitting this application, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Provide accurate and truthful information</li>
                    <li>Maintain professional standards of service</li>
                    <li>Comply with platform terms and conditions</li>
                    <li>Pay the platform fee on each completed booking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/user/dashboard")}
                className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⏳ <strong>Note:</strong> Your application will be reviewed by our
              admin team. You'll be notified once approved, and you can start
              offering services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;

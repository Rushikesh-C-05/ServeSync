import { useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiAward, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { providerAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BecomeProvider = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    category: "",
    experience: "",
    certifications: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const providerData = {
        businessName: formData.businessName,
        description: formData.description,
        category: formData.category,
        experience: parseInt(formData.experience),
        certifications: formData.certifications
          ? formData.certifications.split(",").map((c) => c.trim())
          : [],
      };

      await providerAPI.register(user.id, providerData);

      // Update user role in context
      const updatedUser = { ...user, role: "provider" };
      localStorage.setItem("servesync_user", JSON.stringify(updatedUser));
      login(updatedUser);

      alert(
        "Provider registration submitted! Your application is pending approval. You'll be notified once approved."
      );
      navigate("/provider/dashboard");
    } catch (error) {
      console.error("Error registering as provider:", error);
      alert(
        error.response?.data?.message ||
          "Failed to register as provider. Please try again."
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

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="glass-card p-8 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-neon-purple"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-3">
            Become a Service Provider 🚀
          </h1>
          <p className="text-xl text-gray-400">
            Join our platform and start earning by offering your services
          </p>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <benefit.icon className="text-5xl text-neon-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Registration Form */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Provider Application</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
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
              <label className="block text-sm font-medium mb-2">
                Business Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field w-full h-32 resize-none"
                placeholder="Describe your services, expertise, and what makes you unique..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
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
                  <option value="Cleaning">Cleaning</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Painting">Painting</option>
                  <option value="Gardening">Gardening</option>
                  <option value="Moving">Moving</option>
                  <option value="Repair">Repair</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  min="0"
                  placeholder="e.g., 5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Certifications (Optional)
              </label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="Separate multiple certifications with commas"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Licensed Electrician, HVAC Certified, First Aid
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="glass-card p-4 bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="text-neon-blue mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-400">
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
                className="flex-1 glass-card p-3 hover:bg-white/10 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={loading}
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 glass-card bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-sm text-yellow-400">
              ⏳ <strong>Note:</strong> Your application will be reviewed by our
              admin team. You'll receive a notification once your account is
              approved, and you can start offering services.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeProvider;

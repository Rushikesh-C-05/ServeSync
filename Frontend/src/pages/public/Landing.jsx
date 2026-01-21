import { Link, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiUser,
  FiTool,
  FiArrowRight,
  FiStar,
  FiClock,
  FiDollarSign,
  FiShield,
  FiPackage,
  FiTrendingUp,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: FiStar,
      title: "Top Rated Services",
      description: "Vetted professionals with 4.5+ ratings",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: FiClock,
      title: "Quick Booking",
      description: "Book services in under 2 minutes",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: FiDollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees, pay what you see",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: FiShield,
      title: "Secure Payments",
      description: "Your money is protected until job completion",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const roles = [
    {
      title: "Find Services",
      subtitle: "For Customers",
      role: "user",
      icon: FiUser,
      bgColor: "from-blue-600 to-blue-700",
      borderColor: "border-blue-600",
      features: [
        "Browse local services",
        "Instant booking",
        "Secure payments",
        "Rate & review",
      ],
      cta: "Find Services",
    },
    {
      title: "Offer Services",
      subtitle: "For Providers",
      role: "provider",
      icon: FiTool,
      bgColor: "from-indigo-600 to-purple-600",
      borderColor: "border-indigo-600",
      features: [
        "List your services",
        "Manage bookings",
        "Track earnings",
        "Build reputation",
      ],
      cta: "Become a Provider",
    },
  ];

  const stats = [
    { icon: FiUser, value: "10K+", label: "Active Users" },
    { icon: FiPackage, value: "5K+", label: "Services Listed" },
    { icon: FiStar, value: "4.8", label: "Average Rating" },
    { icon: FiTrendingUp, value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ServeSync
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                How It Works
              </a>
              {user ? (
                <Link
                  to={`/${user.role}/dashboard`}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                How It Works
              </a>
              {user ? (
                <Link
                  to={`/${user.role}/dashboard`}
                  className="block py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-center font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-center font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Book Services
              </span>
              <br />
              <span className="text-gray-900">Instantly</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with top-rated service providers for all your needs.
              Simple, fast, and reliable service booking platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl transition-all font-semibold flex items-center space-x-2 w-full sm:w-auto justify-center text-lg"
              >
                <span>Get Started Free</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all font-semibold border-2 border-gray-200 w-full sm:w-auto text-center text-lg"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <stat.icon className="text-2xl text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ServeSync?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the best service booking platform with features
              designed for your convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`text-3xl ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you need services or want to offer them, we've got you
              covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 hover:border-transparent overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${role.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <role.icon className="text-3xl text-white" />
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-blue-600 mb-1">
                      {role.subtitle}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {role.title}
                    </h3>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {role.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center space-x-3 text-gray-700"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <FiCheck className="text-green-600 text-sm" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to={role.role === "user" ? "/login" : "/provider/login"}
                    className={`block w-full py-4 px-6 bg-gradient-to-r ${role.bgColor} text-white rounded-xl hover:shadow-xl transition-all font-semibold text-center text-lg group-hover:scale-105`}
                  >
                    {role.cta}
                  </Link>

                  {role.role === "user" && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                      New user?{" "}
                      <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Create an account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse Services",
                desc: "Explore our wide range of services",
              },
              {
                step: "02",
                title: "Book & Pay",
                desc: "Select time slot and make secure payment",
              },
              {
                step: "03",
                title: "Track & Rate",
                desc: "Monitor progress and rate your experience",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
              >
                <div className="text-5xl font-bold text-blue-100 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-white">ServeSync</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 ServeSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

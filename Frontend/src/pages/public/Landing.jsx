import { Link } from "react-router-dom";
import {
  FiCheck,
  FiUser,
  FiTool,
  FiShield,
  FiArrowRight,
  FiStar,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import React from "react";

const Landing = () => {
  const features = [
    {
      icon: FiStar,
      title: "Top Rated Services",
      description: "Vetted professionals with 4.5+ ratings",
    },
    {
      icon: FiClock,
      title: "Quick Booking",
      description: "Book services in under 2 minutes",
    },
    {
      icon: FiDollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees, pay what you see",
    },
    {
      icon: FiShield,
      title: "Secure Payments",
      description: "Your money is protected until job completion",
    },
  ];

  const roles = [
    {
      title: "I need services",
      role: "user",
      icon: FiUser,
      bgColor: "bg-blue-600",
      lightBg: "bg-blue-50",
      features: [
        "Browse services",
        "Easy booking",
        "Track progress",
        "Rate providers",
      ],
    },
    {
      title: "I provide services",
      role: "provider",
      icon: FiTool,
      bgColor: "bg-indigo-600",
      lightBg: "bg-indigo-50",
      features: [
        "Manage services",
        "Accept bookings",
        "Track earnings",
        "Build reputation",
      ],
    },
    {
      title: "Platform Admin",
      role: "admin",
      icon: FiShield,
      bgColor: "bg-slate-800",
      lightBg: "bg-slate-50",
      features: [
        "Monitor platform",
        "Manage users",
        "View analytics",
        "Control settings",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center space-x-3 mb-16">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ServeSync</h1>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              Book Services
              <span className="text-blue-600"> Instantly</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Connect with top-rated service providers for all your needs.
              <br />
              Simple. Fast. Reliable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <FiArrowRight />
              </Link>
              <Link
                to="#how-it-works"
                className="btn-secondary w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm"
              >
                <feature.icon className="text-3xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-gray-600 text-lg">
              Select how you want to use ServeSync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-14 h-14 ${role.bgColor} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <role.icon className="text-2xl text-white" />
                </div>

                <h3 className="text-xl font-semibold text-center text-gray-900 mb-6">
                  {role.title}
                </h3>

                <ul className="space-y-3 mb-8">
                  {role.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 text-gray-600"
                    >
                      <FiCheck className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={role.role === "user" ? "/login" : `/${role.role}/login`}
                  className={`btn-primary w-full block text-center ${role.bgColor} hover:opacity-90`}
                >
                  Continue as{" "}
                  {role.role === "admin"
                    ? "Admin"
                    : role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                </Link>

                {role.role === "user" && (
                  <div className="mt-3 text-center text-sm text-gray-500">
                    New user?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Register here
                    </Link>
                  </div>
                )}
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

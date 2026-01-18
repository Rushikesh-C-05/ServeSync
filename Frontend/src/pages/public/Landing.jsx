import { motion } from "framer-motion";
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
      color: "from-blue-500 to-cyan-500",
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
      color: "from-purple-500 to-pink-500",
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
      color: "from-orange-500 to-red-500",
      features: [
        "Monitor platform",
        "Manage users",
        "View analytics",
        "Control settings",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse-slow"></div>
          <div className="absolute w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl top-48 -right-48 animate-float"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center justify-center space-x-3 mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold">S</span>
            </div>
            <h1 className="text-4xl font-bold gradient-text">ServeSync</h1>
          </motion.div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Book Services
              <span className="gradient-text"> Instantly</span>
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-gray-400 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect with top-rated service providers for all your needs.
              <br />
              Simple. Fast. Reliable.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/login/user"
                className="btn-neon w-full sm:w-auto flex items-center justify-center space-x-2"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <feature.icon className="text-4xl text-neon-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-gray-400 text-lg">
              Select how you want to use ServeSync
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <role.icon className="text-3xl" />
                </div>

                <h3 className="text-2xl font-bold text-center mb-6">
                  {role.title}
                </h3>

                <ul className="space-y-3 mb-8">
                  {role.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 text-gray-300"
                    >
                      <FiCheck className="text-neon-green flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={role.role === "user" ? "/login" : `/${role.role}/login`}
                  className={`btn-primary w-full block text-center bg-gradient-to-r ${role.color}`}
                >
                  Continue as{" "}
                  {role.role === "admin"
                    ? "Admin"
                    : role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                </Link>

                {role.role === "provider" && (
                  <div className="mt-3 text-center text-sm text-gray-400">
                    New provider?{" "}
                    <Link
                      to="/provider/register"
                      className="text-purple-400 hover:text-purple-300 font-medium"
                    >
                      Register here
                    </Link>
                  </div>
                )}

                {role.role === "user" && (
                  <div className="mt-3 text-center text-sm text-gray-400">
                    New user?{" "}
                    <Link
                      to="/register"
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Register here
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">
              Get started in three simple steps
            </p>
          </motion.div>

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
              <motion.div
                key={index}
                className="glass-card p-8 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-bold text-neon-blue/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">S</span>
              </div>
              <span className="text-xl font-bold gradient-text">ServeSync</span>
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

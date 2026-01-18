import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiPackage,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";

const PlatformStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        overview: {
          totalUsers: 1247,
          totalProviders: 342,
          totalServices: 856,
          totalBookings: 5683,
          totalRevenue: 127450.5,
          activeBookings: 89,
        },
        growth: {
          usersGrowth: 12.5,
          providersGrowth: 8.3,
          bookingsGrowth: 15.7,
          revenueGrowth: 22.4,
        },
        topServices: [
          { name: "House Cleaning", bookings: 850, revenue: 18500 },
          { name: "Plumbing", bookings: 670, revenue: 15200 },
          { name: "Electrical Work", bookings: 520, revenue: 12800 },
          { name: "Painting", bookings: 430, revenue: 9600 },
          { name: "Carpentry", bookings: 380, revenue: 8500 },
        ],
        topProviders: [
          { name: "ABC Services", bookings: 145, rating: 4.8, revenue: 12500 },
          { name: "Best Repairs", bookings: 89, rating: 4.5, revenue: 8900 },
          { name: "Pro Solutions", bookings: 76, rating: 4.7, revenue: 7600 },
        ],
        monthlyData: [
          { month: "Jan", bookings: 420, revenue: 9500 },
          { month: "Feb", bookings: 510, revenue: 12300 },
          { month: "Mar", bookings: 680, revenue: 15800 },
        ],
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Manage Users" },
    { path: "/admin/providers", label: "Manage Providers" },
    { path: "/admin/stats", label: "Platform Stats" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar role="admin" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Platform Statistics</h1>
          <p className="text-gray-400">Comprehensive analytics and insights</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.overview.totalUsers || 0}
            color="neon-blue"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Providers"
            value={stats?.overview.totalProviders || 0}
            color="neon-purple"
          />
          <StatCard
            icon={FiPackage}
            label="Total Services"
            value={stats?.overview.totalServices || 0}
            color="neon-green"
          />
          <StatCard
            icon={FiActivity}
            label="Total Bookings"
            value={stats?.overview.totalBookings || 0}
            color="neon-blue"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={`$${stats?.overview.totalRevenue?.toLocaleString() || 0}`}
            color="neon-green"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Active Bookings"
            value={stats?.overview.activeBookings || 0}
            color="orange-500"
          />
        </div>

        {/* Growth Metrics */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Growth Metrics (vs Last Month)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Users Growth</p>
              <p className="text-3xl font-bold text-neon-green">
                +{stats?.growth.usersGrowth}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-2">Providers Growth</p>
              <p className="text-3xl font-bold text-neon-blue">
                +{stats?.growth.providersGrowth}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-2">Bookings Growth</p>
              <p className="text-3xl font-bold text-neon-purple">
                +{stats?.growth.bookingsGrowth}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-2">Revenue Growth</p>
              <p className="text-3xl font-bold text-neon-green">
                +{stats?.growth.revenueGrowth}%
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Services */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">Top Services</h2>
            <div className="space-y-4">
              {stats?.topServices.map((service, index) => (
                <div
                  key={index}
                  className="glass-card p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{service.name}</h3>
                    <span className="text-neon-green font-bold">
                      ${service.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{service.bookings} bookings</span>
                    <div className="w-32 bg-dark-card rounded-full h-2">
                      <div
                        className="bg-neon-blue h-2 rounded-full"
                        style={{
                          width: `${(service.bookings / stats.topServices[0].bookings) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Providers */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Top Providers</h2>
            <div className="space-y-4">
              {stats?.topProviders.map((provider, index) => (
                <div
                  key={index}
                  className="glass-card p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{provider.name}</h3>
                    <span className="text-neon-green font-bold">
                      ${provider.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{provider.bookings} bookings</span>
                    <span className="text-yellow-500">
                      ⭐ {provider.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Monthly Performance */}
        <motion.div
          className="glass-card p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Monthly Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats?.monthlyData.map((month, index) => (
              <div key={index} className="glass-card p-4 text-center">
                <p className="text-gray-400 mb-2">{month.month}</p>
                <p className="text-2xl font-bold text-neon-blue mb-1">
                  {month.bookings} bookings
                </p>
                <p className="text-lg text-neon-green">
                  ${month.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformStats;

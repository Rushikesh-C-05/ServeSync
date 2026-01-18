import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { providerAPI } from "../../services/api";

const Earnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await providerAPI.getEarnings(user.id);
      const data = response.data?.data || response.data;

      // Calculate monthly earnings (earnings from last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const monthlyEarnings = (data.recentPayments || [])
        .filter((payment) => new Date(payment.createdAt) >= thirtyDaysAgo)
        .reduce((sum, payment) => sum + (payment.providerAmount || 0), 0);

      // Calculate pending payouts (payments in pending status)
      const pendingPayouts = (data.recentPayments || [])
        .filter((payment) => payment.status === "pending")
        .reduce((sum, payment) => sum + (payment.providerAmount || 0), 0);

      setEarnings({
        totalEarnings: parseFloat(data.totalEarnings) || 0,
        monthlyEarnings: monthlyEarnings,
        pendingPayouts: pendingPayouts,
        completedBookings: data.totalBookings || 0,
      });

      // Format transactions for display
      const formattedTransactions = (data.recentPayments || [])
        .slice(0, 10)
        .map((payment) => ({
          _id: payment._id,
          service: payment.bookingId?.serviceId?.name || "Service",
          customer: payment.userId?.name || "Customer",
          amount: payment.providerAmount || 0,
          date: payment.createdAt || payment.updatedAt,
          status: payment.status,
        }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error loading earnings:", error);
      alert(error.response?.data?.message || "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: "/provider/dashboard", label: "Dashboard" },
    { path: "/provider/services", label: "My Services" },
    { path: "/provider/requests", label: "Booking Requests" },
    { path: "/provider/earnings", label: "Earnings" },
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
      <Navbar role="provider" links={navLinks} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Earnings Overview</h1>
          <p className="text-gray-400">Track your revenue and payouts</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiDollarSign}
            label="Total Earnings"
            value={`$${earnings?.totalEarnings?.toLocaleString() || 0}`}
            color="neon-green"
          />
          <StatCard
            icon={FiTrendingUp}
            label="This Month"
            value={`$${earnings?.monthlyEarnings?.toLocaleString() || 0}`}
            color="neon-blue"
          />
          <StatCard
            icon={FiCreditCard}
            label="Pending Payouts"
            value={`$${earnings?.pendingPayouts?.toLocaleString() || 0}`}
            color="orange-500"
          />
          <StatCard
            icon={FiCalendar}
            label="Completed Jobs"
            value={earnings?.completedBookings || 0}
            color="neon-purple"
          />
        </div>

        {/* Earnings Chart Placeholder */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-6">Monthly Earnings</h2>
          <div className="h-64 flex items-end justify-around space-x-2">
            {[2100, 2450, 2800, 3100, 2900, 3250].map((amount, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full bg-gradient-to-t from-neon-green to-neon-blue rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ height: `${(amount / 3500) * 100}%` }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                ></motion.div>
                <p className="text-xs text-gray-400 mt-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction._id}
                className="glass-card p-4 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      {transaction.service}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Customer: {transaction.customer}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transaction.date).toLocaleDateString()} at{" "}
                      {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-neon-green">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Earnings;

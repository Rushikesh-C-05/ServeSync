import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";
import { providerAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Earnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchEarnings();
    }
  }, [user?.id]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getEarnings(user.id);
      setEarnings(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Earnings",
      value: `$${earnings?.totalEarnings?.toFixed(2) || "0.00"}`,
      icon: FiDollarSign,
      color: "green",
    },
    {
      title: "This Month",
      value: `$${earnings?.monthlyEarnings?.toFixed(2) || "0.00"}`,
      icon: FiCalendar,
      color: "blue",
    },
    {
      title: "This Week",
      value: `$${earnings?.weeklyEarnings?.toFixed(2) || "0.00"}`,
      icon: FiClock,
      color: "indigo",
    },
    {
      title: "Completed Jobs",
      value: earnings?.completedJobs || 0,
      icon: FiTrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
          <p className="text-gray-500 mt-1">
            Track your income and payment history
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Earnings Overview
          </h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Chart coming soon...</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Transactions
          </h2>
          {earnings?.recentTransactions?.length > 0 ? (
            <div className="space-y-4">
              {earnings.recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.serviceName || "Service"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    +${transaction.amount?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;

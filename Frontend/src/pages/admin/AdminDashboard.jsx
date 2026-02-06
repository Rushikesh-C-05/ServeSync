import { useEffect, useState } from "react";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const AdminDashboard = () => {
  useAuth(); // Verify admin authentication
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch dashboard stats from backend
      const response = await adminAPI.getDashboardStats();
      const data = response.data?.data || response.data;

      setStats({
        totalUsers: data.totalUsers || 0,
        totalProviders: data.totalProviders || 0,
        totalServices: data.totalServices || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: parseFloat(data.totalRevenue) || 0,
        activeBookings: data.activeBookings || 0,
        pendingApprovals: data.pendingApprovals || 0,
      });

      setRecentActivity(data.recentActivity || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen admin-theme flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-admin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <Card className="mb-8 border-l-4 border-l-admin">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Dashboard 👨‍💼</CardTitle>
            <CardDescription>
              Monitor and manage the entire platform
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.totalUsers || 0}
            color="admin"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Providers"
            value={stats?.totalProviders || 0}
            color="purple"
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Bookings"
            value={stats?.totalBookings || 0}
            color="green"
          />
          <StatCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
            color="green"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Active Bookings"
            value={stats?.activeBookings || 0}
            color="admin"
          />
          <StatCard
            icon={FiAlertCircle}
            label="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            color="amber"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiUsers className="text-2xl text-admin mb-2" />
                <h3 className="font-semibold text-foreground">Manage Users</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage all users
                </p>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/admin/providers")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiShoppingBag className="text-2xl text-indigo-600 mb-2" />
                <h3 className="font-semibold text-foreground">
                  Manage Providers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Approve and monitor providers
                </p>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/admin/applications")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiAlertCircle className="text-2xl text-amber-600 mb-2" />
                <h3 className="font-semibold text-foreground">Applications</h3>
                <p className="text-sm text-muted-foreground">
                  Review provider applications
                </p>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/admin/categories")}
                className="h-auto p-4 flex flex-col items-start hover:bg-accent"
              >
                <FiSettings className="text-2xl text-slate-600 mb-2" />
                <h3 className="font-semibold text-foreground">
                  Manage Categories
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add, edit, or remove categories
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="bg-accent/50 border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-admin-light flex items-center justify-center">
                        {activity.type === "user" && (
                          <FiUsers className="text-admin" />
                        )}
                        {activity.type === "provider" && (
                          <FiShoppingBag className="text-indigo-600" />
                        )}
                        {activity.type === "booking" && (
                          <FiCheckCircle className="text-emerald-600" />
                        )}
                        {activity.type === "payment" && (
                          <FiDollarSign className="text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

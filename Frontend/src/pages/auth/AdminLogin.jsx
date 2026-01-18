import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@servesync.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, "admin");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500">Secure platform access</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Admin Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@servesync.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full bg-slate-800 hover:bg-slate-900"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <p className="text-gray-700 font-medium mb-2">Demo Credentials:</p>
          <p className="text-gray-600">Email: admin@servesync.com</p>
          <p className="text-gray-600">Password: password123</p>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          ⚠️ Restricted access. Authorized personnel only.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiTool, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const ProviderLogin = () => {
  const [email, setEmail] = useState("provider@servesync.com");
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
      await login(email, password, "provider");
      navigate("/provider/dashboard");
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
          <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiTool className="text-2xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Provider Login
          </h2>
          <p className="text-gray-500">Manage your services & earnings</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="your@email.com"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded border-gray-300" />
              Remember me
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Want to become a provider?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create an account and apply
          </Link>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
          <p className="text-gray-700 font-medium mb-2">Demo Credentials:</p>
          <p className="text-gray-600">Email: provider@servesync.com</p>
          <p className="text-gray-600">Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin;

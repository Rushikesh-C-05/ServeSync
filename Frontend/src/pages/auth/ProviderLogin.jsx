import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiTool, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const ProviderLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex max-h-[90vh]">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 bg-provider relative">
          <img
            src="/ProviderLoginPageImage.png"
            alt="Provider dashboard"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-slate-900/30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Grow Your Business</h2>
            <p className="text-slate-100">
              Manage bookings and track your earnings
            </p>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-provider rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiTool className="text-2xl text-provider-foreground" />
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
              <Label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300"
                />
                Remember me
              </label>
              <a href="#" className="text-provider hover:text-provider/80">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="provider"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Want to become a provider?{" "}
            <Link
              to="/register"
              className="text-provider hover:text-provider/80 font-medium"
            >
              Create an account and apply
            </Link>
          </div>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default ProviderLogin;

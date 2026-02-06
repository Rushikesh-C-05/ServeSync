import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("servesync_user");
    const storedToken = localStorage.getItem("servesync_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("servesync_user");
        localStorage.removeItem("servesync_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      setError(null);
      setLoading(true);

      let response;
      if (role === "user") {
        response = await authAPI.userLogin(email, password);
      } else if (role === "provider") {
        response = await authAPI.providerLogin(email, password);
      } else if (role === "admin") {
        response = await authAPI.adminLogin(email, password);
      }

      // Backend returns: { success: true, message: "...", data: { token: "...", user: {...} } }
      console.log("Login response:", response.data);
      const apiResponseData = response.data?.data;
      console.log("API Response Data:", apiResponseData);

      // Extract token and user from the AuthResponse
      const token = apiResponseData?.token;
      const userFromResponse = apiResponseData?.user;

      console.log("Token:", token);
      console.log("User from response:", userFromResponse);

      if (!token || !userFromResponse) {
        throw new Error(
          "Invalid response from server - missing token or user data",
        );
      }

      const userData = {
        id: userFromResponse.id,
        name: userFromResponse.name,
        email: userFromResponse.email,
        role: userFromResponse.role?.toLowerCase() || role.toLowerCase(),
        phone: userFromResponse.phone,
        address: userFromResponse.address,
        profileImage: userFromResponse.profileImage || null,
      };

      console.log("User data being stored:", userData);

      setUser(userData);
      localStorage.setItem("servesync_user", JSON.stringify(userData));
      localStorage.setItem("servesync_token", token);
      localStorage.setItem("servesync_userId", userData.id);

      return userData;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.register(userData);
      const data = response.data?.data || response.data;

      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("servesync_user");
    localStorage.removeItem("servesync_token");
    localStorage.removeItem("servesync_userId");
  };

  // Update user profile image in context
  const updateUserImage = (profileImage) => {
    const updatedUser = { ...user, profileImage };
    setUser(updatedUser);
    localStorage.setItem("servesync_user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
    setError,
    updateUserImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import axios from "axios";

// Get the API base URL from environment or use default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("servesync_token");
  const userId = localStorage.getItem("servesync_userId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["X-User-ID"] = userId;
  }

  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on actual 401 from server, not network errors
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      // Unauthorized - clear stored data
      const user = localStorage.getItem("servesync_user");
      let role = "user";

      try {
        if (user) {
          const userData = JSON.parse(user);
          role = userData.role || "user";
        }
      } catch (e) {
        // If parsing fails, use default
      }

      localStorage.removeItem("servesync_token");
      localStorage.removeItem("servesync_user");
      localStorage.removeItem("servesync_userId");

      // Redirect to appropriate login page based on role
      window.location.href = `/login/${role}`;
    }
    return Promise.reject(error);
  },
);

// ==================== AUTH API ====================
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  registerProvider: (data) => apiClient.post("/auth/register/provider", data),
  userLogin: (email, password) =>
    apiClient.post("/auth/login/user", { email, password }),
  providerLogin: (email, password) =>
    apiClient.post("/auth/login/provider", { email, password }),
  adminLogin: (email, password) =>
    apiClient.post("/auth/login/admin", { email, password }),
};

// ==================== USER API ====================
export const userAPI = {
  getDashboardStats: (userId) => apiClient.get(`/user/${userId}/dashboard`),
  getProfile: (userId) => apiClient.get(`/user/${userId}/profile`),
  updateProfile: (userId, data) =>
    apiClient.put(`/user/${userId}/profile`, data),
  bookService: (userId, bookingData) =>
    apiClient.post(`/user/${userId}/bookings`, bookingData),
  getMyBookings: (userId) => apiClient.get(`/user/${userId}/bookings`),
  getBookingDetails: (userId, bookingId) =>
    apiClient.get(`/user/${userId}/bookings/${bookingId}`),
  cancelBooking: (userId, bookingId) =>
    apiClient.patch(`/user/${userId}/bookings/${bookingId}/cancel`),
  submitReview: (userId, reviewData) =>
    apiClient.post(`/user/${userId}/reviews`, reviewData),
  getMyReviews: (userId) => apiClient.get(`/user/${userId}/reviews`),
};

// ==================== PROVIDER API ====================
export const providerAPI = {
  getDashboardStats: (userId) => apiClient.get(`/provider/${userId}/dashboard`),
  register: (userId, providerData) =>
    apiClient.post(`/provider/${userId}/register`, providerData),
  getProfile: (userId) => apiClient.get(`/provider/${userId}/profile`),
  createService: (userId, serviceData) =>
    apiClient.post(`/provider/${userId}/services`, serviceData),
  getMyServices: (userId) => apiClient.get(`/provider/${userId}/services`),
  updateService: (userId, serviceId, data) =>
    apiClient.put(`/provider/${userId}/services/${serviceId}`, data),
  deleteService: (userId, serviceId) =>
    apiClient.delete(`/provider/${userId}/services/${serviceId}`),
  toggleAvailability: (userId, serviceId) =>
    apiClient.patch(`/provider/${userId}/services/${serviceId}/toggle`),
  getBookingRequests: (userId) => apiClient.get(`/provider/${userId}/bookings`),
  acceptBooking: (userId, bookingId) =>
    apiClient.patch(`/provider/${userId}/bookings/${bookingId}/accept`),
  rejectBooking: (userId, bookingId) =>
    apiClient.patch(`/provider/${userId}/bookings/${bookingId}/reject`),
  completeBooking: (userId, bookingId) =>
    apiClient.patch(`/provider/${userId}/bookings/${bookingId}/complete`),
  getEarnings: (userId) => apiClient.get(`/provider/${userId}/earnings`),
  getReviews: (userId) => apiClient.get(`/provider/${userId}/reviews`),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  getDashboardStats: () => apiClient.get("/admin/dashboard"),
  getStats: () => apiClient.get("/admin/stats"),
  getAllUsers: () => apiClient.get("/admin/users"),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  toggleBlockUser: (userId) =>
    apiClient.patch(`/admin/users/${userId}/toggle-block`),
  getAllProviders: () => apiClient.get("/admin/providers"),
  getPendingProviders: () => apiClient.get("/admin/providers/pending"),
  approveProvider: (providerId) =>
    apiClient.patch(`/admin/providers/${providerId}/approve`),
  rejectProvider: (providerId) =>
    apiClient.patch(`/admin/providers/${providerId}/reject`),
  deleteProvider: (providerId) =>
    apiClient.delete(`/admin/providers/${providerId}`),
  getAllServices: () => apiClient.get("/admin/services"),
  getAllBookings: () => apiClient.get("/admin/bookings"),
  getAllPayments: () => apiClient.get("/admin/payments"),
  getPlatformEarnings: () => apiClient.get("/admin/earnings"),
  updatePlatformFee: (percentage) =>
    apiClient.patch("/admin/platform-fee", { percentage }),
  getAllReviews: () => apiClient.get("/admin/reviews"),
  // Category Management
  getCategories: () => apiClient.get("/admin/categories"),
  addCategory: (category) => apiClient.post("/admin/categories", { category }),
  updateCategory: (oldCategory, newCategory) =>
    apiClient.put("/admin/categories", { oldCategory, newCategory }),
  deleteCategory: (category) =>
    apiClient.delete("/admin/categories", { data: { category } }),
};

// ==================== SERVICE API ====================
export const serviceAPI = {
  getAllServices: () => apiClient.get("/service"),
  getServiceById: (serviceId) => apiClient.get(`/service/${serviceId}`),
  searchServices: (params) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiClient.get(`/service/search?${queryParams}`);
  },
  getServicesByCategory: (category) =>
    apiClient.get(`/service/category/${category}`),
};

// ==================== PAYMENT API ====================
export const paymentAPI = {
  createOrder: (bookingId) =>
    apiClient.post("/payment/create-order", { bookingId }),
  verifyPayment: (paymentData) =>
    apiClient.post("/payment/verify", paymentData),
  getPaymentDetails: (paymentId) => apiClient.get(`/payment/${paymentId}`),
  getPaymentByBooking: (bookingId) =>
    apiClient.get(`/payment/booking/${bookingId}`),
  initiateRefund: (paymentId, reason) =>
    apiClient.post(`/payment/${paymentId}/refund`, { reason }),
};

export default apiClient;

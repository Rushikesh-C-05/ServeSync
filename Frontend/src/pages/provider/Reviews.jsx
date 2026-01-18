import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiStar,
  FiMessageSquare,
  FiTrendingUp,
  FiUser,
  FiCalendar,
  FiSend,
  FiX,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import { providerAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Reviews = () => {
  const { user } = useAuth();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const navLinks = [
    { path: "/provider/dashboard", label: "Dashboard" },
    { path: "/provider/services", label: "My Services" },
    { path: "/provider/requests", label: "Booking Requests" },
    { path: "/provider/reviews", label: "Reviews" },
    { path: "/provider/earnings", label: "Earnings" },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await providerAPI.getReviews(user.id);
      setReviewData(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToReview = async (reviewId) => {
    if (!responseText.trim() || responseText.trim().length < 10) {
      toast.error("Response must be at least 10 characters");
      return;
    }

    try {
      setSubmittingResponse(true);
      await providerAPI.respondToReview(user.id, reviewId, responseText.trim());
      toast.success("Response submitted successfully");
      setRespondingTo(null);
      setResponseText("");
      fetchReviews();
    } catch (error) {
      console.error("Error responding to review:", error);
      toast.error(error.response?.data?.message || "Failed to submit response");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const filteredReviews =
    reviewData?.reviews?.filter((review) => {
      if (filter === "all") return true;
      if (filter === "positive") return review.rating >= 4;
      if (filter === "negative") return review.rating <= 2;
      if (filter === "unanswered") return !review.providerResponse?.text;
      return review.rating === parseInt(filter);
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="provider" links={navLinks} />
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = reviewData?.stats || {
    totalReviews: 0,
    averageRating: 0,
    distribution: {},
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="provider" links={navLinks} />

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
            <p className="text-gray-500 mt-1">
              See what your customers are saying about your services
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Average Rating"
              value={stats.averageRating.toFixed(1)}
              icon={FiStar}
              color="amber"
            />
            <StatCard
              title="Total Reviews"
              value={stats.totalReviews}
              icon={FiMessageSquare}
              color="blue"
            />
            <StatCard
              title="5-Star Reviews"
              value={stats.distribution?.[5] || 0}
              icon={FiTrendingUp}
              color="green"
            />
            <StatCard
              title="Response Rate"
              value={`${
                stats.totalReviews > 0
                  ? Math.round(
                      (reviewData?.reviews?.filter(
                        (r) => r.providerResponse?.text,
                      ).length /
                        stats.totalReviews) *
                        100,
                    )
                  : 0
              }%`}
              icon={FiSend}
              color="purple"
            />
          </div>

          {/* Rating Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Rating Distribution
            </h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.distribution?.[rating] || 0;
                const percentage =
                  stats.totalReviews > 0
                    ? (count / stats.totalReviews) * 100
                    : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">
                        {rating}
                      </span>
                      <FiStar className="w-4 h-4 text-amber-500 fill-current" />
                    </div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Reviews" },
                { value: "positive", label: "Positive (4-5⭐)" },
                { value: "negative", label: "Negative (1-2⭐)" },
                { value: "unanswered", label: "Unanswered" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === tab.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {review.userId?.name || "Anonymous"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.serviceId?.name || "Service"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-amber-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {/* Provider Response */}
                  {review.providerResponse?.text ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-blue-900">
                          Your Response
                        </span>
                        <span className="text-xs text-blue-600">
                          {new Date(
                            review.providerResponse.respondedAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">
                        {review.providerResponse.text}
                      </p>
                    </div>
                  ) : respondingTo === review._id ? (
                    /* Response Form */
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response to this review..."
                        rows={3}
                        className="input-field mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText("");
                          }}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <FiX className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRespondToReview(review._id)}
                          disabled={
                            submittingResponse || responseText.length < 10
                          }
                          className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                          <FiSend className="w-4 h-4" />
                          {submittingResponse ? "Sending..." : "Send Response"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Respond Button */
                    <button
                      onClick={() => setRespondingTo(review._id)}
                      className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      Respond to this review
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filter === "all"
                    ? "No reviews yet"
                    : `No ${filter} reviews found`}
                </p>
                {filter === "all" && (
                  <p className="text-gray-400 mt-2">
                    Reviews will appear here when customers rate your services.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;

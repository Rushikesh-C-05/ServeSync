import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiStar,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiAlertTriangle,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import ConfirmDialog from "../../components/ConfirmDialog";
import { adminAPI } from "../../services/api";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const ManageReviews = () => {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllReviews();
      setReviewData(response.data?.data || null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (reviewId) => {
    try {
      await adminAPI.toggleReviewVisibility(reviewId);
      toast.success("Review visibility updated");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await adminAPI.deleteReview(reviewId);
      setDeleteConfirm(null);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const filteredReviews =
    reviewData?.reviews?.filter((review) => {
      // Visibility filter
      if (filter === "visible" && !review.visible) return false;
      if (filter === "hidden" && review.visible) return false;

      // Rating filter
      if (ratingFilter !== "all" && review.rating !== parseInt(ratingFilter))
        return false;

      return true;
    }) || [];

  const stats = reviewData?.stats || {};

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
          <p className="text-gray-500 mt-1">
            Moderate and manage customer reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalReviews || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FiStar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Visible Reviews</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.visibleReviews || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiEye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hidden Reviews</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.hiddenReviews || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiEyeOff className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        {stats.distribution && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Rating Distribution
            </h2>
            <div className="flex items-end gap-4 h-32">
              {[1, 2, 3, 4, 5].map((rating) => {
                const count = stats.distribution[rating] || 0;
                const maxCount = Math.max(...Object.values(stats.distribution));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div
                    key={rating}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        rating >= 4
                          ? "bg-green-500"
                          : rating === 3
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        height: `${height}%`,
                        minHeight: count > 0 ? "8px" : "0",
                      }}
                    />
                    <div className="mt-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium">{rating}</span>
                        <FiStar className="w-3 h-3 text-amber-500 fill-current" />
                      </div>
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Rating:
              </label>
              <Select
                value={ratingFilter}
                onValueChange={(value) => setRatingFilter(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white border rounded-lg p-6 ${
                  review.visible
                    ? "border-gray-200"
                    : "border-red-200 bg-red-50"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.user?.name || "Anonymous"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!review.visible && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Hidden
                      </span>
                    )}
                    <div className="flex items-center gap-0.5">
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
                  </div>
                </div>

                {/* Service & Provider Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span>
                    <strong>Service:</strong>{" "}
                    {review.service?.name || "Unknown"}
                  </span>
                  <span>
                    <strong>Provider:</strong>{" "}
                    {review.provider?.businessName || "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Provider Response */}
                {review.providerResponse?.text && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-900">
                        Provider Response
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
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleToggleVisibility(review.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {review.visible ? (
                      <>
                        <FiEyeOff className="w-4 h-4" />
                        Hide Review
                      </>
                    ) : (
                      <>
                        <FiEye className="w-4 h-4" />
                        Show Review
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm(review.id)}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === review.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FiAlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">
                          Are you sure you want to delete this review?
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          This action cannot be undone.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => handleDeleteReview(review.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Yes, Delete
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(null)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews found</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter !== "all" || ratingFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Reviews will appear here when customers rate services"}
              </p>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteReview(deleteConfirm)}
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          confirmText="Delete"
          confirmStyle="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default ManageReviews;

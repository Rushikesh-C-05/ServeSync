import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiStar, FiArrowLeft, FiCheck, FiAlertCircle } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";

const WriteReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const navLinks = [
    { path: "/user/dashboard", label: "Dashboard" },
    { path: "/user/services", label: "Browse Services" },
    { path: "/user/bookings", label: "My Bookings" },
  ];

  useEffect(() => {
    loadBookingAndCheckReview();
  }, [bookingId]);

  const loadBookingAndCheckReview = async () => {
    try {
      setLoading(true);

      // Load booking details
      const bookingResponse = await userAPI.getBookingDetails(
        user.id,
        bookingId,
      );
      const bookingData = bookingResponse.data?.data || bookingResponse.data;
      setBooking(bookingData);

      // Check if user can review
      const reviewCheckResponse = await userAPI.canReviewBooking(
        user.id,
        bookingId,
      );
      const reviewCheckData =
        reviewCheckResponse.data?.data || reviewCheckResponse.data;

      setCanReview(reviewCheckData.canReview);
      if (reviewCheckData.review) {
        setExistingReview(reviewCheckData.review);
      }
    } catch (error) {
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const reviewData = {
        serviceId:
          booking.service?.id || booking.serviceId?.id || booking.serviceId,
        providerId:
          booking.provider?.id || booking.providerId?.id || booking.providerId,
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
      };

      await userAPI.submitReview(user.id, reviewData);

      // Show success and redirect
      toast.success("Thank you for your review!");
      navigate("/user/bookings");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (value) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return labels[value] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Booking not found</p>
          <Button
            onClick={() => navigate("/user/bookings")}
            variant="user"
            className="mt-4"
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  // Already reviewed
  if (existingReview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/user/bookings")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Bookings
          </button>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Already Reviewed
            </h2>
            <p className="text-gray-600 mb-6">
              You have already submitted a review for this booking.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= existingReview.rating
                        ? "text-amber-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({existingReview.rating}/5)
                </span>
              </div>
              <p className="text-gray-700">{existingReview.comment}</p>
              <p className="text-sm text-gray-500 mt-3">
                Submitted on{" "}
                {new Date(existingReview.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Button
              onClick={() => navigate("/user/bookings")}
              variant="user"
              className="mt-6"
            >
              Back to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Can't review (not completed)
  if (!canReview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/user/bookings")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Bookings
          </button>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <FiAlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cannot Review Yet
            </h2>
            <p className="text-gray-600 mb-6">
              This booking must be completed before you can leave a review.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Current status:{" "}
              <span className="font-semibold capitalize">{booking.status}</span>
            </p>
            <Button onClick={() => navigate("/user/bookings")} variant="user">
              Back to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/user/bookings")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Bookings
        </button>

        {/* Service Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Review Your Experience
          </h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.serviceId?.name || "Service"}
              </h3>
              <p className="text-sm text-gray-600">
                Provider: {booking.provider?.businessName || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Completed on{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmitReview}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate this service?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <FiStar
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? "text-amber-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {(hoveredRating || rating) > 0 && (
                  <span className="ml-3 text-lg font-medium text-gray-700">
                    {getRatingLabel(hoveredRating || rating)}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write your review
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Share your experience with this service. What did you like? What could be improved?"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters ({comment.length}/10)
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Guidelines */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Review Guidelines
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be honest and specific about your experience</li>
                <li>• Focus on the service quality and professionalism</li>
                <li>• Avoid personal information or offensive language</li>
                <li>• Your review helps other users make informed decisions</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => navigate("/user/bookings")}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || rating === 0 || comment.length < 10}
                variant="user"
                className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;

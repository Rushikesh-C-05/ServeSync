import { useState, useEffect } from "react";
import { FiStar, FiChevronDown } from "react-icons/fi";
import ReviewCard from "./ReviewCard";
import { serviceAPI } from "../services/api";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

const ServiceReviews = ({ serviceId }) => {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recent");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [serviceId, sort]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getServiceReviews(serviceId, {
        page: 1,
        limit: 5,
        sort,
      });
      setReviewData(response.data?.data || null);
      setPage(1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReviews = async () => {
    if (!reviewData?.pagination?.hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await serviceAPI.getServiceReviews(serviceId, {
        page: nextPage,
        limit: 5,
        sort,
      });
      const newData = response.data?.data;

      if (newData) {
        setReviewData((prev) => ({
          ...newData,
          reviews: [...prev.reviews, ...newData.reviews],
        }));
        setPage(nextPage);
      }
    } catch (error) {
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return null;
  }

  const { reviews, stats, pagination } = reviewData;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats?.averageRating || 0)
                      ? "text-amber-500 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">
              {stats?.averageRating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-500">
              ({stats?.totalReviews || 0} reviews)
            </span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <Select value={sort} onValueChange={(value) => setSort(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rating Distribution */}
      {stats?.distribution && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percentage =
                stats.totalReviews > 0
                  ? Math.round((count / stats.totalReviews) * 100)
                  : 0;
              return (
                <div key={rating} className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    {rating}{" "}
                    <FiStar className="w-3 h-3 text-amber-500 fill-current" />
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Load More */}
          {pagination?.hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={loadMoreReviews}
                disabled={loadingMore}
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <FiChevronDown className="w-4 h-4" />
                    Load More Reviews
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to review this service!
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceReviews;

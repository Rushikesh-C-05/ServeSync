import { FiStar, FiUser, FiCalendar } from "react-icons/fi";

const ReviewCard = ({ review, showServiceName = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            {review.user?.profileImage ? (
              <img
                src={review.user.profileImage}
                alt={review.user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user?.name || "Anonymous"}
            </h4>
            {showServiceName && review.service?.name && (
              <p className="text-sm text-gray-500">{review.service.name}</p>
            )}
          </div>
        </div>
        <div className="text-right">
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
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
            <FiCalendar className="w-3 h-3" />
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

      {/* Provider Response */}
      {review.providerResponse?.text && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
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
    </div>
  );
};

export default ReviewCard;

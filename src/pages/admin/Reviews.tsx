import React, { useEffect, useState } from "react";
import { api } from "../../congif/api"; // your axios instance
import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";
import { ReviewListSchema, type Review } from "../../validation/reviewSchema";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/reviews/all");
      console.log("data : ", response);

      const parsed = ReviewListSchema.parse(response.data.data);
      setReviews(parsed);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  // If error
  if (error) return <GlobalError message={error} onRetry={fetchReviews} />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {loading && <LoadingOverlay />}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Reviews</h1>
          <p className="text-gray-600 mt-1">
            View all user-submitted reviews and ratings for books.
          </p>
        </div>

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-gray-900">
              No reviews found
            </h3>
            <p className="text-gray-500">
              Reviews will appear here once users submit them.
            </p>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {review.bookId?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    by {review.userId?.name}
                  </p>
                </div>

                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 -mt-2 mb-2">
                Email: {review.userId?.email}
              </div>

              {/* Review text */}
              <p className="text-gray-700">{review.review}</p>

              {/* Footer */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

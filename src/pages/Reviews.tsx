import React, { useState, useEffect } from 'react';
import type { Review } from '../types';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-2xl font-bold text-gray-900">Book Reviews</h1> */}
        <p className="text-gray-600">Manage user reviews and ratings</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {review.book?.title}
                </h3>
                <p className="text-gray-600">by {review.user?.name}</p>
              </div>
              <div className="text-right">
                {renderStars(review.rating)}
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.review}</p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Email: {review.user?.email}</span>
              </div>
              <button
                onClick={() => handleDeleteReview(review._id)}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Delete Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⭐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">User reviews will appear here once they are submitted.</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
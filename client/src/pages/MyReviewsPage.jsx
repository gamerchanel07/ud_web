import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/api';
import { ReviewList } from '../components/Review';
import { Star } from 'lucide-react';

export const MyReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getUserReviews();
      setReviews(response.data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12 text-gray-200">Please login to view your reviews</div>;
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-in-down">
        <h1 className="text-4xl font-bold mb-8 text-gray-100">My Reviews</h1>

        {loading ? (
          <div className="text-center py-8 text-gray-200 animate-pulse">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-300 animate-bounce-in">
            You haven't written any reviews yet
          </div>
        ) : (
          <div className="space-y-4 animate-stagger">
            {reviews.map(review => (
              <div key={review.id} className="glass glass-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-100">{review.Hotel?.name}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-yellow-400 mb-2 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400" />
                  ))}
                </p>
                <p className="text-gray-200">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

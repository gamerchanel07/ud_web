import React, { useState } from 'react';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

export const ReviewForm = ({ hotelId, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add a review');
      return;
    }

    setLoading(true);
    try {
      await reviewService.create({
        hotelId,
        rating: parseInt(rating),
        comment,
        images: []
      });
      setRating(5);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-ocean-600/20 border border-ocean-400/50 p-4 rounded mb-6">
        <p className="text-ocean-200">Please <a href="/login" className="underline font-bold text-ocean-300">login</a> to add a review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass glass-lg p-6 rounded-lg mb-6 animate-slide-in-up card-enter">
      <h3 className="text-lg font-bold mb-4 text-gray-100 animate-slide-in-down">Write a Review</h3>

      {error && <div className="bg-red-500/30 text-red-200 p-3 rounded mb-4 border border-red-500/50">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-200">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border border-white/20 rounded bg-white/10 text-ocean-300 focus:border-ocean-400"
        >
          <option value="5">★★★★★ Excellent</option>
          <option value="4">★★★★ Good</option>
          <option value="3">★★★ Average</option>
          <option value="2">★★ Poor</option>
          <option value="1">★ Terrible</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-200">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-2 border border-white/20 rounded bg-white/10 text-gray-100 placeholder-gray-400 focus:border-ocean-400"
          rows="4"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-ocean-600 to-blue-600 text-white py-2 px-4 rounded hover:from-ocean-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export const ReviewList = ({ reviews, onReviewDeleted }) => {
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (reviewId) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setDeletingId(reviewId);
      try {
        await reviewService.delete(reviewId);
        if (onReviewDeleted) onReviewDeleted();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete review');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!reviews || reviews.length === 0) {
    return <div className="text-center text-gray-300 py-8">No reviews yet</div>;
  }

  return (
    <div className="space-y-4 animate-stagger">
      {reviews.map(review => (
        <div key={review.id} className="glass glass-lg border border-white/20 rounded-lg p-4 card-enter hover-lift">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-gray-100">
                {review.User?.username}
              </h4>
              <p className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-yellow-400 flex gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400" />
              ))}
            </span>
          </div>
          <p className="text-gray-200 mb-3">{review.comment}</p>
          {user && (user.role === 'admin' || user.id === review.userId) && (
            <button
              onClick={() => handleDelete(review.id)}
              disabled={deletingId === review.id}
              className="text-red-400 hover:text-red-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {deletingId === review.id ? 'Deleting...' : 'Delete Review'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

import React, { useState } from 'react';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Send, Trash2, LogIn } from 'lucide-react';

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
      <div style={{
        backgroundColor: 'rgba(0, 173, 181, 0.1)',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1.5rem',
        border: '1px solid var(--primary-main)'
      }}>
        <p style={{color: 'var(--text-secondary)'}}>กรุณา <a href="/login" style={{color: 'var(--primary-main)', textDecoration: 'underline', fontWeight: 'bold'}}>เข้าสู่ระบบ</a> เพื่อเพิ่มรีวิว</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      border: '1px solid var(--border-light)'
    }}>
      <h3 style={{color: 'var(--text-primary)'}} className="text-lg font-bold mb-4 animate-slide-in-down">เขียนรีวิว</h3>

      {error && <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#EF4444',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        border: '1px solid rgba(239, 68, 68, 0.5)'
      }}>{error}</div>}

      <div className="mb-4">
        <label style={{color: 'var(--text-primary)'}} className="block text-sm font-bold mb-2">คะแนน:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)'
          }}
        >
          <option value="5">★★★★★ ยอดเยี่ยม</option>
          <option value="4">★★★★ ดี</option>
          <option value="3">★★★ ปานกลาง</option>
          <option value="2">★★ แย่</option>
          <option value="1">★ แย่มาก</option>
        </select>
      </div>

      <div className="mb-4">
        <label style={{color: 'var(--text-primary)'}} className="block text-sm font-bold mb-2">ความเห็น:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="แบ่งปันประสบการณ์ของคุณ..."
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)'
          }}
          rows="4"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? 'rgba(107, 114, 128, 0.5)' : 'var(--primary-main)',
          color: 'white',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          borderRadius: '0.375rem',
          border: 'none',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
      >
        {loading ? '⏳ กำลังส่ง...' : (<><Send size={16} /> ส่งรีวิว</>)}
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
    return <div style={{textAlign: 'center', color: 'var(--text-secondary)', paddingTop: '2rem', paddingBottom: '2rem'}}>ยังไม่มีรีวิว</div>;
  }

  return (
    <div className="space-y-4 animate-stagger">
      {reviews.map(review => (
        <div key={review.id} style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '0.5rem',
          padding: '1rem',
          border: '1px solid var(--border-light)',
          borderLeft: '4px solid var(--primary-main)'
        }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 style={{color: 'var(--text-primary)'}} className="font-bold">
                {review.User?.username}
              </h4>
              <p style={{color: 'var(--text-tertiary)', fontSize: '0.875rem'}}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span style={{color: 'var(--primary-main)'}} className="flex gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} fill="var(--primary-main)" style={{color: 'var(--primary-main)'}} />
              ))}
            </span>
          </div>
          <p style={{color: 'var(--text-secondary)', marginBottom: '0.75rem'}}>{review.comment}</p>
          {user && (user.role === 'admin' || user.id === review.userId) && (
            <button
              onClick={() => handleDelete(review.id)}
              disabled={deletingId === review.id}
              style={{
                color: '#EF4444',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: deletingId === review.id ? 'not-allowed' : 'pointer',
                opacity: deletingId === review.id ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => !deletingId && (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => !deletingId && (e.currentTarget.style.opacity = '1')}
            >
              {deletingId === review.id ? '⏳ กำลังลบ...' : (<><Trash2 size={16} /> ลบรีวิว</>)}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

import React, { useState } from 'react';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Send, Trash2, LogIn, Loader } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="card" style={{
      backgroundColor: 'var(--bg-secondary)',
      marginBottom: 'var(--spacing-lg)'
    }}>
      <h3 style={{
        color: 'var(--text-primary)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-bold)',
        marginBottom: 'var(--spacing-md)',
        marginTop: 0
      }} className="animate-slide-in-down">เขียนรีวิว</h3>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: 'var(--color-error)',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-md)',
          border: '2px solid var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: 'var(--text-sm)'
        }}>
          <div style={{width: '4px', height: '4px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-error)'}} />
          {error}
        </div>
      )}

      <div style={{marginBottom: 'var(--spacing-md)'}}>
        <label className="form-label required">คะแนน:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="form-input"
        >
          <option value="5">★★★★★ ยอดเยี่ยม</option>
          <option value="4">★★★★ ดี</option>
          <option value="3">★★★ ปานกลาง</option>
          <option value="2">★★ แย่</option>
          <option value="1">★ แย่มาก</option>
        </select>
      </div>

      <div style={{marginBottom: 'var(--spacing-md)'}}>
        <label className="form-label required">ความเห็น:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="แบ่งปันประสบการณ์ของคุณ..."
          className="form-input"
          style={{ minHeight: '100px', resize: 'vertical' }}
          rows="4"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {loading ? (<><Loader size={16} className="animate-spin" /> กำลังส่ง...</>) : (<><Send size={16} /> ส่งรีวิว</>)}
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
    return (
      <div style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        padding: 'var(--spacing-lg)',
        fontSize: 'var(--text-base)'
      }}>
        ยังไม่มีรีวิว
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--spacing-md)'
    }} className="animate-stagger">
      {reviews.map(review => (
        <div key={review.id} className="card" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '4px solid var(--primary-main)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <div>
              <h4 style={{
                color: 'var(--text-primary)',
                fontWeight: 'var(--font-bold)',
                margin: 0,
                marginBottom: 'var(--spacing-xs)'
              }}>
                {review.User?.username}
              </h4>
              <p style={{
                color: 'var(--text-tertiary)',
                fontSize: 'var(--text-xs)',
                margin: 0
              }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div style={{
              color: 'var(--primary-main)',
              display: 'flex',
              gap: 'var(--spacing-xs)'
            }}>
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} fill="var(--primary-main)" style={{color: 'var(--primary-main)'}} />
              ))}
            </div>
          </div>

          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-sm)',
            margin: 0,
            marginBottom: 'var(--spacing-sm)'
          }}>
            {review.comment}
          </p>

          {user && (user.role === 'admin' || user.id === review.userId) && (
            <button
              onClick={() => handleDelete(review.id)}
              disabled={deletingId === review.id}
              style={{
                color: 'var(--color-error)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: deletingId === review.id ? 'not-allowed' : 'pointer',
                opacity: deletingId === review.id ? 0.5 : 1,
                transition: 'opacity 0.2s',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}
              onMouseEnter={(e) => !deletingId && (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => !deletingId && (e.currentTarget.style.opacity = '1')}
            >
              {deletingId === review.id ? (<><Loader size={14} className="animate-spin" /> กำลังลบ...</>) : (<><Trash2 size={14} /> ลบรีวิว</>)}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/api';
import { ReviewList } from '../components/Review';
import { Star, Building2, Calendar } from 'lucide-react';

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
    return <div style={{textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: 'var(--text-secondary)'}}>กรุณาเข้าสู่ระบบเพื่อดูรีวิวของคุณ</div>;
  }

  return (
    <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh'}} className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-in-down">
        <h1 style={{color: 'var(--text-primary)', fontSize: '2.25rem'}} className="font-bold mb-8">รีวิวของฉัน</h1>

        {loading ? (
          <div style={{textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: 'var(--text-secondary)'}} className="animate-pulse">⏳ กำลังโหลดรีวิว...</div>
        ) : reviews.length === 0 ? (
          <div style={{textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: 'var(--text-tertiary)'}} className="animate-bounce-in">
            คุณยังไม่ได้เขียนรีวิวใดๆ
          </div>
        ) : (
          <div className="space-y-4 animate-stagger">
            {reviews.map(review => (
              <div key={review.id} style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                border: '1px solid var(--border-light)',
                borderLeft: '4px solid var(--primary-main)'
              }}>
                <h3 style={{color: 'var(--text-primary)', fontSize: '1.25rem'}} className="font-bold mb-2">🏨 {review.Hotel?.name}</h3>
                <p style={{color: 'var(--text-tertiary)', fontSize: '0.875rem'}} className="mb-2">
                  📅 {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p style={{color: 'var(--primary-main)', marginBottom: '0.5rem'}} className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--primary-main)" style={{color: 'var(--primary-main)'}} />
                  ))}
                </p>
                <p style={{color: 'var(--text-secondary)'}}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

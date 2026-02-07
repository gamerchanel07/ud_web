import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { reviewService } from '../services/api';
import { ReviewList } from '../components/Review';
import { SkeletonList, SkeletonCard } from '../components/Skeleton';
import { Star, Building2, Calendar, Loader } from 'lucide-react';

export const MyReviewsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
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
      <div style={{maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)', paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-lg)'}} className="animate-slide-in-down">
        <h1 style={{color: 'var(--text-primary)', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--spacing-2xl)'}}>รีวิวของฉัน</h1>

        {loading ? (
          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)'}}>
            <SkeletonList />
            <SkeletonList />
            <SkeletonList />
          </div>
        ) : reviews.length === 0 ? (
          <div style={{textAlign: 'center', paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)'}}>
            <Star size={80} style={{margin: '0 auto', marginBottom: 'var(--spacing-md)', color: 'var(--primary-main)', opacity: 0.5}} />
            <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-lg)'}}>{t('myReviews.empty')}</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)'}} className="animate-stagger">
            {reviews.map(review => (
              <div key={review.id} className="card hover:shadow-lg transition-all duration-300" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderLeft: '4px solid var(--primary-main)',
                padding: 'var(--spacing-lg)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)'}}>
                  <h3 style={{color: 'var(--text-primary)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)'}}>
                    <Building2 size={24} />
                    {review.Hotel?.name}
                  </h3>
                  <p style={{color: 'var(--primary-main)', display: 'flex', gap: 'var(--spacing-xs)'}}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        style={{
                          color: i < review.rating ? 'var(--primary-main)' : 'var(--border-light)',
                          fill: i < review.rating ? 'currentColor' : 'none'
                        }}
                      />
                    ))}
                  </p>
                </div>
                <p style={{color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)'}}>
                  <Calendar size={16} />
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { SkeletonGrid } from '../components/Skeleton';
import { Heart, Star, Lightbulb } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const getImageUrl = (path) => {
  if (!path) return '/no-image.png';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

const getMainImage = (hotel) =>
  hotel.imageUrl ||
  (Array.isArray(hotel.galleryImages) && hotel.galleryImages.length > 0
    ? hotel.galleryImages[0]
    : null);





 const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(res.data || []);
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (hotelId) => {
    try {
      await API.delete(`/favorites/${hotelId}`);
      setFavorites((prev) => prev.filter((h) => h.id !== hotelId));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  if (loading) {
    return (
      <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)'}}>
        <div style={{maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)'}}>
          <SkeletonGrid columns={3} count={6} />
        </div>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)'}}>
      <div style={{maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)'}}>
        {/* Header */}
        <div style={{marginBottom: 'var(--spacing-2xl)'}} className="animate-slide-in-down">
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}>
            <Heart size={40} fill="currentColor" style={{color: '#d946ef'}} />
            <span>โรงแรมโปรด</span>
          </h1>
          <p style={{fontSize: 'var(--text-lg)', color: 'var(--text-secondary)'}}>
            {favorites.length} โรงแรมที่บันทึกไว้
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div style={{textAlign: 'center', paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)'}}>
            <Lightbulb size={80} style={{margin: '0 auto', marginBottom: 'var(--spacing-md)', color: 'var(--primary-main)', opacity: 0.5}} />
            <p style={{fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)'}}>
              ยังไม่มีโรงแรมที่บันทึกไว้
            </p>
            <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)'}}>
              ไปหาโรงแรมที่ชอบและบันทึกไว้ได้เลย
            </p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-lg)'}} className="animate-stagger">
            {favorites.map((fav) => {
              const hotel = fav.Hotel || fav;
              const mainImage = getMainImage(hotel);

              return (
                <div
                  key={hotel.id}
                  className="card hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderTop: '4px solid var(--primary-main)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Image */}
                  <div style={{position: 'relative', height: '12rem', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)'}}>
                    <img
                      src={getImageUrl(mainImage)}
                      alt={hotel.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-out',
                        transform: 'scale(1)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onError={(e) => {
                        e.currentTarget.src = '/no-image.png';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{padding: 'var(--spacing-md)'}}>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-bold)',
                      marginBottom: 'var(--spacing-sm)',
                      color: 'var(--text-primary)'
                    }}>
                      {hotel.name}
                    </h3>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      marginBottom: 'var(--spacing-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      color: 'var(--text-secondary)'
                    }}>
                      <Heart size={16} /> {hotel.location}
                    </p>

                    {/* Price */}
                    <p style={{
                      fontWeight: 'var(--font-bold)',
                      fontSize: 'var(--text-lg)',
                      marginBottom: 'var(--spacing-md)',
                      color: 'var(--primary-main)'
                    }}>
                      ฿{Number(hotel.price ?? 0).toLocaleString()}
                    </p>

                    {/* Rating */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      marginBottom: 'var(--spacing-md)'
                    }}>
                      <div style={{display: 'flex'}}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            style={{
                              color: i < Math.round(hotel.avgRating ?? 0) ? '#FFD700' : 'var(--border-light)',
                              fill: i < Math.round(hotel.avgRating ?? 0) ? 'currentColor' : 'none'
                            }}
                          />
                        ))}
                      </div>
                      <span style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>
                        {Number(hotel.avgRating ?? 0).toFixed(1)} ({hotel.reviewCount ?? 0})
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{display: 'flex', gap: 'var(--spacing-sm)'}}>
                      <button
                        onClick={() => navigate(`/hotel/${hotel.id}`)}
                        className="btn btn-primary"
                        style={{flex: 1}}
                      >
                        ดูรายละเอียด
                      </button>

                      <button
                        onClick={() => handleRemoveFavorite(hotel.id)}
                        style={{
                          padding: 'var(--spacing-sm)',
                          backgroundColor: 'rgba(217, 70, 239, 0.2)',
                          color: '#d946ef',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(217, 70, 239, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(217, 70, 239, 0.2)';
                        }}
                      >
                        <Heart size={20} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

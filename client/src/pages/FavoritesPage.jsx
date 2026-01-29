import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Heart, Star } from 'lucide-react';

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
      <div className="text-center py-12 animate-pulse" style={{color: 'var(--text-secondary)'}}>
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-12 animate-slide-in-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3">
            <Heart size={40} className="fill-current" style={{color: '#d946ef'}} />
            <span>โรงแรมโปรด</span>
          </h1>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>
            {favorites.length} โรงแรมที่บันทึกไว้
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-xl" style={{color: 'var(--text-secondary)'}}>
              ยังไม่มีโรงแรมที่บันทึกไว้
            </p>
            <p className="text-sm mt-2" style={{color: 'var(--text-tertiary)'}}>
              ไปหาโรงแรมที่ชอบและบันทึกไว้ได้เลย
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {favorites.map((fav) => {
              const hotel = fav.Hotel || fav;
              const mainImage = getMainImage(hotel);

              return (
                <div
                  key={hotel.id}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderTop: '4px solid var(--primary-main)',
                    backgroundColor: 'var(--bg-primary)'
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br" style={{backgroundImage: 'linear-gradient(to bottom right, #E3FDFD, #CBF1F5)'}}>
                    <img
                      src={getImageUrl(mainImage)}
                      alt={hotel.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/no-image.png';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2" style={{color: 'var(--text-primary)'}}>
                      {hotel.name}
                    </h3>
                    <p className="text-sm mb-3" style={{color: 'var(--text-secondary)'}}>
                      📍 {hotel.location}
                    </p>

                    {/* Price */}
                    <p className="font-bold text-lg mb-3" style={{color: 'var(--primary-main)'}}>
                      ฿{Number(hotel.price ?? 0).toLocaleString()}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-current"
                            style={{color: i < Math.round(hotel.avgRating ?? 0) ? '#FFD700' : 'var(--border-light)'}}
                          />
                        ))}
                      </div>
                      <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                        {Number(hotel.avgRating ?? 0).toFixed(1)} ({hotel.reviewCount ?? 0} รีวิว)
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/hotel/${hotel.id}`)}
                        className="flex-1 py-2 rounded-lg font-semibold transition-all duration-200 text-white hover:opacity-90"
                        style={{backgroundColor: 'var(--primary-main)'}}
                      >
                        ดูรายละเอียด
                      </button>

                      <button
                        onClick={() => handleRemoveFavorite(hotel.id)}
                        className="px-3 rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: 'rgba(217, 70, 239, 0.2)',
                          color: '#d946ef'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(217, 70, 239, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(217, 70, 239, 0.2)';
                        }}
                      >
                        <Heart size={20} className="fill-current" />
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

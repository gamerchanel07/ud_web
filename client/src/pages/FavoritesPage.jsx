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
    return <div className="text-center py-12 text-gray-300">Loading favorites...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="text-red-500 fill-red-500" />
        My Favorite Hotels
      </h1>

      {favorites.length === 0 ? (
        <div className="text-gray-400 text-center">No favorite hotels yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const hotel = fav.Hotel || fav;
            const mainImage = getMainImage(hotel);


            return (
              <div
                key={hotel.id}
                className="glass glass-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(mainImage)}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/no-image.png';
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-100 mb-1">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {hotel.location}
                  </p>

                  {/* PRICE */}
                  <p className="text-pink-300 font-bold text-lg mb-2">
                    ฿{Number(hotel.price ?? 0).toLocaleString()}
                  </p>

                  {/* RATING */}
                  <div className="flex items-center gap-2 text-yellow-400 mb-4">
                    <Star size={18} className="fill-yellow-400" />
                    {Number(hotel.avgRating ?? 0).toFixed(1)}
                    <span className="text-sm text-gray-400">
                      ({hotel.reviewCount ?? 0} reviews)
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/hotel/${hotel.id}`)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleRemoveFavorite(hotel.id)}
                      className="px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Heart className="fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

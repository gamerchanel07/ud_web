import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoriteService } from '../services/api';
import { HotelList } from '../components/HotelCard';
import { Heart } from 'lucide-react';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getAll();
      setFavorites(response.data.map(f => f.Hotel));
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (hotelId) => {
    try {
      await favoriteService.remove(hotelId);
      setFavorites(favorites.filter(h => h.id !== hotelId));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-in-down">
        <h1 className="text-4xl font-bold mb-8 text-gray-100 flex items-center gap-3">
          <Heart size={40} className="fill-red-500 text-red-500" />
          My Favorite Hotels
        </h1>

        {loading ? (
          <div className="text-center py-8 text-gray-200 animate-pulse">Loading favorites...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 text-gray-300 animate-bounce-in">
            <p className="mb-4">No favorite hotels yet</p>
            <a href="/" className="text-primary font-bold hover:underline">
              Browse all hotels
            </a>
          </div>
        ) : (
          <div className="animate-stagger">
            <HotelList
              hotels={favorites}
              onFavoriteToggle={handleRemoveFavorite}
              favorites={favorites.map(h => h.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

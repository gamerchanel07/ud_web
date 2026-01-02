import React, { useState, useEffect } from 'react';
import { hotelService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HotelMap } from '../components/HotelMap';
import { HotelList } from '../components/HotelCard';
import { AnnouncementPopup } from '../components/AnnouncementPopup';
import { Building2, MapPin } from 'lucide-react';

export const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: '',
    hotelType: '',
    nearbyPlace: ''
  });

  // Udon Thani Tech College coordinates (consistent)
  const TECH_COLLEGE_LAT = 17.41604449545236;
  const TECH_COLLEGE_LNG = 102.78876831049472;

  useEffect(() => {
    loadHotels();
    if (user) loadFavorites();
    initializeGPS();
  }, [user]);

  const initializeGPS = () => {
    console.log('Requesting geolocation...');
    if (!navigator.geolocation) {
      alert(t('homePage.gpsError'));
      console.log('Geolocation API not supported');
      return;
    }

    setGpsLoading(true);
    const timeoutId = setTimeout(() => {
      setGpsLoading(false);
      alert(t('homePage.gpsTimeout'));
      console.log('Geolocation request timed out');
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGpsLoading(false);
        console.log('Geolocation success:', latitude, longitude);
      },
      (error) => {
        clearTimeout(timeoutId);
        let errorMsg = 'Could not get location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permission denied. Please enable location access in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'GPS signal not available. Try again in an open area.';
            break;
          case error.TIMEOUT:
            errorMsg = 'GPS request timed out. Please try again.';
            break;
        }
        console.log('GPS Error:', errorMsg, error);
        setGpsLoading(false);
      },
      { 
        timeout: 15000, 
        enableHighAccuracy: true,  // Request high accuracy GPS
        maximumAge: 0  // Don't cache location
      }
    );
  };

  const loadHotels = async () => {
    try {
      const response = await hotelService.getAll();
      setHotels(response.data);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error('Failed to load hotels', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getAll();
      setFavorites(response.data.map(f => f.hotelId));
    } catch (err) {
      console.error('Failed to load favorites', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    try {
      const response = await hotelService.search(searchQuery);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const response = await hotelService.filter(filters);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error('Filter failed', err);
    }
  };

  const handleFavoriteToggle = async (hotelId) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (favorites.includes(hotelId)) {
        await favoriteService.remove(hotelId);
        setFavorites(favorites.filter(id => id !== hotelId));
      } else {
        await favoriteService.add(hotelId);
        setFavorites([...favorites, hotelId]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <AnnouncementPopup />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 md:py-12 animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Building2 size={40} />
            Udon Thani Hotels
          </h1>
          <p className="text-sm md:text-lg text-gray-100">ค้นหา โรงแรมและที่พัก ที่ถูกใจคุณ</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 animate-slide-in-up">
        {/* GPS Status Bar */}
        {userLocation && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-green-700 flex items-center gap-2">
              <MapPin size={16} className="text-green-600 animate-pulse" />
              📍 Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
            <button
              onClick={initializeGPS}
              disabled={gpsLoading}
              className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {gpsLoading ? 'Getting Location...' : 'Update Location'}
            </button>
          </div>
        )}
        {!userLocation && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-amber-700 flex items-center gap-2">
              ⚠️ Enable location for distance calculations and better hotel search
              <br />
              <span className="text-xs text-amber-600 mt-1">Make sure GPS is ON and app has permission to access location</span>
            </span>
            <button
              onClick={initializeGPS}
              disabled={gpsLoading}
              className="text-xs bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 disabled:opacity-50 whitespace-nowrap ml-2"
            >
              {gpsLoading ? 'Detecting...' : 'Enable GPS'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="lg:col-span-2">
            <div className="flex gap-2 flex-col md:flex-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels, locations..."
                className="flex-1 p-3 border rounded-lg text-sm"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Box */}
          <form onSubmit={handleFilter} className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="p-2 border rounded text-xs md:text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="p-2 border rounded text-xs md:text-sm"
              />
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                className="p-2 border rounded text-xs md:text-sm"
              >
                <option value="">Min Rating</option>
                <option value="1">1+ stars</option>
                <option value="2">2+ stars</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
              </select>
              <button
                type="submit"
                className="bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-orange-600"
              >
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Map View */}
        {filteredHotels.length > 0 && (
          <div className="mb-12 animate-fade-in relative z-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">Map View</h2>
            <HotelMap hotels={filteredHotels} userLocation={userLocation} />
          </div>
        )}

        {/* Hotel Listing */}
        <div className="animate-slide-in-up">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-100">Hotel Listings</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-200">Loading hotels...</div>
          ) : (
            <HotelList
              hotels={filteredHotels}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
              userLocation={userLocation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

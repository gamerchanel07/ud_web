import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';

// Udon Thani Tech College coordinates (consistent)
const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export const HotelCard = ({ hotel, onFavoriteToggle, isFavorited, userLocation }) => {
  const navigate = useNavigate();

  const distanceFromCollege = calculateDistance(
    TECH_COLLEGE_LAT,
    TECH_COLLEGE_LNG,
    hotel.latitude,
    hotel.longitude
  );

  const distanceFromUser = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hotel.latitude,
        hotel.longitude
      )
    : null;

  return (
    <div className="hotel-card group card-enter">
      <div className="relative overflow-hidden">
        <img 
          src={hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages[0] : hotel.imageUrl} 
          alt={hotel.name} 
          className="group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>
      <div className="hotel-info">
        <h3 className="font-bold text-lg text-gray-100 group-hover:text-purple-300 transition-colors">{hotel.name}</h3>
        <p className="text-sm text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">{hotel.location}</p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300">
            ฿{hotel.price.toLocaleString()}
          </span>
          <button
            onClick={() => onFavoriteToggle(hotel.id)}
            className={`transition-all duration-200 flex items-center justify-center ${
              isFavorited ? 'text-red-500 hover:scale-125 glow' : 'text-gray-400 hover:text-red-500 hover:scale-125'
            }`}
          >
            {isFavorited ? (
              <Heart size={28} className="fill-red-500 text-red-500" />
            ) : (
              <Heart size={28} className="text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-yellow-400 group-hover:scale-110 transition-transform duration-200 inline-flex items-center gap-1">
            <Star size={20} className="fill-yellow-400" /> {hotel.avgRating || 0}
          </span>
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">({hotel.reviewCount || 0} reviews)</span>
        </div>

        {/* Distance Information */}
        <div className="space-y-2 mb-3 text-sm">
          {/* Distance from Tech College */}
          <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors">
            <MapPin size={16} className="text-blue-400" />
            <span> {distanceFromCollege} km from Tech College</span>
          </div>

          {/* Distance from User */}
          {distanceFromUser && (
            <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors">
              <MapPin size={16} className="text-green-400" />
              <span> {distanceFromUser} km from you</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/hotel/${hotel.id}`)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all duration-300 glow hover:glow-lg hover-lift"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export const HotelList = ({ hotels, onFavoriteToggle, favorites, userLocation }) => {
  if (!hotels || hotels.length === 0) {
    return <div className="text-center py-8 text-gray-400">No hotels found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-stagger">
      {hotels.map(hotel => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={favorites.includes(hotel.id)}
          userLocation={userLocation}
        />
      ))}
    </div>
  );
};

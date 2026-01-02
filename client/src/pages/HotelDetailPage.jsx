import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { hotelService, reviewService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReviewForm, ReviewList } from '../components/Review';
import { Heart, MapPin, Star } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const HotelDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadHotel();
  }, [id]);

  const loadHotel = async () => {
    try {
      const [hotelResponse, reviewsResponse] = await Promise.all([
        hotelService.getById(id),
        reviewService.getByHotel(id)
      ]);
      setHotel(hotelResponse.data);
      setReviews(reviewsResponse.data);
      if (hotelResponse.data.isFavorited) {
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Failed to load hotel', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        await favoriteService.remove(id);
        setIsFavorited(false);
      } else {
        await favoriteService.add(id);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const handleReviewAdded = () => {
    loadHotel();
  };

  if (loading) return <div className="text-center py-12 text-gray-200">Loading...</div>;
  if (!hotel) return <div className="text-center py-12 text-gray-300">Hotel not found</div>;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header with Image */}
      <div className="relative h-96 bg-gray-900 animate-slide-in-down">
        {hotel.imageUrl && (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Hotel Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-in-up">
        <div className="flex justify-between items-start mb-4 animate-bounce-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">{hotel.name}</h1>
            <p className="text-lg text-gray-300 mb-2 flex items-center gap-2">
              <MapPin size={20} className="text-red-400" /> {hotel.location}
            </p>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`transition-transform hover:scale-110 ${isFavorited ? 'text-red-500' : 'text-gray-300'}`}
          >
            <Heart size={48} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-stagger">
          <div className="glass glass-lg p-4 hover-lift hover-glow">
            <p className="text-gray-300 text-sm">Price per night</p>
            <p className="text-3xl font-bold text-pink-300">฿{hotel.price}</p>
          </div>
          <div className="glass glass-lg p-4">
            <p className="text-gray-300 text-sm">Rating</p>
            <p className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
              <Star size={32} className="fill-yellow-400" /> {hotel.avgRating}
            </p>
            <p className="text-sm text-gray-400">({hotel.reviewCount} reviews)</p>
          </div>
          <div className="glass glass-lg p-4">
            <p className="text-gray-300 text-sm">Distance to Tech College</p>
            <p className="text-2xl font-bold text-purple-400">
              {hotel.distanceToTechCollege || 'N/A'} km
            </p>
          </div>
        </div>

        {/* Gallery */}
        {hotel.galleryImages && hotel.galleryImages.length > 0 && (
          <div className="mb-8 animate-slide-in-left">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Description and Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 animate-slide-in-right">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Description</h2>
            <p className="text-gray-200 leading-relaxed">
              {hotel.description || 'No description available'}
            </p>

            <h3 className="text-xl font-bold mt-6 mb-4 text-gray-100">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hotel.amenities && hotel.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="bg-primary text-white p-3 rounded-lg text-center"
                >
                  {amenity}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-6 mb-4 text-gray-100">Nearby Places</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.nearbyPlaces && hotel.nearbyPlaces.map((place, idx) => (
                <span
                  key={idx}
                  className="bg-secondary text-white px-4 py-2 rounded-full text-sm"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Location</h2>
            <MapContainer
              center={[hotel.latitude, hotel.longitude]}
              zoom={15}
              style={{ width: '100%', height: '300px', borderRadius: '0.5rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={[hotel.latitude, hotel.longitude]}>
                <Popup>{hotel.name}</Popup>
              </Marker>
            </MapContainer>
            <a
              href={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-full bg-primary text-white text-center py-2 rounded hover:bg-blue-700"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Reviews</h2>
          <ReviewForm hotelId={hotel.id} onReviewAdded={handleReviewAdded} />
          <ReviewList reviews={reviews} onReviewDeleted={handleReviewAdded} />
        </div>
      </div>
    </div>
  );
};

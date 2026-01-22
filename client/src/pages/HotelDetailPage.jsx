import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { hotelService, reviewService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReviewForm, ReviewList } from '../components/Review';
import { Footer } from '../components/Footer';
import { Heart, MapPin, Star, Phone, Facebook} from 'lucide-react';

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
      const [hotelRes, reviewsRes] = await Promise.all([
        hotelService.getById(id),
        reviewService.getByHotel(id)
      ]);

      setHotel(hotelRes.data);
      setReviews(reviewsRes.data || []);
      setIsFavorited(!!hotelRes.data.isFavorited);
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

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }
  if (!hotel) {
    return <div className="text-center py-12 text-gray-300">Hotel not found</div>;
  }

  const galleryImages = Array.isArray(hotel.galleryImages)
    ? hotel.galleryImages
    : [];

  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : [];

  const nearbyPlaces = Array.isArray(hotel.nearbyPlaces)
    ? hotel.nearbyPlaces
    : [];

  const heroImage =
  hotel.imageUrl ||
  (Array.isArray(hotel.galleryImages) && hotel.galleryImages.length > 0
    ? hotel.galleryImages[0]
    : null);

  return (
    <div className="min-h-screen">
      {/* Header Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={heroImage || '/no-image.png'}
          alt={hotel.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title & Favorite */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              {hotel.name}
            </h1>
            <p className="text-lg text-gray-300 flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              {hotel.location}
            </p>
          </div>

          <button
            onClick={handleFavoriteToggle}
            className={`transition-transform hover:scale-110 ${
              isFavorited ? 'text-red-500' : 'text-gray-300'
            }`}
          >
            <Heart size={48} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass p-4">
            <p className="text-gray-300 text-sm">Price / night</p>
            <p className="text-3xl font-bold text-pink-300">
              ฿{hotel.price}
            </p>
          </div>

          <div className="glass p-4">
            <p className="text-gray-300 text-sm">Rating</p>
            <p className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
              <Star size={28} className="fill-yellow-400" />
              {hotel.avgRating}
            </p>
            <p className="text-sm text-gray-400">
              ({hotel.reviewCount} reviews)
            </p>
          </div>

          <div className="glass p-4">
            <p className="text-gray-300 text-sm">Distance to Tech College</p>
            <p className="text-2xl font-bold text-ocean-300">
              {hotel.distanceToTechCollege || 'N/A'} km
            </p>
          </div>
        </div>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
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

        {/* Description + Amenities + Map */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Description
            </h2>
            <p className="text-gray-200 leading-relaxed">
              {hotel.description || 'No description available'}
            </p>

            <h3 className="text-xl font-bold mt-6 mb-4 text-gray-100">
              Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((a, idx) => (
                <div
                  key={idx}
                  className="bg-primary text-white p-3 rounded-lg text-center"
                >
                  {a}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mt-6 mb-4 text-gray-100">
              Nearby Places
            </h3>
            <div className="flex flex-wrap gap-2">
              {nearbyPlaces.map((p, idx) => (
                <span
                  key={idx}
                  className="bg-secondary text-white px-4 py-2 rounded-full text-sm">
                  {p}
                </span>
              ))}
            </div>

              <div className='flex mt-4 text-left'>
                <h2 className='text-xl font-bold text-gray-100'>Contact Information</h2>
                {(hotel.phone || hotel.facebookUrl || hotel.lineId) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* PHONE */}
                    {hotel.phone && (
                      <div  className="bg-white/10 border border-white/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1"><Phone size={16} className="inline mr-1" /> Phone</p>
                        <a
                          href={`tel:${hotel.phone}`}
                          className="text-white font-medium hover:text-ocean-300"
                        >
                          {hotel.phone}
                        </a>
                      </div>
                    )}
                    {/* FACEBOOK */}
                    {hotel.facebookUrl && (
                      <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1"><Facebook size={16} className="inline mr-1" /> Facebook</p>
                        <a
                          href={hotel.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium hover:text-ocean-300 break-all"
                        >
                          {hotel.facebookUrl}
                        </a>
                      </div>
                    )}
                    {/* LINE */}
                    {hotel.lineId && (
                      <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">LINE</p>
                        <span className="text-white font-medium">
                          {hotel.lineId}
                        </span>
                      </div>
                    )}
                  </div>
                )}
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
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[hotel.latitude, hotel.longitude]}>
                <Popup>{hotel.name}</Popup>
              </Marker>
            </MapContainer>

            <a
              href={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-full bg-primary text-white text-center py-2 rounded hover:bg-ocean-700"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Reviews</h2>
          <ReviewForm hotelId={hotel.id} onReviewAdded={handleReviewAdded} />
          <ReviewList reviews={reviews} onReviewDeleted={handleReviewAdded} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelDetailPage;

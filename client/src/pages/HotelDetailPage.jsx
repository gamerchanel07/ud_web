import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { hotelService, reviewService, favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReviewForm, ReviewList } from '../components/Review';
import { Footer } from '../components/Footer';
import { Heart, MapPin, Star, Phone, Facebook, FileText, Zap, Building, Compass, Map, Navigation } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const HotelDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const viewCountedRef = useRef(false);

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadHotel();
    // เพิ่มจำนวนครั้งที่ดูเพียงครั้งเดียวต่อการโหลดหน้า
    if (!viewCountedRef.current) {
      incrementView();
      viewCountedRef.current = true;
    }
  }, [id]);

  const incrementView = async () => {
    try {
      await hotelService.incrementViews(id);
    } catch (err) {
      console.error('Failed to increment view', err);
    }
  };

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
    <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh'}}>
      {/* รูปภาพหัวที่ */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={heroImage || '/no-image.png'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,173,181,0.2), rgba(34,40,49,0.6))'
        }} />
      </div>
      {/* เนื้อหา */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ชื่อและรายการโปรด */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 style={{color: 'var(--text-primary)'}} className="text-4xl font-bold mb-2">
              {hotel.name}
            </h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-lg flex items-center gap-2">
              <MapPin size={18} style={{color: 'var(--primary-main)'}} />
              {hotel.location}
            </p>
          </div>

          <button
            onClick={handleFavoriteToggle}
            className="transition-transform hover:scale-110"
            style={{color: isFavorited ? '#00ADB5' : 'var(--text-tertiary)'}}
          >
            <Heart size={48} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* การ์ดข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--primary-main)',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>ราคา / คืน</p>
            <p style={{color: 'var(--primary-main)', fontSize: '1.875rem'}} className="font-bold">
              ฿{hotel.price}
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--primary-main)',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>คะแนน</p>
            <p style={{color: 'var(--primary-main)', fontSize: '1.875rem'}} className="font-bold flex items-center gap-2">
              <Star size={28} fill="var(--primary-main)" />
              {hotel.avgRating}
            </p>
            <p style={{color: 'var(--text-tertiary)', fontSize: '0.875rem'}}>
              ({hotel.reviewCount} รีวิว)
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--primary-main)',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>📍 ระยะทาง</p>
            <p style={{color: 'var(--primary-main)', fontSize: '1.875rem'}} className="font-bold">
              {hotel.distanceToTechCollege || 'N/A'} km
            </p>
          </div>
        </div>

        {/* แกลเลอรี่ */}
        {galleryImages.length > 0 && (
          <div className="mb-10">
            <h2 style={{color: 'var(--text-primary)'}} className="text-2xl font-bold mb-4">แกลเลอรี่</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx}`}
                  className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  style={{border: '2px solid var(--primary-main)'}}
                />
              ))}
            </div>
          </div>
        )}

        {/* คำหรณ + สุดอดหนน่ก + แผนที่ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2">
            <h2 style={{color: 'var(--text-primary)'}} className="text-2xl font-bold mb-4">
              คำอธิบาย
            </h2>
            <p style={{color: 'var(--text-secondary)'}} className="leading-relaxed">
              {hotel.description || 'ไม่มีคำอธิบาย'}
            </p>

            <h3 style={{color: 'var(--text-primary)'}} className="text-xl font-bold mt-6 mb-4">
              สิ่งอำนวยความสะดวก
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((a, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--primary-main)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  {a}
                </div>
              ))}
            </div>

            <h3 style={{color: 'var(--text-primary)'}} className="text-xl font-bold mt-6 mb-4">
              สถานที่ใกล้เคียง
            </h3>
            <div className="flex flex-wrap gap-2">
              {nearbyPlaces.map((p, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--primary-main)',
                    color: 'white',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                  {p}
                </span>
              ))}
            </div>

              <div className='flex mt-8 flex-col'>
                <h2 style={{color: 'var(--text-primary)'}} className='text-xl font-bold mb-4'>ข้อมูลติดต่อ</h2>
                {(hotel.phone || hotel.facebookUrl || hotel.lineId) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* โทรศัพท์ */}
                    {hotel.phone && (
                      <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        border: '1px solid var(--border-light)'
                      }}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>
                          <Phone size={16} className="inline mr-1" /> โทรศัพท์
                        </p>
                        <a
                          href={`tel:${hotel.phone}`}
                          style={{color: 'var(--primary-main)'}}
                          className="font-medium hover:underline"
                        >
                          {hotel.phone}
                        </a>
                      </div>
                    )}
                    {/* เฟสบุ๊ค */}
                    {hotel.facebookUrl && (
                      <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        border: '1px solid var(--border-light)'
                      }}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>
                          <Facebook size={16} className="inline mr-1" /> Facebook
                        </p>
                        <a
                          href={hotel.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{color: 'var(--primary-main)'}}
                          className="font-medium hover:underline break-all"
                        >
                          {hotel.facebookUrl}
                        </a>
                      </div>
                    )}
                    {/* LINE */}
                    {hotel.lineId && (
                      <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        border: '1px solid var(--border-light)'
                      }}>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>LINE</p>
                        <span style={{color: 'var(--primary-main)'}} className="font-medium">
                          {hotel.lineId}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
          </div>
          {/* แผนที่ */}
          <div>
            <h2 style={{color: 'var(--text-primary)'}} className="text-2xl font-bold mb-4">สถานที่ตั้ง</h2>
            <MapContainer
              center={[hotel.latitude, hotel.longitude]}
              zoom={15}
              style={{
                width: '100%',
                height: '300px',
                borderRadius: '0.5rem',
                border: '2px solid var(--primary-main)'
              }}
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
              style={{
                marginTop: '0.75rem',
                display: 'block',
                width: '100%',
                backgroundColor: 'var(--primary-main)',
                color: 'white',
                textAlign: 'center',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderRadius: '0.375rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Navigation size={16} /> เปิดใน Google Maps
            </a>
          </div>
        </div>

        {/* รีวิว */}
        <div className="mb-8">
          <h2 style={{color: 'var(--text-primary)'}} className="text-2xl font-bold mb-6">รีวิว</h2>
          <ReviewForm hotelId={hotel.id} onReviewAdded={handleReviewAdded} />
          <ReviewList reviews={reviews} onReviewDeleted={handleReviewAdded} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelDetailPage;

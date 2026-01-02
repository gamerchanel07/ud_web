import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api';
import { Star, MapPin } from 'lucide-react';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Udon Thani Tech College coordinates (consistent)
const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

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

export const HotelMap = ({ hotels, onMarkerClick, userLocation }) => {
  const navigate = useNavigate();

  if (!hotels || hotels.length === 0) {
    return <div className="p-4 text-center">No hotels to display</div>;
  }

  // Calculate center - use user location if available, otherwise use default
  const center = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [17.4086, 102.7870];

  return (
    <MapContainer
      center={center}
      zoom={userLocation ? 14 : 13}
      style={{ width: '100%', height: '500px', zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* User Current Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-blue-600">📍 Your Location</h3>
              <p className="text-sm">({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Tech College Marker */}
      <Marker position={[TECH_COLLEGE_LAT, TECH_COLLEGE_LNG]}>
        <Popup>
          <div className="text-center">
            <h3 className="font-bold text-primary">🎓 Udon Technical College</h3>
          </div>
        </Popup>
      </Marker>

      {/* Hotel Markers */}
      {hotels.map(hotel => (
        <Marker
          key={hotel.id}
          position={[hotel.latitude, hotel.longitude]}
        >
          <Popup>
            <div className="min-w-48">
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="w-full h-24 object-cover rounded mb-2"
              />
              <h3 className="font-bold text-primary">{hotel.name}</h3>
              <p className="text-sm text-gray-600">{hotel.location}</p>
              <p className="text-lg font-bold">฿{hotel.price}</p>
              <p className="text-yellow-500 flex items-center gap-1">
                <Star size={16} className="fill-yellow-500" /> {hotel.avgRating || 0}
              </p>
              <p className="text-sm mt-2 flex items-center gap-1">
                <MapPin size={16} /> {calculateDistance(TECH_COLLEGE_LAT, TECH_COLLEGE_LNG, hotel.latitude, hotel.longitude)} km from Tech College
              </p>
              {userLocation && (
                <p className="text-sm flex items-center gap-1 text-blue-600">
                  <MapPin size={16} /> {calculateDistance(userLocation.lat, userLocation.lng, hotel.latitude, hotel.longitude)} km from you
                </p>
              )}
              <button
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                className="mt-2 w-full bg-primary text-white py-1 rounded text-sm hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

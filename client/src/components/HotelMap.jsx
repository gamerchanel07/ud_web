import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, School } from 'lucide-react';

// แก้ปัญหา leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ไอคอนที่กำหนดเอง
const purpleIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const grayIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/grey-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// มาร์กเกอร์ตำแหน่งผู้ใช้ (สีน้ำเงิน)
const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// วิทยาลัย (ศูนย์กลาง)
const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

// คำนวณระยะทาง (ระหว่างพิกัด)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

export const HotelMap = ({
  hotels,
  userLocation,
  centerLat = TECH_COLLEGE_LAT,
  centerLng = TECH_COLLEGE_LNG,
  radiusKm = 0
}) => {
  const navigate = useNavigate();
  const mapRef = useRef();

  const center = [centerLat, centerLng];

  useEffect(() => {
    if (mapRef.current && radiusKm > 0) {
      const circleBounds = L.circle(center, { radius: radiusKm * 1000 }).getBounds();
      mapRef.current.fitBounds(circleBounds, { padding: [50, 50] });
    }
  }, [radiusKm]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: '100%', height: '500px', zIndex: 0 }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* วงรัศมี */}
      {radiusKm > 0 && (
        <Circle
          center={center}
          radius={radiusKm * 1000}
          pathOptions={{
            color: "#6495ED",
            fillColor: "#6495ED",
            fillOpacity: 0.2
          }}
        />
      )}

      {/* Marker วิทยาลัย */}
      <Marker position={center}>
        <Popup><span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><School size={16} /> Udon Technical College</span></Popup>
      </Marker>

      {/* User Location Marker */}
      {userLocation && userLocation.lat && userLocation.lng && (
        <Marker 
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup><span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={16} /> Your Location</span></Popup>
        </Marker>
      )}

      {/* โรงแรม */}
      {hotels.map(hotel => {
        const distance = calculateDistance(
          centerLat,
          centerLng,
          hotel.latitude,
          hotel.longitude
        );

        const isInRange = radiusKm === 0 || distance <= radiusKm;

        // 🟢 ซ่อน marker นอกวง
        if (!isInRange) return null;

        return (
          <Marker
            key={hotel.id}
            position={[hotel.latitude, hotel.longitude]}
            icon={isInRange ? purpleIcon : grayIcon}   // ⭐ ในวงเป็นสีม่วง
          >
            <Popup>
              <div className="min-w-48">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-24 object-cover rounded mb-2"
                  onError={(e) => (e.currentTarget.src = "/no-image.png")}
                />

                <h3 className="font-bold text-purple-600">{hotel.name}</h3>
                <p className="text-sm">{hotel.location}</p>
                <p className="font-bold text-pink-500">฿{hotel.price}</p>

                <p className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} className="fill-yellow-500" /> {hotel.avgRating || 0}
                </p>

                <p className="text-sm flex items-center gap-1 mt-1">
                  <MapPin size={16} />
                  {distance} km from college
                </p>

                <button
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  className="mt-2 w-full bg-purple-600 text-white py-1 rounded hover:bg-purple-700"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

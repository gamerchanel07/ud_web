import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';

// markers ไอคอน
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TECH_COLLEGE_LAT = 17.416112428032477;
const TECH_COLLEGE_LNG = 102.78878300645938;

function ClickableMap({ onLocationSelect }) {
  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;
    onLocationSelect(lat, lng);
  });
  return null;
}

export const HotelMapPicker = ({ onSelectLocation, onClose, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: TECH_COLLEGE_LAT, lng: TECH_COLLEGE_LNG }
  );

  const handleSelect = () => {
    onSelectLocation(selectedLocation.lat, selectedLocation.lng);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '42rem',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border-light)'
      }}>
        {/* หัว */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--primary-main)'
          }}>เลือกตำแหน่งบนแผนที่</h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <X size={24} />
          </button>
        </div>

        {/* แผนที่ */}
        <div style={{
          flex: 1,
          minHeight: '400px'
        }}>
          <MapContainer
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* มาร์กเกอร์วิทยาลัย */}
            <Marker position={[TECH_COLLEGE_LAT, TECH_COLLEGE_LNG]}>
              <Popup>Udon Technical College</Popup>
            </Marker>

            {/* มาร์กตำแหน่งที่เลือก */}
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>Hotel Location ({selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)})</Popup>
              </Marker>
            )}

            {/* ตัวจัดการคลิ๊ก */}
            <ClickableMap onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })} />
          </MapContainer>
        </div>

        {/* ปุ่ม */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📍 ตำแหน่งที่เลือก: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </div>
          <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button
              onClick={handleSelect}
              style={{
                flex: 1,
                backgroundColor: 'var(--primary-main)',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              ✓ ยืนยันตำแหน่ง
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                border: '1px solid var(--border-light)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-main)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

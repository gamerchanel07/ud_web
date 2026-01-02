import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';

// Fix for default markers
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-purple-300">Select Location on Map</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 min-h-[400px]">
          <MapContainer
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* Tech College Marker */}
            <Marker position={[TECH_COLLEGE_LAT, TECH_COLLEGE_LNG]}>
              <Popup>Udon Technical College</Popup>
            </Marker>

            {/* Selected Location Marker */}
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>Hotel Location ({selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)})</Popup>
              </Marker>
            )}

            {/* Click Handler */}
            <ClickableMap onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })} />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 border-t border-white/20 space-y-3">
          <div className="text-sm text-gray-300">
            <p>📍 Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSelect}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold"
            >
              ✓ Confirm Location
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

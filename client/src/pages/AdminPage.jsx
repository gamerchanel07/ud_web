import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { adminService, hotelService } from '../services/api';
import { DashboardStats } from '../components/Dashboard';
import { UserManagement } from '../components/UserManagement';
import { AnnouncementManagement } from '../components/AnnouncementManagement';
import { ActivityLog } from '../components/ActivityLog';
import { BarChart3, Building2, Users, Megaphone, Clipboard, Plus, X, Trash2, MapPin, Camera, Edit2 } from 'lucide-react';
import { HotelList } from '../components/HotelCard';


const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;


const AMENITIES_OPTIONS = [
  'WiFi',
  'Air Conditioning',
  'Parking',
  'Restaurant',
  'Pool',
  'Gym',
  'Free Airport Shuttle',
  'Study Area',
  'Café',
  'Spa',
  'Laundry Service',
  '24/7 Reception'
];

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({
  name: '',
  description: '',
  price: '',
  location: '',
  latitude: '',
  longitude: '',
  imageUrl: '',          
  galleryImages: [],     
  hotelType: 'Standard Hotel',
  distanceToTechCollege: '',
  amenities: [],
  nearbyPlaces: [],
  phone: '',
  facebookUrl: '',
  lineId: ''
});


  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadHotels();
  }, [user, navigate]);

  const loadHotels = async () => {
    try {
      const response = await hotelService.getAll();
      setHotels(response.data);
    } catch (err) {
      console.error('Failed to load hotels', err);
    } finally {
      setLoading(false);
    }
  };

  const [editingHotel, setEditingHotel] = useState(null);
  const [nearbyInput, setNearbyInput] = useState('');
  // Calculate distance from tech college
  const calculateDistance = (lat, lng) => {
    const R = 6371; // Earth's radius in km
    const dLat = (TECH_COLLEGE_LAT - lat) * Math.PI / 180;
    const dLng = (TECH_COLLEGE_LNG - lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(TECH_COLLEGE_LAT * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    // Auto-calculate distance if lat/lng changes
    if ((name === 'latitude' || name === 'longitude') && formData.latitude && formData.longitude) {
      const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        newData.distanceToTechCollege = calculateDistance(lat, lng);
      }
    }
    setFormData(newData);
  };


  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleCoordinateChange = (e) => {
    const { value } = e.target;
    // Parse comma-separated coordinates
    const parts = value.split(',').map(p => p.trim());
    
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const distance = calculateDistance(lat, lng);
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          distanceToTechCollege: distance
        }));
      }
    }
  };

  const handleSubmitHotel = async (e) => {
  e.preventDefault();

  const payload = {
    name: formData.name,
    description: formData.description,
    price: Number(formData.price),
    location: formData.location,
    latitude: Number(formData.latitude),
    longitude: Number(formData.longitude),
    hotelType: formData.hotelType,
    distanceToTechCollege: formData.distanceToTechCollege
      ? Number(formData.distanceToTechCollege)
      : null,
    amenities: formData.amenities,
    nearbyPlaces: formData.nearbyPlaces,
    imageUrl: formData.imageUrl || null,
    galleryImages: formData.galleryImages,
    phone: formData.phone,
    facebookUrl: formData.facebookUrl,
    lineId: formData.lineId
  };

  if (editingHotel) {
    await adminService.updateHotel(editingHotel.id, payload);
  } else {
    await adminService.addHotel(payload);
  }

  setShowForm(false);
  setEditingHotel(null);
  loadHotels();
};


  const handleDeleteHotel = async (hotelId) => {
    if (confirm(t('admin.deleteConfirm'))) {
      try {
        await adminService.deleteHotel(hotelId);
        loadHotels();
      } catch (err) {
        alert('Failed to delete hotel');
      }
    }
  };

  
  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-slide-in-down">
          <h1 className="text-2xl md:text-4xl text-gray-100 font-bold mb-2 flex items-center gap-3">
            <BarChart3 size={40} className="text-purple-400" />
            Admin Panel
          </h1>
          <p className="text-sm md:text-base text-gray-300">Manage hotels, users, and view analytics</p>
        </div>

        {/* Tabs */}
        <div className="glass glass-lg rounded-lg mb-8 border-b border-white/20 animate-scale-in overflow-x-auto">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              <BarChart3 size={20} /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'hotels'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              <Building2 size={20} /> <span className="hidden sm:inline">Hotels</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              <Users size={20} /> <span className="hidden sm:inline">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'announcements'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              <Megaphone size={20} /> <span className="hidden md:inline">Announcements</span>
            </button>
            <button
              onClick={() => setActiveTab('activity-logs')}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'activity-logs'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              <Clipboard size={20} /> <span className="hidden lg:inline">Activity Log</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardStats />
        )}

        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <div className="animate-slide-in-up">
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 py-2 rounded text-sm md:text-base w-full md:w-auto flex items-center justify-center gap-2 md:inline-flex transition-all"
              >
                {showForm ? <><X size={20} /> {t('common.cancel')}</> : <><Plus size={20} /> {t('admin.addHotel')}</>}
              </button>
            </div>

            {/* Enhanced Hotel Form */}
            {showForm && (
              <div className="glass glass-lg p-6 rounded-lg mb-8 animate-slide-in-down">
                <h2 className="text-2xl font-bold text-purple-300 mb-6">{t('admin.addHotel')}</h2>
                <form onSubmit={handleSubmitHotel} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder={t('admin.hotelName')}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      required
                    />
                    <input
                      type="text"
                      name="location"
                      placeholder={t('admin.location')}
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder={t('admin.price')}
                      value={formData.price}
                      onChange={handleInputChange}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      required
                    />
                    <select
                      name="hotelType"
                      value={formData.hotelType}
                      onChange={handleInputChange}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-purple-300 text-sm focus:outline-none focus:border-purple-400"
                    >
                      <option value="Budget Hotel">Budget Hotel</option>
                      <option value="Standard Hotel">Standard Hotel</option>
                      <option value="Business Hotel">Business Hotel</option>
                      <option value="Luxury Hotel">Luxury Hotel</option>
                    </select>
                  </div>

                  {/* Location Selection */}
                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <h3 className="text-purple-300 font-bold mb-4 flex items-center gap-2">
                      <MapPin size={20} /> {t('admin.location')} (Format: latitude, longitude)
                    </h3>
                    <input
                      type="text"
                      placeholder="เช่น: 17.416, 102.789"
                      onChange={handleCoordinateChange}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400 mb-3"
                    />
                    <div className="text-sm text-gray-300 mb-2">
                      📍 Latitude: {formData.latitude || '-'} | Longitude: {formData.longitude || '-'}
                    </div>
                    <div className="text-sm auto-text">
                      📏 Distance to Tech College: {formData.distanceToTechCollege ? `${formData.distanceToTechCollege} km` : 'Auto-calculated'}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <h3 className="text-purple-300 font-bold mb-4 flex items-center gap-2">
                      <Camera size={20} /> Images
                    </h3>
                    
                    {/* Image Preview */}
                    {formData.galleryImages.length > 0 && (
                      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.galleryImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded"onError={(e) => {e.currentTarget.src = '/no-image.png';}}/>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Main Image */}
                      <input
                        type="text"
                        name="imageUrl"
                        placeholder="หรือใส่ Image URL"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      />
                      <br />
                      {/* Gallery Upload */}
                      <input
                        type="text"
                        placeholder="Gallery Image URL (กด Enter)"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = e.target.value.trim();
                            if (!url) return; // ไม่ให้ empty
                            if (!url.startsWith('http')) return; //กัน URL มั่ว
                            setFormData(prev => ({
                              ...prev,
                              galleryImages: [...prev.galleryImages, url]
                            }));
                            e.target.value = '';
                          }
                        }}
                        className="mt-2 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      />
                  </div>

                  {/* Amenities Selection */}
                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <h3 className="text-purple-300 font-bold mb-4">{t('admin.amenities')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {AMENITIES_OPTIONS.map(amenity => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="w-4 h-4 rounded border-white/20 bg-white/10 checked:bg-purple-600"
                          />
                          <span className="text-gray-300 text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Nearby Places */}
                      <div className="bg-white/5 p-4 rounded border border-white/10">
                      <h3 className="text-purple-300 font-bold mb-4">Nearby Places</h3>

                      <div className="flex gap-2 mb-3">
                        <input
                          value={nearbyInput}
                          onChange={e => setNearbyInput(e.target.value)}
                          placeholder="Add nearby place"
                          className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!nearbyInput) return;
                            setFormData(prev => ({
                              ...prev,
                              nearbyPlaces: [...prev.nearbyPlaces, nearbyInput]
                            }));
                            setNearbyInput('');
                          }}
                          className="bg-purple-600 px-3 rounded"
                        >
                          +
                        </button>
                      </div>

                <div className="flex flex-wrap gap-2">
                  {formData.nearbyPlaces.map((p, i) => (
                    <span key={i} className="bg-purple-500/20 px-2 py-1 rounded text-sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

                  {/* Description */}
                  <textarea
                    name="description"
                    placeholder={t('admin.description')}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    rows="4"
                    required
                  />
                  {/*CONTACT INFORMATION*/}
                  <div className="bg-white/5 p-4 rounded border border-white/10 mt-6">
                    <h3 className="text-purple-300 font-bold mb-4">
                      Contact Information
                    </h3>

                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white mb-3"
                    />

                    <input
                      type="text"
                      name="facebookUrl"
                      placeholder="Facebook Page URL"
                      value={formData.facebookUrl || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white mb-3"
                    />

                    <input
                      type="text"
                      name="lineId"
                      placeholder="LINE ID (ไม่ต้องใส่ @)"
                      value={formData.lineId || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold text-sm transition-all"
                  >✓ {t('admin.addHotel')}
                  </button>
                </form>
              </div>
            )}
            {/* Hotels List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-stagger">
  {loading ? (
    <div className="text-center py-8 text-gray-200 animate-pulse text-sm md:text-base">
      Loading hotels...
    </div>
  ) : (
    hotels.map(hotel => (
      <div
        key={hotel.id}
        className="glass glass-lg p-4 md:p-6 rounded-lg card-enter hover-lift hover-glow"
      >
        {hotel.imageUrl && (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-32 object-cover rounded mb-3 md:mb-4"
          />
        )}

        <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-100">
          {hotel.name}
        </h3>

        <p className="text-gray-300 mb-2 text-sm md:text-base">
          {hotel.location}
        </p>

        <p className="text-base md:text-lg font-bold text-pink-300 mb-2">
          ฿{hotel.price}
        </p>

        <div className="flex gap-2 flex-col md:flex-row">
          <button
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            className="flex-1 bg-primary text-white py-2 rounded hover:bg-blue-700 text-xs md:text-sm"
          >
            View
          </button>

          {/* ✅ Edit – ใช้ hotel ได้เพราะอยู่ใน map */}
          <button
            onClick={() => {
              setEditingHotel(hotel);
              setFormData({
                  name: hotel.name || '',
                  description: hotel.description || '',
                  price: hotel.price ?? '',
                  location: hotel.location || '',
                  latitude: hotel.latitude ?? '',
                  longitude: hotel.longitude ?? '',
                  imageUrl: hotel.imageUrl || '',
                  galleryImages: hotel.galleryImages || [],
                  hotelType: hotel.hotelType || 'Standard Hotel',
                  distanceToTechCollege: hotel.distanceToTechCollege ?? '',
                  amenities: hotel.amenities || [],
                  nearbyPlaces: hotel.nearbyPlaces || [],
                  phone: hotel.phone || '',
                  facebookUrl: hotel.facebookUrl || '',
                  lineId: hotel.lineId || ''
              });
              setShowForm(true);
            }}
            className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-xs md:text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteHotel(hotel.id)}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-700 text-xs md:text-sm"
          >
            Delete
          </button>
        </div>
          </div>
            ))
          )}
        </div>

          </div>
        )}
        {/* Users Tab */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity-logs' && (
          <div className="animate-slide-in-up">
            <ActivityLog />
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <AnnouncementManagement />
        )}
      </div>
    </div>
  );
};

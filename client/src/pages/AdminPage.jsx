import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminService, hotelService } from "../services/api";
import { DashboardStats } from "../components/Dashboard";
import { UserManagement } from "../components/UserManagement";
import { AnnouncementManagement } from "../components/AnnouncementManagement";
import { ActivityLog } from "../components/ActivityLog";
import { HotelForm } from "../components/HotelForm";
import { SkeletonCard, SkeletonGrid, SkeletonStats } from "../components/Skeleton";
import {
  BarChart3,
  Building2,
  Users,
  Megaphone,
  Clipboard,
  Plus,
  X,
  Trash2,
  Edit2,
}
 from "lucide-react";
import { HotelList } from "../components/HotelCard";

const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    galleryImages: [],
    hotelType: "Standard Hotel",
    distanceToTechCollege: "",
    amenities: [],
    nearbyPlaces: [],
    phone: "",
    facebookUrl: "",
    lineId: "",
  });

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    loadHotels();
  }, [user, navigate]);

  const loadHotels = async () => {
    try {
      const response = await hotelService.getAll();
      setHotels(response.data);
    } catch (err) {
      console.error("Failed to load hotels", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (confirm(t("admin.deleteConfirm"))) {
      try {
        await adminService.deleteHotel(hotelId);
        loadHotels();
      } catch (err) {
        alert("Failed to delete hotel");
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHotel(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      location: "",
      latitude: "",
      longitude: "",
      imageUrl: "",
      galleryImages: [],
      hotelType: "Standard Hotel",
      distanceToTechCollege: "",
      amenities: [],
      nearbyPlaces: [],
      phone: "",
      facebookUrl: "",
      lineId: "",
    });
  };

  const handleFormSuccess = () => {
    handleFormCancel();
    loadHotels();
  };

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showForm]);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* ส่วนหัว */}
        <div className="mb-6 md:mb-8 animate-slide-in-down">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 size={40} className="text-purple-400" />
            Admin Panel
          </h1>
          <p className="text-sm md:text-base">
            จัดการโรงแรม ผู้ใช้ และดูการวิเคราะห์
          </p>
        </div>

        {/* แท็บ */}
        <div className="glass glass-lg rounded-lg mb-8 border-b border-white/20 animate-scale-in overflow-x-auto">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? " border-b-2 border-cyan-400"
                  : " hover:text-black"
              }`}
            >
              <BarChart3 size={20} />{" "}
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("hotels")}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "hotels"
                  ? "border-b-2 border-cyan-400"
                  : " hover:text-black"
              }`}
            >
              <Building2 size={20} />{" "}
              <span className="hidden sm:inline">Hotels</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "users"
                  ? " border-b-2 border-cyan-400"
                  : " hover:text-black"
              }`}
            >
              <Users size={20} />{" "}
              <span className="hidden sm:inline">Users</span>
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "announcements"
                  ? " border-b-2 border-cyan-400"
                  : " hover:text-black"
              }`}
            >
              <Megaphone size={20} />{" "}
              <span className="hidden md:inline">Announcements</span>
            </button>
            <button
              onClick={() => setActiveTab("activity-logs")}
              className={`px-3 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "activity-logs"
                  ? " border-b-2 border-cyan-400"
                  : " hover:text-black"
              }`}
            >
              <Clipboard size={20} />{" "}
              <span className="hidden lg:inline">Activity Log</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && <DashboardStats />}

        {/* Hotels Tab */}
        {activeTab === "hotels" && (
          <div className="animate-slide-in-up">
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded text-sm md:text-base w-full md:w-auto flex items-center justify-center gap-2 md:inline-flex transition-all"
              >
                {showForm ? (
                  <>
                    <X size={20} /> {t("common.cancel")}
                  </>
                ) : (
                  <>
                    <Plus size={20} /> {t("admin.addHotel")}
                  </>
                )}
              </button>
            </div>

            {/* Hotel Form Component */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Background Blur */}
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={handleFormCancel}
                />

                {/* Form Container */}
                <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto px-4">
                  <HotelForm
                    formData={formData}
                    setFormData={setFormData}
                    editingHotel={editingHotel}
                    onCancel={handleFormCancel}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              </div>
            )}

            {/* Hotels List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-stagger">
              {loading ? (
                <SkeletonGrid columns={3} count={6} />
              ) : hotels.length === 0 ? (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)'}}>
                  <Building2 size={80} style={{margin: '0 auto', marginBottom: 'var(--spacing-md)', color: 'var(--primary-main)', opacity: 0.5}} />
                  <p style={{fontSize: 'var(--text-xl)', color: 'var(--text-secondary)'}}>ไม่มีโรงแรม</p>
                </div>
              ) : (
                hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="card hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 173, 181, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    {hotel.imageUrl && (
                      <div style={{height: '150px', overflow: 'hidden'}}>
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}

                    <div style={{padding: 'var(--spacing-md)', flex: 1}}>
                      <h3 style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-bold)',
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--text-primary)'
                      }}>
                        {hotel.name}
                      </h3>

                      <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--spacing-sm)',
                        fontSize: 'var(--text-sm)'
                      }}>
                        {hotel.location}
                      </p>

                      <p style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--primary-main)',
                        marginBottom: 'var(--spacing-md)'
                      }}>
                        ฿{Number(hotel.price).toLocaleString()}
                      </p>
                    </div>

                    <div style={{display: 'flex', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)', paddingTop: 0}}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingHotel(hotel);
                          setFormData({
                            name: hotel.name || "",
                            description: hotel.description || "",
                            price: hotel.price ?? "",
                            location: hotel.location || "",
                            latitude: hotel.latitude ?? "",
                            longitude: hotel.longitude ?? "",
                            imageUrl: hotel.imageUrl || "",
                            galleryImages: hotel.galleryImages || [],
                            hotelType: hotel.hotelType || "Standard Hotel",
                            distanceToTechCollege:
                              hotel.distanceToTechCollege ?? "",
                            amenities: hotel.amenities || [],
                            nearbyPlaces: hotel.nearbyPlaces || [],
                            phone: hotel.phone || "",
                            facebookUrl: hotel.facebookUrl || "",
                            lineId: hotel.lineId || "",
                          });
                          setShowForm(true);
                        }}
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          backgroundColor: 'var(--primary-main)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-bold)',
                          transition: 'all 0.3s ease',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--spacing-xs)',
                          boxShadow: '0 4px 12px rgba(0, 173, 181, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#006d74';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 173, 181, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-main)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 173, 181, 0.2)';
                        }}
                      >
                        <Edit2 size={16} /> แก้ไข
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHotel(hotel.id);
                        }}
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-bold)',
                          transition: 'all 0.3s ease',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--spacing-xs)',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#DC2626';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#EF4444';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        <Trash2 size={16} /> ลบ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {/* Users Tab */}
        {activeTab === "users" && <UserManagement />}

        {/* Activity Log Tab */}
        {activeTab === "activity-logs" && (
          <div className="animate-slide-in-up">
            <ActivityLog />
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && <AnnouncementManagement />}
      </div>
    </div>
  );
};

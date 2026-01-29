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
import {
  BarChart3,
  Building2,
  Users,
  Megaphone,
  Clipboard,
  Plus,
  X,
  Trash2,
} from "lucide-react";
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
                  : " hover:text-gray-100"
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
                  : " hover:text-gray-100"
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
                  : " hover:text-gray-100"
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
                  : " hover:text-gray-100"
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
                  : " hover:text-gray-100"
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
                <div className="text-center py-8 text-gray-700 dark:text-gray-200 animate-pulse text-sm md:text-base">
                  Loading hotels...
                </div>
              ) : (
                hotels.map((hotel) => (
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

                    <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                      {hotel.name}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base">
                      {hotel.location}
                    </p>

                    <p className="text-base md:text-lg font-bold text-pink-600 dark:text-pink-400 mb-2">
                      ฿{hotel.price}
                    </p>

                    <div className="flex gap-2 flex-col md:flex-row">
                      <button
                        onClick={() => navigate(`/hotel/${hotel.id}`)}
                        className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-xs md:text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
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
                        className="flex-1 bg-yellow-500 dark:bg-yellow-600 text-white py-2 rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 text-xs md:text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteHotel(hotel.id)}
                        className="flex-1 bg-red-600 dark:bg-red-700 text-white py-2 rounded hover:bg-red-700 dark:hover:bg-red-800 text-xs md:text-sm"
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

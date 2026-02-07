import React, { useState, useEffect, useRef } from "react";
import { hotelService, favoriteService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { HotelMap } from "../components/HotelMap";
import { HotelList, HotelCard } from "../components/HotelCard";
import { AnnouncementPopup } from "../components/AnnouncementPopup";
import { Footer } from "../components/Footer";
import { MapPin, Building2, Search, Zap, Filter, Smile, MapPinCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isFirstLoad = useRef(true);
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    hotelType: "",
    nearbyPlace: "",
    maxDistance: "",
  });

  const TECH_COLLEGE_LAT = 17.41604449545236;
  const TECH_COLLEGE_LNG = 102.78876831049472;

  // ---------- อาแพคใหญ่ขอว Hero ----------
  const texts = [
    "ค้นหาที่พักในอุดรธานีได้ง่าย ๆ กับเรา",
    "รวมโรงแรมคุณภาพในอุดรธานีไว้ในที่เดียว",
    "ที่พักดี ๆ ใกล้ตัวคุณ เริ่มต้นที่ UD Hotels",
    "วางแผนทริปอุดรธานี ให้เราดูแลคุณ",
    "ประสบการณ์การพักผ่อนที่คุณวางใจได้",
    "โรงแรมหลากหลายสไตล์ พร้อมให้คุณเลือก",
    "เที่ยวอุดรอย่างสบายใจ ด้วยที่พักคุณภาพ",
    "ค้นพบที่พักที่ใช่ สำหรับทุกการเดินทาง",
    "พักผ่อนอย่างมีระดับในอุดรธานี",
    "ที่พักดี ราคาโดนใจ ใกล้คุณที่สุด",
  ];
  const [index, setIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------- โหลดข้อมูล ----------
  useEffect(() => {
    loadHotels();
    if (user) loadFavorites();
    initializeGPS();
  }, [user]);

  const loadHotels = async () => {
    try {
      const response = await hotelService.getAll();
      setAllHotels(response.data);
      setFilteredHotels(response.data); // ⭐ ตัวเดียวที่ใช้แสดง
    } catch (err) {
      console.error("Failed to load hotels", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getAll();
      setFavorites(response.data.map((f) => f.hotelId));
    } catch (err) {
      console.error("Failed to load favorites", err);
    }
  };

  // --------------------
  const initializeGPS = () => {
    if (!navigator.geolocation) {
      alert(t("homePage.gpsError"));
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  // ---------- ค้นหา ----------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await hotelService.search(searchQuery);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // 🔥 รีเซ็ตข้อมูลตอนลบ keyword (UX ดีมาก)
  useEffect(() => {
    // ❋ กันไม่ให้รันตอนเปิดหน้า
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // 🔥 รันเฉพาะตอน "ผู้ใช้ลบ keyword จริง ๆ"
    if (searchQuery === "") {
      const reloadAll = async () => {
        try {
          const response = await hotelService.getAll();

          setAllHotels(response.data);
          setFilteredHotels(response.data);

          // รีเซ็ตกรองกรองทุกตัว
          setFilters({
            minPrice: "",
            maxPrice: "",
            minRating: "",
            hotelType: "",
            nearbyPlace: "",
            maxDistance: "",
          });
        } catch (err) {
          console.error("Reload all hotels failed", err);
        }
      };
      reloadAll();
    }
  }, [searchQuery]);

  // ---------- ตัวกรอง (กดปุ่ม) ----------
  const handleFilter = async (e) => {
    e.preventDefault();

    try {
      const cleanFilters = {
        ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
        ...(filters.minRating && { minRating: Number(filters.minRating) }),
        ...(filters.hotelType && { hotelType: filters.hotelType }),
        ...(filters.nearbyPlace && { nearbyPlace: filters.nearbyPlace }),
        ...(filters.maxDistance && {
          maxDistance: Number(filters.maxDistance),
        }),
      };

      const response = await hotelService.filter(cleanFilters);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error("Filter failed", err);
    }
  };


  const handleAutoFilter = async () => {
    try {
      const cleanFilters = {
        ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
        ...(filters.minRating && { minRating: Number(filters.minRating) }),
        ...(filters.hotelType && { hotelType: filters.hotelType }),
        ...(filters.nearbyPlace && { nearbyPlace: filters.nearbyPlace }),
        ...(filters.maxDistance && {
          maxDistance: Number(filters.maxDistance),
        }),
      };

      const response = await hotelService.filter(cleanFilters);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error("AUTO FILTER ERROR:", err);
    }
  };

  // ---------- ตัวเลือกรายการโปรด ----------
  const handleFavoriteToggle = async (hotelId) => {
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    try {
      if (favorites.includes(hotelId)) {
        await favoriteService.remove(hotelId);
        setFavorites(favorites.filter((id) => id !== hotelId));
      } else {
        await favoriteService.add(hotelId);
        setFavorites([...favorites, hotelId]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  // ---------- แสดงผล ----------
  return (
    <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh'}} className="animate-fade-in">
      <AnnouncementPopup />

      {/* ส่วนหัว */}
      <div style={{
        color: 'white',
        paddingTop: 'var(--spacing-2xl)',
        paddingBottom: 'var(--spacing-2xl)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px'
      }} className="animate-slide-in-down">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hotel Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10 text-center">
          {/* Decorative Icons */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            opacity: 0.2
          }}>
            <MapPinCheck size={40} />
          </div>
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '60px',
            opacity: 0.2
          }}>
            <Star size={32} />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            opacity: 0.2
          }}>
            <Smile size={36} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              fontFamily: '"Playfair Display", "Georgia", "Garamond", serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
              marginTop: 0,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
            className="md:text-6xl"
          >
            <Building2 size={80} style={{color: 'white'}} /> UD Hotels
          </motion.h1>

          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: 'var(--spacing-md)',
              fontSize: '1.375rem',
              fontWeight: '600',
              letterSpacing: '0.02em',
              lineHeight: '1.6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              minHeight: '28px'
            }}
          >
            <Zap size={20} /> {texts[index]}
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh'}}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-slide-in-up">
        
          {/* Search & Filter Section */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            marginBottom: 'var(--spacing-2xl)',
            boxShadow: '0 10px 30px rgba(0, 173, 181, 0.1)',
            border: '1px solid var(--border-light)'
          }} className="animate-fade-in">
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-lg)',
              marginTop: 0
            }}>ค้นหาที่พักของคุณ</h2>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-6" style={{}}>
          {/* ค้นหา */}
          <form onSubmit={handleSearch} className="lg:col-span-3">
            <div className="flex gap-1 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาโรงแรม, สถานที่..."
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-light)',
                  height: '2.75rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-main)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 173, 181, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  height: '2.25rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Search size={16} /> ค้นหา
              </button>
            </div>
          </form>

          {/* ตัวกรอง */}
          <form onSubmit={handleFilter} className="lg:col-span-4 h-9">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="ราคาต่ำสุด"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)'
                }}
              />
              <input
                type="number"
                placeholder="ราคาสูงสุด"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)'
                }}
              />
              <select
                value={filters.minRating}
                onChange={(e) =>
                  setFilters({ ...filters, minRating: e.target.value })
                }
                style={{
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  borderRadius: '0.25rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <option value="">คะแนนต่ำสุด</option>
                <option value="1">1+ ดาว</option>
                <option value="2">2+ ดาว</option>
                <option value="3">3+ ดาว</option>
                <option value="4">4+ ดาว</option>
              </select>
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary-main)',
                  color: 'white',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Filter size={16} /> ตัวกรอง
              </button>
            </div>
          </form>

          {/* เลื่อนระยะทาง */}
          <div className="lg:col-start-8 lg:col-span-3 flex flex-col">
            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-2">
              ระยะทางจากวิทยาลัยไม่เกิน:
              <span className="text-blue-600 dark:text-blue-400 font-bold ml-2">
                {filters.maxDistance || "ไม่จำกัด"} กม.
              </span>
            </label>

            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.maxDistance}
              onChange={(e) =>
                setFilters({ ...filters, maxDistance: e.target.value })
              }
              className="w-full h-2 rounded-lg appearance-none cursor-pointer
                bg-gradient-to-r from-white via-ocean-500 to-blue-500
                slider-thumb"
            />
          </div>
        </div>

        {/* แผนที่ */}
        {filteredHotels.length > 0 && (
          <div style={{marginBottom: 'var(--spacing-2xl)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'}} className="animate-fade-in">
            <HotelMap
              hotels={filteredHotels}
              userLocation={userLocation}
              centerLat={TECH_COLLEGE_LAT}
              centerLng={TECH_COLLEGE_LNG}
              radiusKm={filters.maxDistance}
            />
          </div>
        )}

        {/* Hotel Results Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
          paddingBottom: 'var(--spacing-md)',
          borderBottom: '2px solid var(--border-light)'
        }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <Building2 size={28} style={{color: 'var(--primary-main)'}} />
            {filteredHotels.length} โรงแรม
          </h2>
        </div>

        {/* รายการโรงแรม */}
        {loading ? (
          <div style={{textAlign: 'center', paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)', color: 'var(--text-secondary)'}}>
            <div style={{display: 'inline-block', fontSize: 'var(--text-lg)'}}>
              กำลังโหลดโรงแรม...
            </div>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div style={{
            textAlign: 'center',
            paddingTop: 'var(--spacing-2xl)',
            paddingBottom: 'var(--spacing-2xl)'
          }}>
            <Building2 size={60} style={{margin: '0 auto', marginBottom: 'var(--spacing-md)', color: 'var(--text-tertiary)', opacity: 0.5}} />
            <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-lg)'}}>ไม่พบโรงแรมที่ตรงกับการค้นหา</p>
          </div>
        ) : (
          <HotelList
            hotels={filteredHotels}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
            userLocation={userLocation}
          />
        )}        </div>        </div>
      </div>
      <Footer />
    </div>
  );
};

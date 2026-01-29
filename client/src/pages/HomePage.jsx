import React, { useState, useEffect, useRef } from "react";
import { hotelService, favoriteService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { HotelMap } from "../components/HotelMap";
import { HotelList } from "../components/HotelCard";
import { AnnouncementPopup } from "../components/AnnouncementPopup";
import { Footer } from "../components/Footer";
import { MapPin } from "lucide-react";
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

  // ---------- Hero Text Animation ----------
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Load Data ----------
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

  // ---------- GPS ----------
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

  // ---------- SEARCH ----------
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

  // 🔥 Auto reset ตอนลบ keyword (UX ดีมาก)
  useEffect(() => {
    // ❌ กันไม่ให้รันตอนเปิดหน้า
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

          // reset filter ทุกตัว
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

  // ---------- FILTER (กดปุ่ม) ----------
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

  // ---------- AUTO DISTANCE FILTER (ลาก slider) ----------
  //useEffect(() => {
  //if (searchQuery === "") return;
  //if (!filters.maxDistance || Number(filters.maxDistance) === 0) {
  //return;
  //}
  //const timeout = setTimeout(() => {
  //    handleAutoFilter();
  //   }, 400);
  //   return () => clearTimeout(timeout);
  // }, [filters.maxDistance, searchQuery]);

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

  // ---------- FAVORITE ----------
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

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen animate-fade-in">
      <AnnouncementPopup />

      {/* Header */}
      <div className="glass glass-lg text-white py-8 md:py-12 animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold 
              bg-gradient-to-r from-sky-200 via-blue-400 to-slate-800 
              bg-clip-text text-transparent
              drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]"
          >
            UD Hotels
          </motion.h1>

          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gray-300 mt-4 text-lg"
          >
            {texts[index]}
          </motion.p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 animate-slide-in-up">
        {/* Search + Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="lg:col-span-3">
            <div className="flex gap-1 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels, locations..."
                className="w-full p-2 border border-ocean-400/30 rounded-md text-xs text-gray-100 bg-white/10 placeholder-gray-400 h-9 focus:outline-none focus:border-ocean-400"
              />
              <button
                type="submit"
                className="bg-ocean-600 hover:bg-ocean-700 text-white px-4 h-9 rounded-md text-xs transition-all duration-200 font-semibold whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter */}
          <form onSubmit={handleFilter} className="lg:col-span-4 h-9">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="p-2 border border-ocean-400/30 rounded text-xs bg-white/10 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-ocean-400"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="p-2 border border-ocean-400/30 rounded text-xs bg-white/10 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-ocean-400"
              />
              <select
                value={filters.minRating}
                onChange={(e) =>
                  setFilters({ ...filters, minRating: e.target.value })
                }
                className="p-2 border border-ocean-400/30 rounded text-xs bg-white/10 text-gray-100 focus:outline-none focus:border-ocean-400"
              >
                <option value="">Min Rating</option>
                <option value="1">1+ stars</option>
                <option value="2">2+ stars</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
              </select>
              <button
                type="submit"
                className="bg-secondary hover:bg-blue-500 text-white px-4 py-2 rounded text-sm transition-all duration-200 font-semibold"
              >
                Filter
              </button>
            </div>
          </form>

          {/* Distance Slider */}
          <div className="lg:col-start-8 lg:col-span-3 flex flex-col">
            <label className="block text-xs text-gray-300 mb-2">
              ระยะทางจากวิทยาลัยไม่เกิน:
              <span className="text-ocean-300 font-bold ml-2">
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

        {/* Map */}
        {filteredHotels.length > 0 && (
          <div className="mb-12 animate-fade-in">
            <HotelMap
              hotels={filteredHotels}
              userLocation={userLocation}
              centerLat={TECH_COLLEGE_LAT}
              centerLng={TECH_COLLEGE_LNG}
              radiusKm={filters.maxDistance}
            />
          </div>
        )}
        <div className="text-white text-xl mb-4">
        {filteredHotels.length} hotels
        </div>

        {/* Hotel List */}
        {loading ? (
          <div className="text-center py-8 text-gray-200">
            Loading hotels...
          </div>
        ) : (
          <HotelList
            hotels={filteredHotels}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
            userLocation={userLocation}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { hotelService, favoriteService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { HotelMap } from "../components/HotelMap";
import { HotelList } from "../components/HotelCard";
import { AnnouncementPopup } from "../components/AnnouncementPopup";
import { Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [hotels, setHotels] = useState([]);
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
    maxDistance: 3,
  });

  // Udon Thani Tech College coordinates (consistent)
  const TECH_COLLEGE_LAT = 17.41604449545236;
  const TECH_COLLEGE_LNG = 102.78876831049472;

  useEffect(() => {
    loadHotels();
    if (user) loadFavorites();
    initializeGPS();
  }, [user]);
  useEffect(() => {
    // ถ้ายังไม่พิมพ์อะไร → ไม่ต้อง filter
    if (!filters.maxDistance) return;

    const timeout = setTimeout(() => {
      handleAutoFilter();
    }, 400); // รอ 400ms หลังหยุดพิมพ์

    return () => clearTimeout(timeout);
  }, [filters.maxDistance]);

  const initializeGPS = () => {
    console.log("Requesting geolocation...");
    if (!navigator.geolocation) {
      alert(t("homePage.gpsError"));
      console.log("Geolocation API not supported");
      return;
    }

    setGpsLoading(true);
    const timeoutId = setTimeout(() => {
      setGpsLoading(false);
      alert(t("homePage.gpsTimeout"));
      console.log("Geolocation request timed out");
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGpsLoading(false);
        console.log("Geolocation success:", latitude, longitude);
      },
      (error) => {
        clearTimeout(timeoutId);
        let errorMsg = "Could not get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg =
              "Permission denied. Please enable location access in browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "GPS signal not available. Try again in an open area.";
            break;
          case error.TIMEOUT:
            errorMsg = "GPS request timed out. Please try again.";
            break;
        }
        console.log("GPS Error:", errorMsg, error);
        setGpsLoading(false);
      },
      {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  const loadHotels = async () => {
    try {
      const response = await hotelService.getAll();
      setHotels(response.data);
      setFilteredHotels(response.data);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    try {
      const response = await hotelService.filter(cleanFilters);
      setFilteredHotels(response.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

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

      setHotels(response.data);
    } catch (err) {
      console.error("AUTO FILTER ERROR:", err);
    }
  };

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

  return (
    <div className="min-h-screen animate-fade-in">
      <AnnouncementPopup />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 md:py-12 animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            UD Hotels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-300 mt-4"
          >
            ค้นหาที่พักในอุดรธานีได้ง่าย ๆ กับเรา!
          </motion.p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 animate-slide-in-up">
        {/* GPS Status Bar */}
        {userLocation && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-green-700 flex items-center gap-2">
              <MapPin size={16} className="text-green-600 animate-pulse" />
              📍 Location: {userLocation.lat.toFixed(4)},{" "}
              {userLocation.lng.toFixed(4)}
            </span>
            <button
              onClick={initializeGPS}
              disabled={gpsLoading}
              className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {gpsLoading ? "Getting Location..." : "Update Location"}
            </button>
          </div>
        )}
        {!userLocation && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-amber-700 flex items-center gap-2">
              ⚠️ Enable location for distance calculations and better hotel
              search
              <br />
              <span className="text-xs text-amber-600 mt-1">
                Make sure GPS is ON and app has permission to access location
              </span>
            </span>
            <button
              onClick={initializeGPS}
              disabled={gpsLoading}
              className="text-xs bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 disabled:opacity-50 whitespace-nowrap ml-2"
            >
              {gpsLoading ? "Detecting..." : "Enable GPS"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="lg:col-span-2">
            <div className="flex gap-2 flex-col md:flex-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels, locations..."
                className="flex-1 p-3 border rounded-lg text-sm text-purple-400"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Box */}
          <form onSubmit={handleFilter} className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-purple-400">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="p-2 border rounded text-xs md:text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="p-2 border rounded text-xs md:text-sm"
              />
              <select
                value={filters.minRating}
                onChange={(e) =>
                  setFilters({ ...filters, minRating: e.target.value })
                }
                className="p-2 border rounded text-xs md:text-sm"
              >
                <option value="">Min Rating</option>
                <option value="1">1+ stars</option>
                <option value="2">2+ stars</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
              </select>

              <div className="mt-4">
                <label className="block text-xs md:text-sm text-gray-300 mb-2">
                  ระยะทางจากวิทยาลัยไม่เกิน:
                  <span className="text-purple-400 font-bold ml-2">
                    {filters.maxDistance} กม.
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
                  className="w-full accent-purple-500"
                />
              </div>

              <button
                type="submit"
                className="bg-secondary text-white px-4 py-2 rounded text-sm hover:bg-orange-600"
              >
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Map View */}
        {filteredHotels.length > 0 && (
          <div className="mb-12 animate-fade-in relative z-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">
              Map View
            </h2>
            <HotelMap
              hotels={filteredHotels}
              userLocation={userLocation}
              centerLat={TECH_COLLEGE_LAT}
              centerLng={TECH_COLLEGE_LNG}
              radiusKm={filters.maxDistance}
            />
          </div>
        )}

        {/* Hotel Listing */}
        <div className="animate-slide-in-up">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-100">
            Hotel Listings
          </h2>
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
      </div>
    </div>
  );
};

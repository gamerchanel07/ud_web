import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, Edit2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const API_BASE_URL = "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "/no-image.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if ([lat1, lon1, lat2, lon2].some((v) => typeof v !== "number")) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

export const HotelCard = ({
  hotel,
  onFavoriteToggle,
  isFavorited,
  userLocation,
  onEdit, // ⭐ ถ้ามี = admin
}) => {
  const navigate = useNavigate();

  const heroImage =
    hotel.imageUrl ||
    (Array.isArray(hotel.galleryImages) && hotel.galleryImages[0]) ||
    null;

  const distanceFromCollege = calculateDistance(
    TECH_COLLEGE_LAT,
    TECH_COLLEGE_LNG,
    hotel.latitude,
    hotel.longitude,
  );

  const distanceFromUser = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hotel.latitude,
        hotel.longitude,
      )
    : null;

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hotel-card group card-enter"
    >
      <img
        src={getImageUrl(heroImage)}
        alt={hotel.name}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => (e.currentTarget.src = "/no-image.png")}
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-100">{hotel.name}</h3>
        <p className="text-sm text-gray-400">{hotel.location}</p>

        <div className="flex justify-between items-center my-2">
          <span className="text-xl font-bold text-pink-400">
            ฿{Number(hotel.price ?? 0).toLocaleString()}
          </span>

          <button onClick={() => onFavoriteToggle(hotel.id)}>
            <Heart
              size={24}
              className={
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
              }
            />
          </button>
        </div>

        <div className="text-sm text-gray-300 space-y-1 mb-3">
          {distanceFromCollege && (
            <div className="flex gap-2">
              <MapPin size={16} /> {distanceFromCollege} km from Tech College
            </div>
          )}
          {distanceFromUser && (
            <div className="flex gap-2">
              <MapPin size={16} /> {distanceFromUser} km from you
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/hotel/${hotel.id}`)}
          className="w-full bg-ocean-600 text-white py-2 rounded"
        >
          View Details
        </button>

        {/* ⭐ Edit เฉพาะ admin */}
        {onEdit && (
          <button
            onClick={() => onEdit(hotel)}
            className="w-full mt-2 bg-yellow-500 text-white py-2 rounded flex items-center justify-center gap-1 text-sm"
          >
            <Edit2 size={16} /> Edit
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const HotelList = ({
  hotels,
  onFavoriteToggle,
  favorites,
  userLocation,
  onEdit,
}) => {
  if (!hotels?.length) {
    return (
      <div className="text-center text-gray-400 py-8">No hotels found</div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          onFavoriteToggle={onFavoriteToggle}
          isFavorited={favorites?.includes(hotel.id)}
          userLocation={userLocation}
          onEdit={onEdit}
        />
      ))}
    </motion.div>
  );
};

export default HotelCard;

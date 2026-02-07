import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, Edit2, Eye } from "lucide-react";
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
        parseFloat(hotel.latitude),
        parseFloat(hotel.longitude),
      )
    : null;

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="card"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
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
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '12rem',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)'
      }} className="group">
        <img
          src={getImageUrl(heroImage)}
          alt={hotel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-out',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => (e.currentTarget.src = "/no-image.png")}
        />
        
        {/* Badge overlay */}
        <div style={{
          position: 'absolute',
          top: 'var(--spacing-sm)',
          right: 'var(--spacing-sm)',
          backgroundColor: 'rgba(0, 173, 181, 0.95)',
          backdropFilter: 'blur(12px)',
          padding: 'var(--spacing-xs) var(--spacing-md)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-bold)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 24px rgba(0, 173, 181, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 1)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 173, 181, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.95)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 173, 181, 0.4)';
        }}>
          <Star size={16} style={{color: 'white'}} fill="white" />
          {hotel.rating?.toFixed(1) || 'N/A'}
        </div>

        {/* Stats badges */}
        <div style={{
          position: 'absolute',
          bottom: 'var(--spacing-sm)',
          right: 'var(--spacing-sm)',
          display: 'flex',
          gap: 'var(--spacing-sm)',
          zIndex: 5
        }}>
          {/* Views badge */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Eye size={14} />
            {hotel.views || 0}
          </div>
        </div>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: 'var(--spacing-sm)',
          gap: 'var(--spacing-sm)'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--spacing-xs) 0'
            }}>{hotel.name}</h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)'
            }}>
              <MapPin size={14} /> {hotel.location}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(hotel.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Heart
                size={24}
                style={{
                  color: isFavorited ? 'var(--color-error)' : 'var(--text-tertiary)',
                  fill: isFavorited ? 'var(--color-error)' : 'none'
                }}
              />
            </button>
            {/* Favorites count */}
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              fontWeight: 'bold'
            }}>
              {hotel.favoritesCount || 0}
            </span>
          </div>
        </div>

        {/* Distance Info - Top */}
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
          marginBottom: 'auto',
          flex: 1
        }}>
          {distanceFromCollege && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <MapPin size={14} /> {distanceFromCollege} km from Tech College
            </div>
          )}
        </div>

        {/* Bottom Section - Distance for you (left) and Price (right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--border-light)'
        }}>
          {/* Distance from You - Left */}
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            {distanceFromUser ? (
              <>
                <MapPin size={14} />
                <span>{distanceFromUser} km for you</span>
              </>
            ) : (
              <span style={{color: 'var(--text-tertiary)'}}>-</span>
            )}
          </div>

          {/* Price - Right */}
          <p style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--primary-main)',
            margin: 0
          }}>
            ฿{Number(hotel.price ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        paddingTop: 'var(--spacing-sm)',
        borderTop: '1px solid var(--border-light)'
      }}>
        {/* Edit button - Admin only */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(hotel);
            }}
            className="btn btn-secondary"
            style={{ width: '100%' }}
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
      <div className="text-center py-8">No hotels found</div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
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

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { adminService } from "../services/api";
import { MapPin, Camera, X, Building2, Navigation, Zap, Phone, MessageSquare, Save, CheckCircle } from "lucide-react";

const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

const AMENITIES_OPTIONS = [
  "WiFi",
  "Air Conditioning",
  "Parking",
  "Restaurant",
  "Pool",
  "Gym",
  "Free Airport Shuttle",
  "Study Area",
  "Café",
  "Spa",
  "Laundry Service",
  "24/7 Reception",
];

export const HotelForm = ({
  formData,
  setFormData,
  editingHotel,
  onCancel,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const [nearbyInput, setNearbyInput] = useState("");
  const [loading, setLoading] = useState(false);
  

  // คำนวณระยะทางจากวิทยาลัยเทคโนโลยี
  const calculateDistance = (lat, lng) => {
    const R = 6371; // รัศมีของโลกเป็นกิโลเมตร
    const dLat = ((TECH_COLLEGE_LAT - lat) * Math.PI) / 180;
    const dLng = ((TECH_COLLEGE_LNG - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((TECH_COLLEGE_LAT * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    // คำนวณระยะทางโดยอัตโนมัติถ้าเปลี่ยนละติจูด/ลองจิจูด
    if (
      (name === "latitude" || name === "longitude") &&
      formData.latitude &&
      formData.longitude
    ) {
      const lat =
        name === "latitude" ? parseFloat(value) : parseFloat(formData.latitude);
      const lng =
        name === "longitude"
          ? parseFloat(value)
          : parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        newData.distanceToTechCollege = calculateDistance(lat, lng);
      }
    }
    setFormData(newData);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleCoordinateChange = (e) => {
    const { value } = e.target;
    // แยกพิกัดที่คั่นด้วยจุลภาค
    const parts = value.split(",").map((p) => p.trim());

    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        const distance = calculateDistance(lat, lng);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          distanceToTechCollege: distance,
        }));
      }
    }
  };

  const handleSubmitHotel = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        lineId: formData.lineId,
      };

      if (editingHotel) {
        await adminService.updateHotel(editingHotel.id, payload);
      } else {
        await adminService.addHotel(payload);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving hotel:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกโรงแรม");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid rgba(0, 173, 181, 0.2)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      animation: 'slide-in-down 0.5s ease'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Building2 size={28} style={{color: 'var(--primary-main)'}} />
        {editingHotel ? "แก้ไขโรงแรม" : t("admin.addHotel")}
      </h2>
      <form onSubmit={handleSubmitHotel} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
        {/* Basic Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <input
            type="text"
            name="name"
            placeholder={t("admin.hotelName")}
            value={formData.name}
            onChange={handleInputChange}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
            required
          />
          <input
            type="text"
            name="location"
            placeholder={t("admin.location")}
            value={formData.location}
            onChange={handleInputChange}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
            required
          />
          <input
            type="number"
            name="price"
            placeholder={t("admin.price")}
            value={formData.price}
            onChange={handleInputChange}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
            required
          />
          <select
            name="hotelType"
            value={formData.hotelType}
            onChange={handleInputChange}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s',
              cursor: 'pointer'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          >
            <option value="Budget Hotel">Budget Hotel</option>
            <option value="Standard Hotel">Standard Hotel</option>
            <option value="Business Hotel">Business Hotel</option>
            <option value="Luxury Hotel">Luxury Hotel</option>
          </select>
        </div>

        {/* Location Selection */}
        <div style={{
          backgroundColor: 'rgba(0, 173, 181, 0.05)',
          border: '2px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <MapPin size={20} style={{color: 'var(--primary-main)'}} /> {t("admin.location")} (รูปแบบ: ละติจูด, ลองจิจูด)
          </h3>
          <input
            type="text"
            placeholder="เช่น: 17.416, 102.789"
            onChange={handleCoordinateChange}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              marginBottom: '0.75rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          />
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Navigation size={16} style={{color: 'var(--primary-main)'}} /> ละติจูด: {formData.latitude || "-"} | ลองจิจูด: {formData.longitude || "-"}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Zap size={16} style={{color: '#FFC107'}} /> ระยะห่างจากวิทยาลัยเทคโนโลยี: {formData.distanceToTechCollege ? `${formData.distanceToTechCollege} กม.` : "คำนวณโดยอัตโนมัติ"}
          </div>
        </div>

        {/* Image Upload */}
        <div style={{
          backgroundColor: 'rgba(0, 173, 181, 0.05)',
          border: '2px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Camera size={20} style={{color: 'var(--primary-main)'}} /> รูปภาพ
          </h3>

          {/* Image Preview */}
          {formData.galleryImages.length > 0 && (
            <div style={{
              marginBottom: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '0.75rem'
            }}>
              {formData.galleryImages.map((img, idx) => (
                <div key={idx} style={{position: 'relative'}}>
                  <img
                    src={img}
                    alt={`Preview ${idx}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '0.375rem',
                      border: '2px solid rgba(0, 173, 181, 0.3)'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '0.25rem',
                      right: '0.25rem',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '0.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
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
            placeholder="URL รูปภาพหลัก"
            value={formData.imageUrl}
            onChange={handleInputChange}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          />
          {/* Gallery Upload */}
          <input
            type="text"
            placeholder="URL รูปภาพแกลเลอรี่ (กด Enter)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const url = e.target.value.trim();
                if (!url) return;
                if (!url.startsWith("http")) return;
                setFormData((prev) => ({
                  ...prev,
                  galleryImages: [...prev.galleryImages, url],
                }));
                e.target.value = "";
              }
            }}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          />
        </div>

        {/* Amenities Selection */}
        <div style={{
          backgroundColor: 'rgba(0, 173, 181, 0.05)',
          border: '2px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Zap size={20} style={{color: 'var(--primary-main)'}} />
            {t("admin.amenities")}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem'
          }}>
            {AMENITIES_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: formData.amenities.includes(amenity) ? 'rgba(0, 173, 181, 0.15)' : 'transparent',
                  border: `1px solid ${formData.amenities.includes(amenity) ? 'var(--primary-main)' : 'rgba(0, 173, 181, 0.1)'}`,
                  transition: 'all 0.3s'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid var(--primary-main)',
                    backgroundColor: formData.amenities.includes(amenity) ? 'var(--primary-main)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    accentColor: 'var(--primary-main)'
                  }}
                />
                <span style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem'
                }}>
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div style={{
          backgroundColor: 'rgba(0, 173, 181, 0.05)',
          border: '2px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <MapPin size={20} style={{color: 'var(--primary-main)'}} />
            สถานที่ใกล้เคียง
          </h3>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <input
              value={nearbyInput}
              onChange={(e) => setNearbyInput(e.target.value)}
              placeholder="เพิ่มสถานที่ใกล้เคียง"
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid rgba(0, 173, 181, 0.3)',
                borderRadius: '0.375rem',
                padding: '0.75rem',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
            />
            <button
              type="button"
              onClick={() => {
                if (!nearbyInput) return;
                setFormData((prev) => ({
                  ...prev,
                  nearbyPlaces: [...prev.nearbyPlaces, nearbyInput],
                }));
                setNearbyInput("");
              }}
              style={{
                backgroundColor: 'var(--primary-main)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              +
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {formData.nearbyPlaces.map((p, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: 'rgba(0, 173, 181, 0.2)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  border: '1px solid var(--primary-main)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {p}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      nearbyPlaces: prev.nearbyPlaces.filter((_, idx) => idx !== i)
                    }));
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-main)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder={t("admin.description")}
          value={formData.description}
          onChange={handleInputChange}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid rgba(0, 173, 181, 0.3)',
            borderRadius: '0.375rem',
            padding: '0.75rem',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            transition: 'border-color 0.3s',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: '6rem'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          required
        />

        {/* Contact Information */}
        <div style={{
          backgroundColor: 'rgba(0, 173, 181, 0.05)',
          border: '2px solid rgba(0, 173, 181, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Phone size={20} style={{color: 'var(--primary-main)'}} />
            ข้อมูลติดต่อ
          </h3>

          <input
            type="text"
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            value={formData.phone || ""}
            onChange={handleInputChange}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          />

          <input
            type="text"
            name="facebookUrl"
            placeholder="URL หน้า Facebook"
            value={formData.facebookUrl || ""}
            onChange={handleInputChange}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          />

          <input
            type="text"
            name="lineId"
            placeholder="LINE ID (ไม่ต้องใส่ @)"
            value={formData.lineId || ""}
            onChange={handleInputChange}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid rgba(0, 173, 181, 0.3)',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-main)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 173, 181, 0.3)'}
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem'
        }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? 'rgba(0, 173, 181, 0.5)' : 'var(--primary-main)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              transition: 'all 0.3s',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
          >
            {loading ? (
              <>
                <span style={{animation: 'spin 1s linear infinite'}}>⟳</span>
                บันทึก...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                {editingHotel ? "อัปเดต" : t("admin.addHotel")}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              backgroundColor: 'var(--text-tertiary)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              transition: 'all 0.3s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <X size={18} />
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { adminService } from "../services/api";
import { MapPin, Camera, X } from "lucide-react";

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
    <div className="glass glass-lg p-6 rounded-lg mb-8 animate-slide-in-down">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-6">
        {editingHotel ? "แก้ไขโรงแรม" : t("admin.addHotel")}
      </h2>
      <form onSubmit={handleSubmitHotel} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder={t("admin.hotelName")}
            value={formData.name}
            onChange={handleInputChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="location"
            placeholder={t("admin.location")}
            value={formData.location}
            onChange={handleInputChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="number"
            name="price"
            placeholder={t("admin.price")}
            value={formData.price}
            onChange={handleInputChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
          <select
            name="hotelType"
            value={formData.hotelType}
            onChange={handleInputChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="Budget Hotel">Budget Hotel</option>
            <option value="Standard Hotel">Standard Hotel</option>
            <option value="Business Hotel">Business Hotel</option>
            <option value="Luxury Hotel">Luxury Hotel</option>
          </select>
        </div>

        {/* Location Selection */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-blue-400 font-bold mb-4 flex items-center gap-2">
            <MapPin size={20} /> {t("admin.location")} (Format: latitude,
            longitude)
          </h3>
          <input
            type="text"
            placeholder="เช่น: 17.416, 102.789"
            onChange={handleCoordinateChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-3"
          />
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            📍 Latitude: {formData.latitude || "-"} | Longitude:{" "}
            {formData.longitude || "-"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            📏 Distance to Tech College:{" "}
            {formData.distanceToTechCollege
              ? `${formData.distanceToTechCollege} km`
              : "Auto-calculated"}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-blue-400 font-bold mb-4 flex items-center gap-2">
            <Camera size={20} /> Images
          </h3>

          {/* Image Preview */}
          {formData.galleryImages.length > 0 && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {formData.galleryImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${idx}`}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />
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
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white mb-2"
          />
          {/* Gallery Upload */}
          <input
            type="text"
            placeholder="Gallery Image URL (กด Enter)"
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
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
          />
        </div>

        {/* Amenities Selection */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white font-bold mb-4">
            {t("admin.amenities")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AMENITIES_OPTIONS.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:bg-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white font-bold mb-4">
            Nearby Places
          </h3>

          <div className="flex gap-2 mb-3">
            <input
              value={nearbyInput}
              onChange={(e) => setNearbyInput(e.target.value)}
              placeholder="Add nearby place"
              className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
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
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 rounded"
            >
              +
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.nearbyPlaces.map((p, i) => (
              <span
                key={i}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm"
              >
                {p}
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
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
          rows="4"
          required
        />

        {/* Contact Information */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white font-bold mb-4">
            Contact Information
          </h3>

          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white mb-3"
          />

          <input
            type="text"
            name="facebookUrl"
            placeholder="Facebook Page URL"
            value={formData.facebookUrl || ""}
            onChange={handleInputChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white mb-3"
          />

          <input
            type="text"
            name="lineId"
            placeholder="LINE ID (ไม่ต้องใส่ @)"
            value={formData.lineId || ""}
            onChange={handleInputChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white py-2 rounded font-bold text-sm transition-all disabled:opacity-50"
          >
            {loading
              ? "⟳ บันทึก..."
              : `✓ ${editingHotel ? "อัปเดต" : t("admin.addHotel")}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 rounded font-bold text-sm transition-all"
          >
            ✕ ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

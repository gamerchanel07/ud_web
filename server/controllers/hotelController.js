const { Hotel, Review, User, Favorite } = require("../models");
const { Op } = require("sequelize");
const TECH_COLLEGE_LAT = 17.41604449545236;
const TECH_COLLEGE_LNG = 102.78876831049472;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      if (value.startsWith("http")) {
        return [value];
      }
      return fallback;
    }
  }

  return fallback;
};

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: [{ model: Review, attributes: ["id", "rating"] }],
    });

    const result = hotels.map((hotel) => {
      const data = hotel.toJSON();
      const reviews = data.Reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        galleryImages: safeParse(data.galleryImages),
        amenities: safeParse(data.amenities),
        nearbyPlaces: safeParse(data.nearbyPlaces),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("getAllHotels error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch hotels", error: err.message });
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          include: [{ model: User, attributes: ["username", "email"] }],
        },
      ],
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const data = hotel.toJSON();
    const reviews = data.Reviews || [];
    const avgRating = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    let isFavorited = false;
    if (req.userId) {
      const fav = await Favorite.findOne({
        where: { userId: req.userId, hotelId: data.id },
      });
      isFavorited = !!fav;
    }

    res.json({
      ...data,
      galleryImages: safeParse(data.galleryImages),
      amenities: safeParse(data.amenities),
      nearbyPlaces: safeParse(data.nearbyPlaces),
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
      isFavorited,
    });
  } catch (err) {
    console.error("getHotelById error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch hotel", error: err.message });
  }
};

// Search hotels
exports.searchHotels = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const hotels = await Hotel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { location: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: Review, attributes: ["id", "rating"] }],
    });

    const result = hotels.map((hotel) => {
      const data = hotel.toJSON();
      const reviews = data.Reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        galleryImages: safeParse(data.galleryImages),
        amenities: safeParse(data.amenities),
        nearbyPlaces: safeParse(data.nearbyPlaces),
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("searchHotels error:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

// Filter hotels
exports.filterHotels = async (req, res) => {
  try {
    const { minPrice, maxPrice, maxDistance, keyword } = req.query;

    const where = {};

    // 🔍 Search by keyword
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { location: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    // 💰 Filter by price
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    console.log("FILTER QUERY:", req.query);

    const hotels = await Hotel.findAll({
      where,
      include: [{ model: Review, attributes: ["id", "rating"] }],
    });

    let result = hotels.map((hotel) => {
      const data = hotel.toJSON();
      const reviews = data.Reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        galleryImages: safeParse(data.galleryImages),
        amenities: safeParse(data.amenities),
        nearbyPlaces: safeParse(data.nearbyPlaces),
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    });

    // ✅ FILTER BY DISTANCE FROM TECH COLLEGE
    if (maxDistance) {
      const maxKm = Number(maxDistance);

      result = result.filter((hotel) => {
        if (!hotel.latitude || !hotel.longitude) return false;

        const distance = calculateDistance(
          TECH_COLLEGE_LAT,
          TECH_COLLEGE_LNG,
          hotel.latitude,
          hotel.longitude,
        );

        return distance <= maxKm;
      });
    }

    res.json(result);
  } catch (err) {
    console.error("filterHotels error:", err);
    res.status(500).json({ message: "Filter failed", error: err.message });
  }
};

const { Hotel, Review, User, Favorite } = require('../models');
const { Op } = require('sequelize');

const parseJSON = (value, fallback = []) => {
  try {
    if (Array.isArray(value)) return value;
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: [{ model: Review, attributes: ['id', 'rating'] }]
    });

    const result = hotels.map(hotel => {
      const data = hotel.toJSON();
      const reviews = data.Reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        galleryImages: parseJSON(data.galleryImages),
        amenities: parseJSON(data.amenities),
        nearbyPlaces: parseJSON(data.nearbyPlaces),
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length
      };
    });

    res.json(result);
  } catch (err) {
    console.error('getAllHotels error:', err);
    res.status(500).json({ message: 'Failed to fetch hotels', error: err.message });
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{ model: User, attributes: ['username', 'email'] }]
      }]
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const data = hotel.toJSON();
    const reviews = data.Reviews || [];
    const avgRating = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    let isFavorited = false;
    if (req.userId) {
      const fav = await Favorite.findOne({
        where: { userId: req.userId, hotelId: data.id }
      });
      isFavorited = !!fav;
    }

    res.json({
      ...data,
      galleryImages: parseJSON(data.galleryImages),
      amenities: parseJSON(data.amenities),
      nearbyPlaces: parseJSON(data.nearbyPlaces),
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: reviews.length,
      isFavorited
    });
  } catch (err) {
    console.error('getHotelById error:', err);
    res.status(500).json({ message: 'Failed to fetch hotel', error: err.message });
  }
};

// Search hotels
exports.searchHotels = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const hotels = await Hotel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { location: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [{ model: Review, attributes: ['id', 'rating'] }]
    });

    const result = hotels.map(hotel => {
      const data = hotel.toJSON();
      const reviews = data.Reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        galleryImages: JSON.parse(data.galleryImages || '[]'),
        amenities: JSON.parse(data.amenities || '[]'),
        nearbyPlaces: JSON.parse(data.nearbyPlaces || '[]'),
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length
      };
    });

    res.json(result);
  } catch (err) {
    console.error('searchHotels error:', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// Filter hotels
exports.filterHotels = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const where = {};
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const hotels = await Hotel.findAll({
      where,
      include: [{ model: Review, attributes: ['id', 'rating'] }]
    });

    const result = hotels.map(hotel => {
      const data = hotel.toJSON();
      const reviews = data.Reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

      return {
        ...data,
        galleryImages: JSON.parse(data.galleryImages || '[]'),
        amenities: JSON.parse(data.amenities || '[]'),
        nearbyPlaces: JSON.parse(data.nearbyPlaces || '[]'),
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: reviews.length
      };
    });

    res.json(result);
  } catch (err) {
    console.error('filterHotels error:', err);
    res.status(500).json({ message: 'Filter failed', error: err.message });
  }
};

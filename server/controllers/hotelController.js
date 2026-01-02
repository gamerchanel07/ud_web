const { Hotel, Review, User, Favorite } = require('../models');
const { Op } = require('sequelize');

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: [
        {
          model: Review,
          attributes: ['id', 'rating']
        }
      ]
    });

    const hotelsWithAvgRating = hotels.map(hotel => {
      const reviews = hotel.Reviews || [];
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

      return {
        ...hotel.toJSON(),
        avgRating: parseFloat(avgRating),
        reviewCount: reviews.length
      };
    });

    res.json(hotelsWithAvgRating);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hotels', error: err.message });
  }
};

// Get hotel by ID with reviews
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          include: [{ model: User, attributes: ['username', 'email'] }]
        }
      ]
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const reviews = hotel.Reviews || [];
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    const isFavorited = req.userId
      ? await Favorite.findOne({ where: { userId: req.userId, hotelId: hotel.id } })
      : false;

    res.json({
      ...hotel.toJSON(),
      avgRating: parseFloat(avgRating),
      reviewCount: reviews.length,
      isFavorited: !!isFavorited
    });
  } catch (err) {
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
          { name: { [Op.iLike]: `%${query}%` } },
          { location: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{ model: Review, attributes: ['id', 'rating'] }]
    });

    const hotelsWithAvgRating = hotels.map(hotel => {
      const reviews = hotel.Reviews || [];
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

      return {
        ...hotel.toJSON(),
        avgRating: parseFloat(avgRating),
        reviewCount: reviews.length
      };
    });

    res.json(hotelsWithAvgRating);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// Filter hotels
exports.filterHotels = async (req, res) => {
  try {
    const { minPrice, maxPrice, minRating, hotelType, nearbyPlace } = req.query;

    const where = {};
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (hotelType) {
      where.hotelType = hotelType;
    }

    let hotels = await Hotel.findAll({
      where,
      include: [{ model: Review, attributes: ['id', 'rating'] }]
    });

    // Filter by rating
    if (minRating) {
      hotels = hotels.filter(hotel => {
        const reviews = hotel.Reviews || [];
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
        return avgRating >= minRating;
      });
    }

    // Filter by nearby places
    if (nearbyPlace) {
      hotels = hotels.filter(hotel => {
        const nearbyPlaces = hotel.nearbyPlaces || [];
        return nearbyPlaces.some(place =>
          place.toLowerCase().includes(nearbyPlace.toLowerCase())
        );
      });
    }

    const hotelsWithAvgRating = hotels.map(hotel => {
      const reviews = hotel.Reviews || [];
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

      return {
        ...hotel.toJSON(),
        avgRating: parseFloat(avgRating),
        reviewCount: reviews.length
      };
    });

    res.json(hotelsWithAvgRating);
  } catch (err) {
    res.status(500).json({ message: 'Filter failed', error: err.message });
  }
};

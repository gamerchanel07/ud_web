const { Hotel, Review, User, Favorite } = require('../models');
const { Op } = require('sequelize');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalHotels,
      totalReviews,
      totalUsers,
      totalFavorites,
      recentReviews,
      topRatedHotels,
      mostFavoritedHotels
    ] = await Promise.all([
      Hotel.count(),
      Review.count(),
      User.count(),
      Favorite.count(),
      Review.findAll({
        include: [
          { model: User, attributes: ['username'] },
          { model: Hotel, attributes: ['id', 'name'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      Hotel.findAll({
        attributes: ['id', 'name', 'rating', 'price'],
        order: [['rating', 'DESC']],
        limit: 5
      }),
      Hotel.findAll({
        attributes: [
          'id',
          'name',
          'price',
          [require('sequelize').fn('COUNT', require('sequelize').col('Favorites.id')), 'favoriteCount']
        ],
        include: [
          { model: Favorite, attributes: [] }
        ],
        group: ['Hotel.id'],
        subQuery: false,
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('Favorites.id')), 'DESC']],
        limit: 5,
        raw: true
      })
    ]);

    // Get reviews by rating distribution
    const reviewsByRating = await Review.findAll({
      attributes: [
        'rating',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    // Get hotels by type
    const hotelsByType = await Hotel.findAll({
      attributes: [
        'hotelType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['hotelType'],
      raw: true
    });

    // Calculate average rating
    const avgRatingResult = await Review.findAll({
      attributes: [[require('sequelize').fn('AVG', require('sequelize').col('rating')), 'avgRating']],
      raw: true
    });
    const avgRating = avgRatingResult[0]?.avgRating || 0;

    res.json({
      stats: {
        totalHotels,
        totalReviews,
        totalUsers,
        totalFavorites,
        avgRating: parseFloat(avgRating).toFixed(1)
      },
      recentReviews: recentReviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        user: r.User?.username || 'Unknown',
        hotel: r.Hotel?.name,
        createdAt: r.createdAt
      })),
      topRatedHotels: topRatedHotels.map(h => ({
        id: h.id,
        name: h.name,
        rating: h.rating,
        price: h.price
      })),
      mostFavoritedHotels: mostFavoritedHotels.map(h => ({
        id: h.id,
        name: h.name,
        price: h.price,
        favoriteCount: h.favoriteCount || 0
      })),
      reviewsByRating: reviewsByRating.sort((a, b) => a.rating - b.rating),
      hotelsByType
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get dashboard stats', error: err.message });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await Review.findAll({
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: Hotel, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json(activities.map(a => ({
      id: a.id,
      type: 'review',
      user: a.User?.username || 'Unknown',
      hotel: a.Hotel?.name,
      action: `Reviewed "${a.Hotel?.name}" with ${a.rating} stars`,
      timestamp: a.createdAt
    })));
  } catch (err) {
    res.status(500).json({ message: 'Failed to get activities', error: err.message });
  }
};

// Get hotel management data
exports.getHotelManagement = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      attributes: ['id', 'name', 'price', 'location', 'rating'],
      include: [
        {
          model: Review,
          attributes: ['id'],
          required: false
        },
        {
          model: Favorite,
          attributes: ['id'],
          required: false
        }
      ],
      raw: true,
      subQuery: false,
      order: [['createdAt', 'DESC']]
    });

    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get hotel management data', error: err.message });
  }
};

// Get user management data
exports.getUserManagement = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: Review,
          attributes: ['id'],
          required: false
        }
      ],
      raw: true,
      subQuery: false,
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user management data', error: err.message });
  }
};

const { Review, Hotel, User } = require('../models');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { hotelId, rating, comment, images } = req.body;

    if (!hotelId || !rating) {
      return res.status(400).json({ message: 'Hotel ID and rating required' });
    }

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const review = await Review.create({
      userId: req.userId,
      hotelId,
      rating,
      comment,
      images: images || []
    });

    // Update hotel average rating
    const reviews = await Review.findAll({ where: { hotelId } });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await hotel.update({ rating: avgRating });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

// Get reviews for hotel
exports.getReviewsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await Review.findAll({
      where: { hotelId },
      include: [{ model: User, attributes: ['username', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.userId },
      include: [{ model: Hotel, attributes: ['id', 'name', 'imageUrl'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// Delete review (admin only)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const hotelId = review.hotelId;
    await review.destroy();

    // Update hotel average rating
    const hotel = await Hotel.findByPk(hotelId);
    const reviews = await Review.findAll({ where: { hotelId } });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await hotel.update({ rating: avgRating });

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

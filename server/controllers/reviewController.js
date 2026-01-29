const { Review, Hotel, User } = require('../models');

// สร้างรีวิว
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

// ดึงรีวิวของโรงแรม
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

// ดึงรีวิวของผู้ใช้งาน
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

// ลบรีวิว (ผู้ใช้งานตัดเยืองมึงเท่านั้น ผูดริิ่นลบได่ท้ัง)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // ตรวจสอบว่าผู้ใช้งานเป็นเจ้าหรือผูดริิ่น
    if (review.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
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

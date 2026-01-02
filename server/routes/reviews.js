const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, reviewController.createReview);
router.get('/hotel/:hotelId', reviewController.getReviewsByHotel);
router.get('/my-reviews', authMiddleware, reviewController.getUserReviews);
router.delete('/:reviewId', authMiddleware, adminMiddleware, reviewController.deleteReview);

module.exports = router;

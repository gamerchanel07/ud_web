const express = require('express');
const hotelController = require('../controllers/hotelController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', hotelController.getAllHotels);
router.get('/search', hotelController.searchHotels);
router.get('/filter', hotelController.filterHotels);
router.post('/:id/view', hotelController.incrementViews);
router.get('/:id', hotelController.getHotelById);

module.exports = router;

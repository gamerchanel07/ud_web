const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, dashboardController.getDashboardStats);
router.get('/activity', authMiddleware, adminMiddleware, dashboardController.getRecentActivity);
router.get('/hotels', authMiddleware, adminMiddleware, dashboardController.getHotelManagement);
router.get('/users', authMiddleware, adminMiddleware, dashboardController.getUserManagement);

module.exports = router;

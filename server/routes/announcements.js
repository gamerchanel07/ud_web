const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', announcementController.getActive);

// Admin routes
router.get('/all', protect, authorize('admin'), announcementController.getAll);
router.post('/', protect, authorize('admin'), announcementController.create);
router.put('/:id', protect, authorize('admin'), announcementController.update);
router.delete('/:id', protect, authorize('admin'), announcementController.delete);

module.exports = router;

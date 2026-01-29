const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// เส้นทางสาธารณะ
router.get('/', announcementController.getActive);

// เส้นทางผู้ดูแล
router.get('/all', protect, authorize('admin'), announcementController.getAll);
router.post('/', protect, authorize('admin'), announcementController.create);
router.put('/:id', protect, authorize('admin'), announcementController.update);
router.delete('/:id', protect, authorize('admin'), announcementController.delete);

module.exports = router;

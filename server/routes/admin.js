const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');


const router = express.Router();

router.post('/hotels', authMiddleware, adminMiddleware, adminController.addHotel);
router.put('/hotels/:id', authMiddleware, adminMiddleware, adminController.updateHotel);
router.delete('/hotels/:id', authMiddleware, adminMiddleware, adminController.deleteHotel);

// เส้นทางจัดการผู้ใช้
router.post('/users', adminController.createUser);
router.put('/users/:userId/username', protect, authorize('admin'), adminController.updateUserUsername);
router.put('/users/:userId/password', protect, authorize('admin'), adminController.updateUserPassword);
router.delete('/users/:userId', protect, authorize('admin'), adminController.deleteUser);

module.exports = router;

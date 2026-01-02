const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllActivityLogs,
  getActivityLogsByAction,
  getActivityLogsByUser,
  getActivityStats,
  deleteOldActivityLogs
} = require('../controllers/activityLogController');

// ดึงบันทึกกิจกรรมทั้งหมด - ผู้ดูแลระบบเท่านั้น
router.get('/', protect, authorize('admin'), getAllActivityLogs);

// ดึงสถิติกิจกรรม - ผู้ดูแลระบบเท่านั้น
router.get('/stats', protect, authorize('admin'), getActivityStats);

// ดึงบันทึกกิจกรรมตามประเภท - ผู้ดูแลระบบเท่านั้น
router.get('/by-action/:action', protect, authorize('admin'), getActivityLogsByAction);

// ดึงบันทึกกิจกรรมตามผู้ใช้ - ผู้ดูแลระบบเท่านั้น
router.get('/by-user/:userId', protect, authorize('admin'), getActivityLogsByUser);

// ลบบันทึกกิจกรรมที่เก่า - ผู้ดูแลระบบเท่านั้น
router.delete('/cleanup', protect, authorize('admin'), deleteOldActivityLogs);

module.exports = router;

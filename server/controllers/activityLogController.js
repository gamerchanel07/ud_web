const { ActivityLog, User } = require('../models');

// ดึงบันทึกกิจกรรมทั้งหมด (สำหรับผู้ดูแลระบบเท่านั้น)
exports.getAllActivityLogs = async (req, res) => {
  try {
    // รับพารามิเตอร์ pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // ดึงข้อมูลบันทึกกิจกรรมพร้อมข้อมูลผู้ใช้
    const { count, rows } = await ActivityLog.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // คำนวณจำนวนหน้า
    const totalPages = Math.ceil(count / limit);

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถดึงบันทึกกิจกรรม', error: err.message });
  }
};

// ดึงบันทึกกิจกรรมตามประเภท
exports.getActivityLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where: { action },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถดึงบันทึกกิจกรรม', error: err.message });
  }
};

// ดึงบันทึกกิจกรรมตามผู้ใช้
exports.getActivityLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถดึงบันทึกกิจกรรม', error: err.message });
  }
};

// สร้างบันทึกกิจกรรมใหม่ (ใช้งานภายใน)
exports.createActivityLog = async (
  action,
  description,
  userId = null,
  targetId = null,
  targetType = null,
  metadata = {},
  ipAddress = null
) => {
  try {
    await ActivityLog.create({
      action,
      description,
      userId,
      targetId,
      targetType,
      metadata,
      ipAddress
    });
  } catch (err) {
    console.error('ไม่สามารถสร้างบันทึกกิจกรรม:', err);
  }
};

// ดึงสถิติกิจกรรม
exports.getActivityStats = async (req, res) => {
  try {
    // ทั้งหมด
    const totalActivities = await ActivityLog.count();

    // จำแนกตามประเภท
    const activitiesByType = await ActivityLog.findAll({
      attributes: ['action', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['action'],
      raw: true
    });

    // 7 วันที่ผ่านมา
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivities = await ActivityLog.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: sevenDaysAgo
        }
      }
    });

    res.json({
      total: totalActivities,
      byType: activitiesByType,
      recent7Days: recentActivities
    });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถดึงสถิติ', error: err.message });
  }
};

// ลบบันทึกกิจกรรมที่เก่ากว่า 90 วัน
exports.deleteOldActivityLogs = async (req, res) => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const result = await ActivityLog.destroy({
      where: {
        createdAt: {
          [require('sequelize').Op.lt]: ninetyDaysAgo
        }
      }
    });

    res.json({ message: `ลบบันทึกกิจกรรม ${result} รายการที่เก่ากว่า 90 วัน` });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถลบบันทึกกิจกรรม', error: err.message });
  }
};

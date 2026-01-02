const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// สร้างโมเดล ActivityLog สำหรับบันทึกกิจกรรมต่างๆ
const ActivityLog = sequelize.define('ActivityLog', {
  // ไอดีบันทึก
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // ประเภทกิจกรรม (user_created, user_updated, user_deleted, password_changed, role_changed, hotel_created, hotel_updated, hotel_deleted, review_created, review_deleted)
  action: {
    type: DataTypes.ENUM(
      'user_created',
      'user_updated',
      'user_deleted',
      'password_changed',
      'role_changed',
      'hotel_created',
      'hotel_updated',
      'hotel_deleted',
      'review_created',
      'review_deleted',
      'announcement_created',
      'announcement_updated',
      'announcement_deleted',
      'login',
      'logout'
    ),
    allowNull: false
  },
  // รายละเอียดของกิจกรรม
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // ไอดีผู้ใช้ที่ทำการเปลี่ยนแปลง
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // ไอดีเป้าหมายที่เกี่ยวข้อง (เช่น ไอดีของผู้ใช้ที่ถูกลบ)
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // ประเภทเป้าหมาย (user, hotel, review, announcement)
  targetType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // ข้อมูลเพิ่มเติมในรูปแบบ JSON
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  // ที่อยู่ไอพี
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'ActivityLogs',
  timestamps: true,
  underscored: true
});

// ตั้งค่าความสัมพันธ์กับ User model
ActivityLog.associate = (models) => {
  ActivityLog.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = ActivityLog;

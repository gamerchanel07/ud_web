const sequelize = require('../config/database');
const User = require('./User');
const Hotel = require('./Hotel');
const Review = require('./Review');
const Favorite = require('./Favorite');
const Announcement = require('./Announcement');
const ActivityLog = require('./ActivityLog');

// เริ่มต้นรูปแบบประกาศ
const models = {
  User,
  Hotel,
  Review,
  Favorite,
  Announcement: Announcement(sequelize),
  ActivityLog
};

// ตั้งค่าความสัมพันธ์
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Hotel.hasMany(Review, { foreignKey: 'hotelId' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId' });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Hotel.hasMany(Favorite, { foreignKey: 'hotelId' });
Favorite.belongsTo(Hotel, { foreignKey: 'hotelId' });

Hotel.hasMany(Hotel, { 
  as: 'related',
  foreignKey: 'relatedHotelId',
  allowNull: true
});

// ตั้งค่าความสัมพันธ์ ActivityLog
User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Hotel,
  Review,
  Favorite,
  Announcement: models.Announcement,
  ActivityLog
};

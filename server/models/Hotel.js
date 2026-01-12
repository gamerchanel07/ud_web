const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  galleryImages: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: ['WiFi', 'Air Conditioning']
  },
  hotelType: {
    type: DataTypes.STRING,
    defaultValue: 'Standard'
  },
  nearbyPlaces: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  distanceToTechCollege: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  phone: {
  type: DataTypes.STRING,
  allowNull: true
  },
  facebookUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lineId: {
    type: DataTypes.STRING,
    allowNull: true
  }

});

module.exports = Hotel;

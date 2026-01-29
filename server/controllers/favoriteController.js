const { Favorite } = require('../models');

// เพิ่มไปยังไหน
exports.addFavorite = async (req, res) => {
  try {
    const { hotelId } = req.body;

    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID required' });
    }

    const favorite = await Favorite.create({
      userId: req.userId,
      hotelId
    });

    res.status(201).json({
      message: 'Added to favorites',
      favorite
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    res.status(500).json({ message: 'Failed to add favorite', error: err.message });
  }
};

// ลบออกจากไปยังไหน
exports.removeFavorite = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId: req.userId, hotelId }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await favorite.destroy();

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite', error: err.message });
  }
};

// ดึงโรงแรมที่ปฤกชอยผู้ใช้งาน
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.userId },
      include: ['Hotel']
    });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: err.message });
  }
};

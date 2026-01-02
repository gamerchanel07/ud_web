const { Hotel, User, ActivityLog } = require('../models');
const bcrypt = require('bcryptjs');

// ฟังก์ชันสร้างบันทึกกิจกรรม
const logActivity = async (action, description, userId = null, targetId = null, targetType = null, metadata = {}, ipAddress = null) => {
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

// Add hotel (admin only)
exports.addHotel = async (req, res) => {
  try {
    const { name, description, price, location, latitude, longitude, imageUrl, galleryImages, amenities, hotelType, nearbyPlaces, distanceToTechCollege } = req.body;

    if (!name || !price || !location || !latitude || !longitude) {
      return res.status(400).json({ message: 'Required fields: name, price, location, latitude, longitude' });
    }

    const hotel = await Hotel.create({
      name,
      description,
      price,
      location,
      latitude,
      longitude,
      imageUrl,
      galleryImages: galleryImages || [],
      amenities: amenities || ['WiFi', 'Air Conditioning'],
      hotelType: hotelType || 'Standard',
      nearbyPlaces: nearbyPlaces || [],
      distanceToTechCollege,
      rating: 0
    });

    res.status(201).json({
      message: 'Hotel added successfully',
      hotel
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add hotel', error: err.message });
  }
};

// Update hotel (admin only)
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    await hotel.update(updates);

    res.json({
      message: 'Hotel updated successfully',
      hotel
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update hotel', error: err.message });
  }
};

// Delete hotel (admin only)
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    await hotel.destroy();

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete hotel', error: err.message });
  }
};

// อัปเดตชื่อผู้ใช้ (เฉพาะผู้ดูแลระบบ)
exports.updateUserUsername = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบว่าชื่อผู้ใช้ถูกใช้แล้วหรือไม่
    const existingUser = await User.findOne({ where: { username: username.toLowerCase() } });
    if (existingUser && existingUser.id !== parseInt(userId)) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const oldUsername = user.username;
    await user.update({ username: username.toLowerCase() });

    // บันทึกกิจกรรม
    await logActivity(
      'user_updated',
      `เปลี่ยนชื่อผู้ใช้จาก "${oldUsername}" เป็น "${username.toLowerCase()}"`,
      req.user.id,
      userId,
      'user',
      { oldUsername, newUsername: username.toLowerCase() },
      req.ip
    );

    res.json({ message: 'Username updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update username', error: err.message });
  }
};

// อัปเดตรหัสผ่านผู้ใช้ (เฉพาะผู้ดูแลระบบ)
exports.updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password || password.trim() === '') {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    // บันทึกกิจกรรม
    await logActivity(
      'password_changed',
      `เปลี่ยนรหัสผ่านสำหรับผู้ใช้ ${user.username}`,
      req.user.id,
      userId,
      'user',
      { username: user.username },
      req.ip
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password', error: err.message });
  }
};

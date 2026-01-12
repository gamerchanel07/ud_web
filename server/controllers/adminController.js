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


exports.addHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      location,
      latitude,
      longitude,
      hotelType,
      distanceToTechCollege,
      amenities,
      nearbyPlaces,
      imageUrl,
      galleryImages,
      phone,
      facebookUrl,
      lineId
    } = req.body;

    const hotel = await Hotel.create({
      name,
      description,
      price,
      location,
      latitude,
      longitude,
      hotelType,
      distanceToTechCollege,
      amenities: amenities || [],
      nearbyPlaces: nearbyPlaces || [],
      imageUrl: imageUrl || null,
      galleryImages: galleryImages || [],
      phone,
      facebookUrl,
      lineId
    });

    res.status(201).json(hotel);
  } catch (err) {
    console.error('ADD HOTEL ERROR:', err); // 👈 สำคัญ
    res.status(500).json({ message: err.message });
  }
};


// Update hotel (admin only)
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const {
      name,
      description,
      price,
      location,
      latitude,
      longitude,
      hotelType,
      distanceToTechCollege,
      amenities,
      nearbyPlaces,
      imageUrl,
      galleryImages,
      phone,
      facebookUrl,
      lineId
    } = req.body;

    await hotel.update({
      name,
      description,
      price,
      location,
      latitude,
      longitude,
      hotelType,
      distanceToTechCollege,
      amenities: amenities || [],
      nearbyPlaces: nearbyPlaces || [],
      imageUrl: imageUrl || null,
      galleryImages: galleryImages || [],
      phone,
      facebookUrl,
      lineId
    });

    res.json(hotel);
  } catch (err) {
    console.error('UPDATE HOTEL ERROR:', err);
    res.status(500).json({ message: err.message });
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


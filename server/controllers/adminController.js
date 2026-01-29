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


// อัปเดทโรงแรม (แเดมเปินลทิกลุ่มเท่านั้น)
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



// ลบโรงแรม (แเดมเปินลทิกลุ่มเท่านั้น)
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

// ลบผู้ใช้ (เฉพาะผู้ดูแลระบบ)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deletedEmail = user.email;
    await user.destroy();

    await ActivityLog.create({
      action: 'user_deleted',
      description: `Admin deleted user: ${deletedEmail}`,
      userId: req.user?.id || null,
      targetId: userId,
      targetType: 'user',
      ipAddress: req.ip
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE USER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};



// สร้างผู้ใช้ใหม่ (เฉพาะผู้ดูแลระบบ)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      username: name || email, 
      email,
      password,                
      role: role || 'user'
    });

    await ActivityLog.create({
      action: 'user_created',
      description: `Admin created user: ${user.email}`,
      userId: req.user?.id || null,
      targetId: user.id,
      targetType: 'user',
      ipAddress: req.ip
    });


    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('CREATE USER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};


// อัปเดตชื่อผู้ใช้ (เฉพาะผู้ดูแลระบบ)
exports.updateUserUsername = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    await user.save();

    await ActivityLog.create({
      action: 'user_updated',
      description: `Admin updated username for user: ${user.email}`,
      userId: req.user?.id || null,
      targetId: userId,
      targetType: 'user',
      ipAddress: req.ip
    });

    res.json({ message: 'Username updated successfully' });
  } catch (err) {
    console.error('UPDATE USERNAME ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// อัปเดตรหัสผ่านผู้ใช้ (เฉพาะผู้ดูแลระบบ)
exports.updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password; // hook จะ hash ให้
    await user.save();

    await ActivityLog.create({
      action: 'password_changed',
      description: `Admin reset password for user: ${user.email}`,
      userId: req.user?.id || null,
      targetId: userId,
      targetType: 'user',
      ipAddress: req.ip
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('UPDATE PASSWORD ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

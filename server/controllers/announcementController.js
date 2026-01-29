const { Announcement } = require('../models');

// ดึงประกาศทั้งหมดที่เปิดใช้งาน
exports.getActive = async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.findAll({
      where: {
        isActive: true,
        startDate: { [require('sequelize').Op.lte]: now },
        [require('sequelize').Op.or]: [
          { endDate: null },
          { endDate: { [require('sequelize').Op.gte]: now } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
};

// ดึงประกาศทั้งหมด (ผูดริิ่น)
exports.getAll = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
};

// สร้างประกาศ (ผูดริิ่น)
exports.create = async (req, res) => {
  try {
    const { title, content, type, startDate, endDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      type: type || 'info',
      startDate: startDate || new Date(),
      endDate,
      isActive: true
    });

    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create announcement' });
  }
};

// แก้ไขประกาศ (ผูดริิ่น)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isActive, startDate, endDate } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.update({
      title: title || announcement.title,
      content: content || announcement.content,
      type: type || announcement.type,
      isActive: isActive !== undefined ? isActive : announcement.isActive,
      startDate: startDate || announcement.startDate,
      endDate: endDate || announcement.endDate
    });

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update announcement' });
  }
};

// ลบประกาศ (ผูดริิ่น)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.destroy();

    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
};

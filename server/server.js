const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();

// Middleware (ซอฟต์แวร์ระดับกลาง)
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// เส้นทาง
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/activity-logs', require('./routes/activityLogs'));

// ตรวจสอบความเป็นส่วนตัวสำหรับระบบ
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

// จัดการ 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// จัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; 

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Sync error:', err));

    app.listen(PORT, HOST, () => {
      console.log(`\n🚀 Server running on:`);
      console.log(`   Local: http://localhost:${PORT}`);
      console.log(`   Network: http://0.0.0.0:${PORT}`);
      console.log(`   \nเปิดเซิฟเวอร์สำเร็จแล้ว\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

const jwt = require('jsonwebtoken');

// =======================
// ตรวจสอบการ login
// =======================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "ไม่มีโทเค็น - ต้องเข้าสู่ระบบ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ค่ามาตรฐานที่ใช้ทั้งระบบ
    req.userId = decoded.userId || decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "โทเค็นไม่ถูกต้อง" });
  }
};

// =======================
// ตรวจสอบ admin
// =======================
const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "ต้องเป็นผู้ดูแลระบบเท่านั้น" });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware: isAdmin,
  protect: authMiddleware,  // นามแฝงของ authMiddleware
  authorize: (role) => (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ message: `ต้องเป็น ${role} เท่านั้น` });
    }
    next();
  }
};

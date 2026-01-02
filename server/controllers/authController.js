const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');
const { sendPasswordResetEmail } = require('../services/emailService');

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

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // บันทึกกิจกรรม
    await logActivity(
      'user_created',
      `ผู้ใช้ใหม่ ${username} ลงทะเบียน`,
      user.id,
      user.id,
      'user',
      { username, email },
      req.ip
    );

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('User found, comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // บันทึกกิจกรรมเข้าสู่ระบบ
    await logActivity(
      'login',
      `ผู้ใช้ ${username} เข้าสู่ระบบ`,
      user.id,
      user.id,
      'user',
      { username },
      req.ip
    );

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user', error: err.message });
  }
};
// Forgot Password - Generate reset code and send email
exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Store reset code in database
    user.resetCode = resetCode;
    user.resetCodeExpiresAt = expiresAt;
    await user.save();

    // Send email with reset code
    try {
      await sendPasswordResetEmail(user.email, resetCode);
      console.log(`\n✅ Password reset email sent to ${user.email}`);
      console.log(`Reset Code: ${resetCode}\n`);
      
      res.json({
        message: 'Reset code sent to your email address',
        resetCode: resetCode // For development/testing
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return res.status(500).json({ 
        message: 'Password reset code generated, but failed to send email. Please contact support.' 
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to process forgot password', error: err.message });
  }
};

// Reset Password - Verify code and update password
exports.resetPassword = async (req, res) => {
  try {
    const { username, resetCode, newPassword } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate reset code exists
    if (!user.resetCode) {
      return res.status(400).json({ message: 'No reset code found. Please request a new one.' });
    }

    // Check if code is expired
    if (new Date() > user.resetCodeExpiresAt) {
      user.resetCode = null;
      user.resetCodeExpiresAt = null;
      await user.save();
      return res.status(400).json({ message: 'Reset code expired. Please request a new one.' });
    }

    // Verify code
    if (user.resetCode !== resetCode) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    // Update password
    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpiresAt = null;
    await user.save();

    // Log activity
    await logActivity(
      'password_reset',
      `ผู้ใช้ ${username} รีเซ็ตรหัสผ่าน`,
      user.id,
      null,
      null,
      {},
      null
    );

    res.json({
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
};
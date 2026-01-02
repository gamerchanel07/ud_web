const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use Gmail App Password, not regular password
  }
});

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetCode) => {
  const resetLink = `${process.env.FRONTEND_URL}/forgot-password?code=${resetCode}&email=${encodeURIComponent(email)}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - UD Hotels',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset Request</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Hello,
          </p>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 20px; line-height: 1.6;">
            We received a request to reset your password. Use the reset code below to create a new password:
          </p>
          
          <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">Your Reset Code:</p>
            <p style="margin: 10px 0 0 0; font-size: 28px; font-weight: bold; color: #667eea; letter-spacing: 3px; font-family: 'Courier New', monospace;">
              ${resetCode}
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">This code expires in 15 minutes</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; transition: transform 0.2s;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 13px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email. Your account remains secure.
          </p>
          
          <p style="font-size: 12px; color: #999; margin-top: 15px;">
            Best regards,<br>
            UD Hotels Team
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

// Test email connection
exports.testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
};

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"EpicEvents Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Registration OTP - EpicEvents',
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Your Registration OTP</h2>
        <p>Use the following 6-digit number to complete your registration:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;">${otp}</p>
        <p>This OTP is valid for 5 minutes.</p>
        <hr />
        <small style="color: #888;">If you did not request this, please ignore this email.</small>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw new Error('Failed to send OTP email.');
  }
};

module.exports = {
  sendOtpEmail,
};

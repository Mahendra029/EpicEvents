const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Your Registration OTP - EpicEvents',
      text: `Your EpicEvents OTP is: ${otp}. It expires in 5 minutes.`,
    });
    console.log(`OTP email sent to ${toEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};

module.exports = { sendOtpEmail };

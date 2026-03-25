const Admin = require('../models/Admin');
const { sendOtpEmail } = require('../config/NodeMailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Service for Step 1: Handle registration core logic
 */
const AdminRegisterService = async (userData) => {
  const { name, mobile, email } = userData;
  let admin = await Admin.findOne({ $or: [{ email }, { mobile }] });

  if (admin && admin.isVerified) {
    throw { status: 409, message: 'Email or mobile already exists.' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  if (admin) {
    Object.assign(admin, { name, mobile, email, otp, otpExpires });
    await admin.save();
  } else {
    admin = new Admin({ name, mobile, email, otp, otpExpires, isVerified: false });
    await admin.save();
  }

  await sendOtpEmail(email, otp);
  return { message: 'OTP sent to your email. Valid for 5 minutes.' };
};

/**
 * Service for Step 2: Handle OTP verification core logic
 */
const RegisterVerifyOtpService = async (email, otp) => {
  const admin = await Admin.findOne({ email });

  if (!admin) throw { status: 404, message: 'Registration not found.' };
  if (admin.isVerified) throw { status: 400, message: 'Account already verified.' };
  if (!admin.otp || admin.otp !== otp || admin.otpExpires < Date.now()) {
    throw { status: 400, message: 'Invalid or expired OTP.' };
  }

  admin.isVerified = true;
  admin.otp = undefined;
  admin.otpExpires = undefined;
  await admin.save();

  return { message: 'OTP verified. Please proceed to set your password.' };
};

/**
 * Service for Step 3: Handle password setting core logic
 */
const setPasswordService = async (email, password) => {
  const admin = await Admin.findOne({ email });

  if (!admin || !admin.isVerified) throw { status: 403, message: 'Email verification required.' };

  admin.password = password;
  await admin.save();

  return { message: 'Password set successfully. You can now login.' };
};

/**
 * Service for Login: Authenticate and return JWT token
 */
const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !admin.isVerified) {
    throw { status: 401, message: 'Invalid credentials or unverified account.' };
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw { status: 401, message: 'Invalid credentials.' };

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token: `Bearer ${token}`,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    }
  };
};

module.exports = {
  AdminRegisterService,
  RegisterVerifyOtpService,
  setPasswordService,
  loginAdmin
};

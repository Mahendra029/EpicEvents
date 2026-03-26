const Admin = require('../models/Admin');
const { sendOtpEmail } = require('../config/NodeMailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Service to check if user connects before registration
 */
const checkAdminRegistrationService = async ({ email, mobile }) => {
  const existingAdmin = await Admin.findOne({
    $or: [{ email }, { mobile }]
  });

  if (existingAdmin && existingAdmin.isVerified) {
    if (existingAdmin.mobile === mobile) throw { status: 409, message: 'Mobile number already in use' };
    if (existingAdmin.email === email) throw { status: 409, message: 'Email already in use' };
  }
};

/**
 * Service for Step 1: Handle registration core logic
 */
const AdminRegisterService = async (userData) => {
  const { name, mobile, email } = userData;
  
  // 1. Check if user already exists and is verified (throws detailed error if so)
  await checkAdminRegistrationService({ email, mobile });

  // 2. Find any existing unverified admin record to overwrite
  let admin = await Admin.findOne({ $or: [{ email }, { mobile }] });

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
 * Service for OTP verification (Registration and Forgot Password)
 */
const verifyOtpService = async (email, otp) => {
  const admin = await Admin.findOne({ email });

  if (!admin) throw { status: 404, message: 'User not found.' };
  if (!admin.otp || admin.otp !== otp || admin.otpExpires < Date.now()) {
    throw { status: 400, message: 'Invalid or expired OTP.' };
  }

  // Track whether this was a brand new registration before we update the document
  const isNewRegistration = !admin.isVerified;

  // If this was a new registration, mark them verified.
  if (isNewRegistration) {
    admin.isVerified = true;
  }
  
  admin.otp = undefined;
  admin.otpExpires = undefined;
  await admin.save();

  // Return a completely different success message depending on their previous state!
  const message = isNewRegistration 
    ? 'OTP verified. Please proceed to set your password.' 
    : 'OTP verified. Please proceed to reset your password.';

  return { message, isNewRegistration };
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
 * Service for Forgot Password: Send OTP to existing verified user
 */
const forgotPasswordService = async (email) => {
  const admin = await Admin.findOne({ email });

  if (!admin || !admin.isVerified) {
    throw { status: 404, message: 'Verified active user not found with this email.' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  admin.otp = otp;
  admin.otpExpires = otpExpires;
  await admin.save();

  await sendOtpEmail(email, otp);
  return { message: 'Password reset OTP sent to your email. Valid for 5 minutes.' };
};



/**
 * Service for Login: Authenticate and return JWT token
 */
const loginUser = async (email, password) => {
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
  checkAdminRegistrationService,
  AdminRegisterService,
  verifyOtpService,
  setPasswordService,
  loginUser,
  forgotPasswordService
};

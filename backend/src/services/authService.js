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

const { 
  commonForgotPasswordService, 
  commonVerifyOtpService, 
  commonResetPasswordService 
} = require('./commonAuthService');

/**
 * Service for OTP verification (Registration and Forgot Password)
 */
const verifyOtpService = async (email, otp) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw { status: 404, message: 'User not found.' };

  // Track whether this was a brand new registration BEFORE verification
  const isNewRegistration = !admin.isVerified;

  const result = await commonVerifyOtpService(Admin, email, otp);

  // If this was a new registration, mark them verified.
  if (isNewRegistration) {
    admin.isVerified = true;
    await admin.save();
  }
  
  const message = isNewRegistration 
    ? 'OTP verified. Please proceed to set your password.' 
    : 'OTP verified. Please proceed to reset your password.';

  return { message, isNewRegistration };
};

/**
 * Service for password setting/reset
 */
const setPasswordService = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin || !admin.isVerified) throw { status: 403, message: 'Email verification required.' };

  return await commonResetPasswordService(Admin, email, password);
};

/**
 * Service for Forgot Password: Send OTP to existing verified user
 */
const forgotPasswordService = async (email) => {
  // Only verified admins can reset password
  const canResetCheck = (admin) => admin.isVerified;
  return await commonForgotPasswordService(Admin, email, canResetCheck);
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

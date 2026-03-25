const Admin = require('../models/Admin');
const redis = require('../config/redis');
const { sendOtpEmail } = require('../services/emailService');
const { 
  registerSchema, 
  verifyOtpSchema, 
  setPasswordSchema, 
  loginSchema 
} = require('../validators/adminValidator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @desc    Initial registration - Send OTP
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    // 1. Morgan logs the request (automatic)
    // 2. Joi validates the input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, mobile, email } = value;

    // 3. Check for duplicates in the database
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { mobile }] });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'Email or mobile already exists.' });
    }

    // 4. Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Store OTP in Redis with 5-minute expiry (300 seconds)
    // We'll also store the initial registration data so we can use it when setting the password later
    const regData = JSON.stringify({ name, mobile, email });
    await redis.set(`otp:${email}`, otp, 'EX', 300);
    await redis.set(`reg:${email}`, regData, 'EX', 600); // Store for 10 mins

    // 6. Send OTP email via nodemailer
    await sendOtpEmail(email, otp);

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent to your email. Valid for 5 minutes.' 
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { error, value } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, otp } = value;

    // Fetch stored OTP from Redis
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(410).json({ success: false, message: 'OTP has expired. Please register again.' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // If matches, delete OTP from Redis
    await redis.del(`otp:${email}`);
    
    // Mark the registration as verified in redis
    await redis.set(`verified:${email}`, 'true', 'EX', 600);

    res.status(200).json({ 
      success: true, 
      message: 'OTP verified. Please set your password.' 
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Set password and save admin
 * @route   POST /api/auth/set-password
 * @access  Public
 */
const setPassword = async (req, res, next) => {
  try {
    const { error, value } = setPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = value;

    // Check if the user is verified in redis
    const isVerified = await redis.get(`verified:${email}`);
    if (!isVerified) {
      return res.status(403).json({ success: false, message: 'Verification required.' });
    }

    // Fetch initial registration data from Redis
    const regDataStr = await redis.get(`reg:${email}`);
    if (!regDataStr) {
      return res.status(400).json({ success: false, message: 'Registration session expired.' });
    }
    const { name, mobile } = JSON.parse(regDataStr);

    // Save admin to database
    const newAdmin = new Admin({
      name,
      mobile,
      email,
      password, // Will be hashed by pre-save middleware
      isVerified: true
    });

    await newAdmin.save();

    // Cleanup redis
    await redis.del(`reg:${email}`);
    await redis.del(`verified:${email}`);

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful. Redirecting to login...' 
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    // 1. Joi validates email and password
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = value;

    // 2. Look up the email in the database
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // 3. Compare the password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  verifyOtp,
  setPassword,
  login,
};

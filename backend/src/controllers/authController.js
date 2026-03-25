const { AdminRegisterService, RegisterVerifyOtpService, setPasswordService, loginAdmin } = require('../services/authService');
const { registerSchema, verifyOtpSchema, setPasswordSchema, loginSchema } = require('../validators/adminValidator');
/**
 * Controller for Step 1: Registration initiation
 */
const adminRegister = async (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const result = await AdminRegisterService(value);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for Step 2: OTP verification
 */
const RegistrationVerifyOtp = async (req, res, next) => {
  const { error, value } = verifyOtpSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const result = await RegisterVerifyOtpService(value.email, value.otp);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for Step 3: Password setting
 */
const setPassword = async (req, res, next) => {
  const { error, value } = setPasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const result = await setPasswordService(value.email, value.password);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for Login
 */
const login = async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const result = await loginAdmin(value.email, value.password);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminRegister,
  RegistrationVerifyOtp,
  setPassword,
  login,
};

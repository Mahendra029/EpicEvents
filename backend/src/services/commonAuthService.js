const { sendOtpEmail } = require('../config/NodeMailer');

/**
 * Common: Forgot Password Service
 * Sends OTP if user exists and passes the 'canReset' check.
 */
const commonForgotPasswordService = async (Model, email, canResetCheck) => {
  const user = await Model.findOne({ email });
  
  if (!user) {
    throw { status: 404, message: 'Account not found with this email.' };
  }

  // Custom check (e.g., isVerified for Admin, status === 'approved' for Vendor)
  if (canResetCheck && !canResetCheck(user)) {
    throw { status: 403, message: 'Account is not elegible for password reset at this time.' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOtpEmail(email, otp);
  return { message: 'Password reset OTP sent to your email. Valid for 5 minutes.' };
};

/**
 * Common: Verify OTP Service
 */
const commonVerifyOtpService = async (Model, email, otp) => {
  const user = await Model.findOne({ email });

  if (!user) throw { status: 404, message: 'User not found.' };
  if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
    throw { status: 400, message: 'Invalid or expired OTP.' };
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return { message: 'OTP verified successfully. You can now reset your password.' };
};

/**
 * Common: Reset Password Service
 */
const commonResetPasswordService = async (Model, email, password) => {
  const user = await Model.findOne({ email });

  if (!user) throw { status: 404, message: 'User not found.' };

  user.password = password;
  await user.save();

  return { message: 'Password reset successfully. You can now login.' };
};

module.exports = {
  commonForgotPasswordService,
  commonVerifyOtpService,
  commonResetPasswordService
};

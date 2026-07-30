import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import InputField from '../../components/common/InputField';
import BrandLogo from '../../components/common/BrandLogo';
import useForm from '../../hooks/useForm';

const API_BASE = 'http://localhost:3000/api/auth';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 — POST /forgotPassword { email }
  const emailForm = useForm(
    { email: '' },
    async (values) => {
      setLoading(true);
      try {
        await axios.post(`${API_BASE}/forgotPassword`, { email: values.email });
        setResetEmail(values.email);
        setStep(2);
      } catch (error) {
        alert(error.response?.data?.message || 'Could not send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  );

  // Step 2 — POST /verifyOtp { email, otp }
  const otpForm = useForm(
    { otp: '' },
    async (values) => {
      setLoading(true);
      try {
        await axios.post(`${API_BASE}/verifyOtp`, { email: resetEmail, otp: values.otp });
        setStep(3);
      } catch (error) {
        alert(error.response?.data?.message || 'Invalid or expired OTP.');
      } finally {
        setLoading(false);
      }
    }
  );

  // Step 3 — POST /setPassword { email, password, confirmPassword }
  const passwordForm = useForm(
    { password: '', confirmPassword: '' },
    async (values) => {
      if (values.password !== values.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      setLoading(true);
      try {
        await axios.post(`${API_BASE}/setPassword`, {
          email: resetEmail,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        alert('Password reset successfully! Please login.');
        navigate('/admin/login');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to reset password.');
      } finally {
        setLoading(false);
      }
    }
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#ffffff,_#CDD7D6)]">
      <div className="bg-white rounded-2xl shadow-premium w-full max-w-md overflow-hidden relative border border-brand-dark/5">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand blur-[80px] opacity-[0.08] pointer-events-none" />

        <div className="p-10 pb-6 text-center bg-brand-dark text-white">
          <BrandLogo light />
          <p className="mt-2 text-white/70 text-sm font-medium tracking-widest">RESET PASSWORD</p>
        </div>

        <div className="px-10 pt-8 pb-4">
          <h2 className="text-3xl font-bold text-brand-dark mb-1">Forgot password?</h2>
          <p className="text-gray-500 mb-2">
            {step === 1 && "Enter your email and we'll send you a code."}
            {step === 2 && 'Enter the code we sent you.'}
            {step === 3 && 'Choose a new password.'}
          </p>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-brand' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit}>
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="admin@epicevents.com"
                value={emailForm.formData.email}
                onChange={emailForm.handleChange}
                icon={Mail}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-brand text-white rounded-xl font-bold 
                           flex items-center justify-center gap-2 transition-all 
                           hover:bg-[#f65c49] hover:-translate-y-1 hover:shadow-xl 
                           hover:shadow-brand/20 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none disabled:hover:translate-y-0"
              >
                {loading ? 'SENDING OTP...' : 'SEND OTP'} <ArrowRight size={20} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={otpForm.handleSubmit}>
              <p className="text-sm text-gray-500 mb-4">
                Code sent to <span className="font-semibold text-brand-dark">{resetEmail}</span>
              </p>

              <InputField
                label="OTP Code"
                name="otp"
                type="text"
                placeholder="123456"
                value={otpForm.formData.otp}
                onChange={otpForm.handleChange}
                icon={Shield}
                maxLength={6}
                required
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-4 px-5 rounded-xl font-bold text-brand-dark border border-gray-200 
                             flex items-center justify-center hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-brand text-white rounded-xl font-bold 
                             flex items-center justify-center gap-2 transition-all 
                             hover:bg-[#f65c49] hover:-translate-y-1 hover:shadow-xl 
                             hover:shadow-brand/20 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none disabled:hover:translate-y-0"
                >
                  {loading ? 'VERIFYING...' : 'VERIFY OTP'} <ArrowRight size={20} />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={passwordForm.handleSubmit}>
              <InputField
                label="New Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={passwordForm.formData.password}
                onChange={passwordForm.handleChange}
                icon={Lock}
                required
              />

              <InputField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={passwordForm.formData.confirmPassword}
                onChange={passwordForm.handleChange}
                icon={Shield}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-brand text-white rounded-xl font-bold 
                           flex items-center justify-center gap-2 transition-all 
                           hover:bg-[#f65c49] hover:-translate-y-1 hover:shadow-xl 
                           hover:shadow-brand/20 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none disabled:hover:translate-y-0"
              >
                {loading ? 'RESETTING...' : 'RESET PASSWORD'} <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>

        <div className="px-10 pb-10 text-center text-sm text-gray-500">
          Remembered it?{' '}
          <a href="/admin/login" className="text-brand font-bold hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
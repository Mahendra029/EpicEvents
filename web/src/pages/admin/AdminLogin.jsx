import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import InputField from '../../components/common/InputField';
import BrandLogo from '../../components/common/BrandLogo';
import useForm from '../../hooks/useForm';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit } = useForm({
    email: '',
    password: ''
  }, async (values) => {
    try {
      console.log('Attempting login for:', values.email);
      const response = await axios.post('http://localhost:3000/api/auth/login', values);
      
      if (response.data.success && response.data.token) {
        console.log('Login successful! Redirecting to dashboard...');
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
        navigate('/admin/dashboard');
      } else {
        alert('Unexpected response from server. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please check your credentials.';
      alert(errorMsg);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#ffffff,_#CDD7D6)]">
      <div className="bg-white rounded-2xl shadow-premium w-full max-w-md overflow-hidden relative border border-brand-dark/5">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand blur-[80px] opacity-[0.08] pointer-events-none" />
        
        <div className="p-10 pb-6 text-center bg-brand-dark text-white">
          <BrandLogo light />
          <p className="mt-2 text-white/70 text-sm font-medium tracking-wide">ADMIN PORTAL ACCESS</p>
        </div>
        
        <div className="px-10 pt-8 pb-4">
          <h2 className="text-3xl font-bold text-brand-dark mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Please enter your credentials to login.</p>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@epicevents.com"
              value={formData.email}
              onChange={handleChange}
              icon={User}
              required
            />
            
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />

            <div className="mb-8 text-right">
              <Link to="/admin/forgot-password" className="text-brand text-sm font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full py-4 bg-brand text-white rounded-xl font-bold 
                                            flex items-center justify-center gap-2 transition-all 
                                            hover:bg-[#f65c49] hover:-translate-y-1 hover:shadow-xl 
                                            hover:shadow-brand/20 active:translate-y-0">
              SIGN IN <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <div className="px-10 pb-10 text-center text-sm text-gray-500">
          Don't have an account? {' '}
          <a href="/admin/register" className="text-brand font-bold hover:underline">
            Register New Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

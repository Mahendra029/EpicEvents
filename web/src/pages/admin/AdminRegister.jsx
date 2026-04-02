import React from 'react';
import { User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import InputField from '../../components/common/InputField';
import BrandLogo from '../../components/common/BrandLogo';
import useForm from '../../hooks/useForm';

const AdminRegister = () => {
  const { formData, handleChange, handleSubmit } = useForm({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: ''
  }, (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Registration attempt:', values);
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#ffffff,_#CDD7D6)]">
      <div className="bg-white rounded-2xl shadow-premium w-full max-w-lg overflow-hidden relative border border-brand-dark/5">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand blur-[80px] opacity-[0.08] pointer-events-none" />
        
        <div className="p-10 pb-6 text-center bg-brand-dark text-white">
          <BrandLogo light />
          <p className="mt-2 text-white/70 text-sm font-medium tracking-wide tracking-widest">REGISTRATION</p>
        </div>
        
        <div className="px-10 pt-8 pb-4">
          <h2 className="text-3xl font-bold text-brand-dark mb-1">Create Admin</h2>
          <p className="text-gray-500 mb-8">Join the Epic Events management team.</p>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              icon={User}
              required
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@epicevents.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Shield}
                required
              />
            </div>

            <InputField
              label="Admin Secret Code"
              name="adminSecret"
              type="password"
              placeholder="Required for authorization"
              value={formData.adminSecret}
              onChange={handleChange}
              icon={Shield}
              required
            />

            <button type="submit" className="w-full mt-4 py-4 bg-brand text-white rounded-xl font-bold 
                                            flex items-center justify-center gap-2 transition-all 
                                            hover:bg-[#f65c49] hover:-translate-y-1 hover:shadow-xl 
                                            hover:shadow-brand/20 active:translate-y-0">
              REGISTER ACCOUNT <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <div className="px-10 pb-10 text-center text-sm text-gray-500">
          Already have an account? {' '}
          <a href="/admin/login" className="text-brand font-bold hover:underline">
            Login Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;

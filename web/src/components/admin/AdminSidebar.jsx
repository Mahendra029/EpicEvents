import React from 'react';
import { LayoutDashboard, Store, Settings, LogOut, Users } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const AdminSidebar = ({ activeTab, onSignOut }) => {
  return (
    <aside className="w-72 bg-brand-dark flex flex-col shadow-2xl z-20 shrink-0">
      <div className="p-8 pb-12">
        <BrandLogo light />
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-brand/10 border-l-4 border-brand font-semibold rounded-r-lg">
          <LayoutDashboard size={20} className="text-brand" /> Dashboard
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 font-medium rounded-lg transition-all group">
          <Store size={20} className="group-hover:text-brand transition-colors" /> Vendors
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 font-medium rounded-lg transition-all group">
          <Users size={20} className="group-hover:text-brand transition-colors" /> Customers (Coming Soon)
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 font-medium rounded-lg transition-all group">
          <Settings size={20} className="group-hover:text-brand transition-colors" /> Configurations
        </button>
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all font-bold italic uppercase text-xs tracking-widest">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

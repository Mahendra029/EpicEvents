import React from 'react';
import { ChevronRight, RefreshCw, Bell } from 'lucide-react';

const AdminTopbar = ({ adminUser, onRefresh, loading }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 z-10 shrink-0">
      <div className="flex items-center gap-4 text-brand-dark">
        <h1 className="text-xl font-black italic uppercase tracking-tighter">Admin Portal</h1>
        <ChevronRight size={18} className="text-gray-400" />
        <span className="text-gray-500 font-bold italic text-sm tracking-tight">MANAGEMENT CONSOLE</span>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={onRefresh} className="text-gray-400 hover:text-brand transition-colors" title="Refresh Data">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
        <button className="relative text-gray-400 hover:text-brand transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-black text-brand-dark uppercase tracking-tighter leading-none">{adminUser.name || 'Admin'}</p>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">{adminUser.role || 'Super Admin'}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-black text-xl italic shadow-inner">
            {adminUser.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

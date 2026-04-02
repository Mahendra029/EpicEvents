import React from 'react';
import { ChevronRight, RefreshCw, Bell } from 'lucide-react';

/**
 * AdminTopbar - Header bar showing current section and admin profile.
 * viewTitles maps view IDs to human-readable names.
 */
const VIEW_TITLES = {
  dashboard: 'Overview',
  vendors:   'All Vendors',
  customers: 'Customers',
  settings:  'Settings',
};

const AdminTopbar = ({ activeView, adminUser, onRefresh, loading }) => {
  return (
    <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-8 z-10 shrink-0">
      <div className="flex items-center gap-3 text-brand-dark">
        <h1 className="text-base font-black italic uppercase text-brand-dark tracking-tighter">Admin Portal</h1>
        <ChevronRight size={16} className="text-gray-300" />
        <span className="text-sm font-black uppercase tracking-widest text-gray-400 italic">
          {VIEW_TITLES[activeView] || activeView}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={onRefresh}
          title="Refresh data"
          className="text-gray-400 hover:text-brand transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>

        <button className="relative text-gray-400 hover:text-brand transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-black text-brand-dark uppercase tracking-tighter leading-none">
              {adminUser.name || 'Admin'}
            </p>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
              {adminUser.role || 'Super Admin'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-black text-lg italic shadow-inner">
            {adminUser.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

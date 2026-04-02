import React from 'react';
import { LayoutDashboard, Store, Settings, LogOut, Users } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

/**
 * AdminSidebar - Navigation panel.
 * activeView: 'dashboard' | 'vendors'
 * onViewChange: callback to switch views
 */
const AdminSidebar = ({ activeView, onViewChange, onSignOut }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'vendors',   label: 'Vendors',    icon: Store },
    { id: 'customers', label: 'Customers',  icon: Users, disabled: true },
    { id: 'settings',  label: 'Settings',   icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-72 bg-brand-dark flex flex-col shadow-2xl z-20 shrink-0">
      <div className="p-8 pb-10">
        <BrandLogo light />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, disabled }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => !disabled && onViewChange(id)}
              disabled={disabled}
              title={disabled ? 'Coming soon' : label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${isActive
                  ? 'bg-brand/15 text-white border-l-4 border-brand rounded-l-none'
                  : disabled
                    ? 'text-white/25 cursor-not-allowed'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={20} className={isActive ? 'text-brand' : ''} />
              <span>{label}</span>
              {disabled && (
                <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-white/20">Soon</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all font-bold italic uppercase text-xs tracking-widest"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

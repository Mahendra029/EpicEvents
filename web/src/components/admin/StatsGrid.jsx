import React from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const StatsGrid = ({ vendors }) => {
  const stats = [
    { label: 'Total Vendors', value: vendors.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approval', value: vendors.filter(v => v.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approved', value: vendors.filter(v => v.status === 'approved').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: vendors.filter(v => v.status === 'rejected').length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-5">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all hover:-translate-y-1">
          <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
            <stat.icon size={28} />
          </div>
          <div>
            <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
            <p className="text-3xl font-black text-brand-dark leading-none italic">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;

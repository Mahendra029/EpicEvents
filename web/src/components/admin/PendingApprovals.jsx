import React from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

/**
 * PendingApprovals - Shows vendors awaiting admin action as cards.
 * Displayed on the Dashboard home view.
 */
const PendingApprovals = ({ vendors, onView, onApprove, onReject }) => {
  const pending = vendors.filter(v => v.status === 'pending');

  if (pending.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-emerald-500" />
      </div>
      <h3 className="font-black text-brand-dark uppercase italic tracking-tighter text-lg mb-1">All Clear!</h3>
      <p className="text-gray-400 text-sm font-medium">No vendors are waiting for approval right now.</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black italic uppercase text-brand-dark tracking-tighter leading-none">Pending Approvals</h2>
          <p className="text-gray-400 text-xs font-bold mt-1 not-italic tracking-widest uppercase">{pending.length} vendor{pending.length > 1 ? 's' : ''} waiting</p>
        </div>
        <span className="px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} /> Needs Action
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {pending.map(vendor => (
          <div key={vendor._id} className="bg-white rounded-[1.5rem] border border-amber-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
            {/* Card header */}
            <div className="bg-amber-50 px-6 py-4 flex items-center gap-4 border-b border-amber-100">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-200 flex items-center justify-center text-amber-600 font-black text-xl italic shadow-sm">
                {vendor.personName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-brand-dark italic uppercase tracking-tight text-base leading-none truncate">{vendor.personName}</p>
                <p className="text-amber-600 text-[11px] font-bold mt-1 uppercase tracking-widest">Pending Review</p>
              </div>
              <button onClick={() => onView(vendor)} className="text-gray-300 hover:text-brand transition-colors p-1">
                <ExternalLink size={18} />
              </button>
            </div>

            {/* Card body */}
            <div className="px-6 py-4 space-y-2">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Company</p>
                <p className="font-black text-brand-dark italic text-sm">{vendor.companyName}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Location</p>
                <p className="font-bold text-gray-600 text-sm">{vendor.companyAddress?.city || '—'}, {vendor.companyAddress?.district || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Services</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {vendor.servicesProvided?.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-brand/5 text-brand border border-brand/10 rounded-md text-[9px] font-black uppercase italic">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Registered</p>
                <p className="font-bold text-gray-500 text-xs">{new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Card actions */}
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => onApprove(vendor._id)}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] italic flex items-center justify-center gap-2 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 transition-all active:scale-95">
                <CheckCircle size={14} /> Approve
              </button>
              <button onClick={() => onReject(vendor._id)}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] italic flex items-center justify-center gap-2 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/25 transition-all active:scale-95">
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingApprovals;

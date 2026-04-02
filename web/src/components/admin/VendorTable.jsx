import React from 'react';
import { Search, MoreVertical, ExternalLink } from 'lucide-react';

const VendorTable = ({ 
  vendors, 
  loading, 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  onView, 
  onApprove, 
  onReject 
}) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-premium-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="px-8 py-7 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shrink-0">
        <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-2xl w-fit border border-gray-100">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-brand shadow-lg scale-105' : 'text-gray-500 hover:text-brand-dark hover:bg-white/50'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={18} />
          <input type="text" placeholder="Search by name, email or company..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3.5 bg-gray-50 border border-transparent focus:border-brand/10 rounded-2xl text-sm focus:ring-4 focus:ring-brand/5 outline-none w-full md:w-96 transition-all font-medium" />
        </div>
      </div>

      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md">
            <tr className="text-brand-dark text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
              <th className="px-8 py-6">Vendor Profile</th>
              <th className="px-8 py-6">Company Details</th>
              <th className="px-8 py-6 text-center">Services Provided</th>
              <th className="px-8 py-6 text-center">Current Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 italic">
            {loading ? (
              <tr><td colSpan="5" className="p-32 text-center font-black text-gray-300 italic tracking-widest uppercase animate-pulse text-2xl">Updating Console...</td></tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-32 text-center">
                  <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 italic font-black text-4xl text-gray-200">?</div>
                  <h3 className="text-2xl font-black text-brand-dark italic mb-2 uppercase tracking-tighter">Query Empty</h3>
                  <p className="text-gray-400 not-italic text-sm font-medium">No vendors match your search criteria.</p>
                </td>
              </tr>
            ) : vendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-gray-50/40 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light border-2 border-brand/10 flex items-center justify-center text-brand-dark font-black transition-transform group-hover:scale-110 shadow-sm">
                      {vendor.personName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-lg text-brand-dark leading-tight mb-0.5 tracking-tight uppercase italic">{vendor.personName}</p>
                      <p className="text-[12px] text-gray-500 font-bold not-italic tracking-tight">{vendor.email}</p>
                      <p className="text-[12px] text-gray-500 font-bold not-italic tracking-tight">{vendor.phoneNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-brand-dark tracking-tight leading-snug uppercase italic">{vendor.companyName}</p>
                  <p className="text-[11px] text-brand font-black italic mt-0.5 uppercase tracking-tighter underline underline-offset-4 decoration-brand/20">
                    {vendor.companyAddress?.city}, {vendor.companyAddress?.district}
                  </p>
                  <p className="text-[11px] text-gray-400 font-bold mt-2 not-italic">Joined {new Date(vendor.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px] mx-auto">
                    {vendor.servicesProvided?.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-brand/5 text-brand rounded-lg text-[10px] font-black uppercase tracking-tight border border-brand/10 italic">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest not-italic border-2 inline-block ${
                    vendor.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' :
                    vendor.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm' :
                    'bg-rose-50 text-rose-600 border-rose-100 shadow-sm'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => onView(vendor)}
                      className="px-4 py-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:translate-x-1 hover:shadow-xl hover:shadow-brand-dark/20 flex items-center gap-2 italic">
                      <ExternalLink size={14} /> Profile
                    </button>
                    {vendor.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => onApprove(vendor._id)}
                          className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20">
                          ✓
                        </button>
                        <button onClick={() => onReject(vendor._id)}
                          className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-rose-500/20">
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorTable;

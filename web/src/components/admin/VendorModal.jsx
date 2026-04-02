import React from 'react';
import { X, Store, MapPin, Phone, Globe, Image } from 'lucide-react';

/**
 * VendorModal - A full-screen overlay showing 100% of a vendor's data.
 * Receives the vendor object and callbacks for close/approve/reject.
 */
const VendorModal = ({ vendor, onClose, onApprove, onReject }) => {
  if (!vendor) return null;

  const addr = vendor.companyAddress || {};
  const social = vendor.socialLinks || {};

  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="bg-brand-dark text-white px-10 py-8 flex items-center justify-between shrink-0">
          <div className="flex gap-6 items-center">
            <div className="w-20 h-20 rounded-2xl bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-black text-4xl italic">
              {vendor.personName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">{vendor.personName}</h2>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                  <Store size={12} /> {vendor.companyName}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                  vendor.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  vendor.status === 'pending'  ? 'bg-amber-500/20  text-amber-400  border-amber-500/30'  :
                                                  'bg-rose-500/20   text-rose-400   border-rose-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    vendor.status === 'approved' ? 'bg-emerald-400' :
                    vendor.status === 'pending'  ? 'bg-amber-400'  : 'bg-rose-400'
                  }`} />
                  {vendor.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ── LEFT: Contact + Address ────────────────────────── */}
            <div className="space-y-8">
              {/* Contact */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                  <Phone size={13} /> Contact Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Mobile Number', value: vendor.phoneNumber },
                    { label: 'Email Address', value: vendor.email },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                      <p className="font-black text-brand-dark text-base italic">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Address */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                  <MapPin size={13} /> Business Address
                </h3>
                <div className="bg-gray-50 px-6 py-5 rounded-2xl border border-gray-100 space-y-1 italic font-black text-brand-dark">
                  {addr.street   && <p>{addr.street}</p>}
                  {addr.city     && <p>{addr.city}, {addr.mandal}</p>}
                  {addr.district && <p>{addr.district}, {addr.state}</p>}
                  {addr.pincode  && <p className="text-brand text-2xl tracking-[0.15em] pt-3 not-italic">{addr.pincode}</p>}
                  {!addr.city && !addr.street && <p className="text-gray-400 not-italic text-sm font-medium">No address provided</p>}
                </div>
              </section>
            </div>

            {/* ── RIGHT: Services + Social ──────────────────────── */}
            <div className="space-y-8">
              {/* Services */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                  <Store size={13} /> Services Offered
                </h3>
                <div className="flex flex-wrap gap-3">
                  {vendor.servicesProvided?.map((s, i) => (
                    <span key={i} className="px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest italic shadow-lg shadow-brand/20">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* Social Links */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                  <Globe size={13} /> Social Media
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(social).filter(([, link]) => link).map(([platform, link]) => (
                    <a key={platform} href={link} target="_blank" rel="noopener noreferrer"
                      className="bg-gray-50 px-4 py-3 rounded-2xl flex items-center gap-2 border border-gray-100 hover:bg-brand hover:text-white hover:border-brand transition-all font-black italic uppercase text-[10px] tracking-widest">
                      <Globe size={16} /> {platform}
                    </a>
                  ))}
                  {Object.values(social).every(l => !l) && (
                    <div className="col-span-2 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center text-gray-400 text-xs font-bold not-italic">
                      No social links provided
                    </div>
                  )}
                </div>
              </section>

              {/* Approve / Reject inside modal */}
              {vendor.status === 'pending' && (
                <section className="pt-6 border-t border-gray-100 flex gap-4">
                  <button onClick={() => { onApprove(vendor._id); onClose(); }}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-emerald-600/20 hover:scale-[1.03] transition-transform active:scale-95">
                    ✓ Approve
                  </button>
                  <button onClick={() => { onReject(vendor._id); onClose(); }}
                    className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-rose-600/20 hover:scale-[1.03] transition-transform active:scale-95">
                    ✕ Reject
                  </button>
                </section>
              )}
            </div>
          </div>

          {/* ── Portfolio Gallery ─────────────────────────────────── */}
          {vendor.serviceImages?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5 flex items-center gap-2">
                <Image size={13} /> Portfolio Gallery
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {vendor.serviceImages.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorModal;

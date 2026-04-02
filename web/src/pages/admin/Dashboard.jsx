import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ── Modular admin components ─────────────────────────────────────────────────
import AdminSidebar     from '../../components/admin/AdminSidebar';
import AdminTopbar      from '../../components/admin/AdminTopbar';
import StatsGrid        from '../../components/admin/StatsGrid';
import PendingApprovals from '../../components/admin/PendingApprovals';
import VendorTable      from '../../components/admin/VendorTable';
import VendorModal      from '../../components/admin/VendorModal';

const API = 'http://localhost:3000/api/vendor';

/**
 * Dashboard page
 * ----------------------------------------------------------
 * Two views controlled by `activeView` state:
 *
 *  'dashboard' → Overview:
 *    - Stats cards (total / pending / approved / rejected)
 *    - Pending Approvals cards (vendors awaiting admin action)
 *
 *  'vendors' → All Vendors:
 *    - Full searchable + filterable VendorTable
 * ----------------------------------------------------------
 * All data fetching and state live here.
 * UI is entirely delegated to child components.
 */
const Dashboard = () => {
  // ── View state (which sidebar tab is active) ──────────────────────────────
  const [activeView, setActiveView] = useState('dashboard');

  // ── Data state ────────────────────────────────────────────────────────────
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);

  // ── Vendor table filter state (only used in 'vendors' view) ───────────────
  const [activeTab, setActiveTab]   = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ── Modal state ───────────────────────────────────────────────────────────
  const [selectedVendor, setSelectedVendor] = useState(null);

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // ── Auth helper ───────────────────────────────────────────────────────────
  const authHeader = () => ({ Authorization: localStorage.getItem('adminToken') });

  // ── Fetch all vendors ─────────────────────────────────────────────────────
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/getAllVendors`, { headers: authHeader() });
      if (data.success) setVendors(data.vendors || []);
    } catch (err) {
      console.error('Fetch vendors failed:', err);
      if (err.response?.status === 401) window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  // ── Update vendor status ──────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `${API}/vendorApprove/${id}`,
        { status },
        { headers: authHeader() }
      );
      if (data.success) {
        setVendors(prev => prev.map(v => v._id === id ? { ...v, status } : v));
      }
    } catch (err) {
      console.error('Status update failed:', err);
      alert(`Could not ${status} vendor. Please try again.`);
    }
  };

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  // ── Filtered vendors (for the Vendors view table) ─────────────────────────
  const filteredVendors = vendors.filter(v => {
    const tabMatch  = activeTab === 'all' || v.status === activeTab;
    const lower     = searchTerm.toLowerCase();
    const textMatch = !searchTerm ||
      v.personName?.toLowerCase().includes(lower) ||
      v.companyName?.toLowerCase().includes(lower) ||
      v.email?.toLowerCase().includes(lower);
    return tabMatch && textMatch;
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-outfit">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <AdminSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSignOut={handleSignOut}
      />

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <AdminTopbar
          activeView={activeView}
          adminUser={adminUser}
          onRefresh={fetchVendors}
          loading={loading}
        />

        {/* ── DASHBOARD VIEW ────────────────────────────────────────────────── */}
        {activeView === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Stats overview */}
            <StatsGrid vendors={vendors} />

            {/* Pending approvals — vendors waiting for admin action */}
            <PendingApprovals
              vendors={vendors}
              onView={setSelectedVendor}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id)  => updateStatus(id, 'rejected')}
            />
          </div>
        )}

        {/* ── VENDORS VIEW ──────────────────────────────────────────────────── */}
        {activeView === 'vendors' && (
          <div className="flex-1 flex flex-col overflow-hidden p-8">
            <VendorTable
              vendors={filteredVendors}
              loading={loading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onView={setSelectedVendor}
              onApprove={(id) => updateStatus(id, 'approved')}
              onReject={(id)  => updateStatus(id, 'rejected')}
            />
          </div>
        )}
      </main>

      {/* ── Vendor detail modal (shared across both views) ─────────────────── */}
      <VendorModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onApprove={(id) => updateStatus(id, 'approved')}
        onReject={(id)  => updateStatus(id, 'rejected')}
      />
    </div>
  );
};

export default Dashboard;

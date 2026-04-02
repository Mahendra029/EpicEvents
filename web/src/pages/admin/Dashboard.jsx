import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ── Modular admin components ─────────────────────────────────────────────────
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar  from '../../components/admin/AdminTopbar';
import StatsGrid    from '../../components/admin/StatsGrid';
import VendorTable  from '../../components/admin/VendorTable';
import VendorModal  from '../../components/admin/VendorModal';

// ── API base URL ──────────────────────────────────────────────────────────────
const API = 'http://localhost:3000/api/vendor';

/**
 * Dashboard page
 * Responsibility: fetch data + hold shared state.
 * All UI is delegated to child components.
 */
const Dashboard = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [vendors, setVendors]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState('all');
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Admin info stored on login
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  // ── Update vendor status (approve / reject) ───────────────────────────────
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

  // ── Filter vendors for table ──────────────────────────────────────────────
  const filteredVendors = vendors.filter(v => {
    const tabMatch    = activeTab === 'all' || v.status === activeTab;
    const searchLower = searchTerm.toLowerCase();
    const textMatch   = !searchTerm ||
      v.personName?.toLowerCase().includes(searchLower) ||
      v.companyName?.toLowerCase().includes(searchLower) ||
      v.email?.toLowerCase().includes(searchLower);
    return tabMatch && textMatch;
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-outfit">

      {/* Sidebar */}
      <AdminSidebar onSignOut={handleSignOut} />

      {/* Main area */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <AdminTopbar adminUser={adminUser} onRefresh={fetchVendors} loading={loading} />

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-8 gap-6">

          {/* Stats cards */}
          <StatsGrid vendors={vendors} />

          {/* Vendor table */}
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
      </main>

      {/* Vendor detail modal */}
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

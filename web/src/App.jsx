import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminForgotPassword from './pages/admin/AdminForgotPassword.jsx';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes placeholder or Default redirection */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        
        {/* Admin Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        
        {/* Fallback for 404 */}
        <Route path="*" element={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
            <h1 style={{ fontSize: '4rem' }}>404</h1>
            <p>Page Not Found</p>
            <a href="/admin/login" className="auth-link">Back to Safety</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

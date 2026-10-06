import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSchemes from './pages/admin/AdminSchemes';
import AdminUsers from './pages/admin/AdminUsers';

import DashboardLayout from './components/DashboardLayout';
import Landing from './pages/Landing';
import About from './pages/About';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-primary-100 selection:text-primary-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Founder Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/results" element={<Results />} />
              <Route path="/saved" element={<Saved />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
             <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/schemes" element={<AdminSchemes />} />
              <Route path="/admin/users" element={<AdminUsers />} />
             </Route>
          </Route>
        </Routes>
      </div>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px'
          },
        }} 
      />
    </Router>
  );
};

export default App;

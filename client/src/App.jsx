import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const Landing = () => (
  <main className="pt-28 pb-16 px-6 max-w-7xl mx-auto">
    <div className="animate-slide-up flex flex-col items-center text-center mt-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Phase 1 MVP Active
      </div>
      
      <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
        Find the perfect <br />
        <span className="text-gradient">government scheme.</span>
      </h2>
      
      <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Answer a few questions about your startup and instantly discover 
        grants, loans, and subsidies you're eligible for.
      </p>
      
      <div className="flex gap-4">
        <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Find Schemes
        </Link>
      </div>
    </div>
  </main>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-primary-100 selection:text-primary-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<Login />} />
          
          {/* Founder Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/results" element={<Results />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
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

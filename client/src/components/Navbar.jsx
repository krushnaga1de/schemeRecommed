import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 border-x-0 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="font-display font-bold text-2xl tracking-tight text-slate-800 hover:opacity-80 transition-opacity">
          Scheme<span className="text-primary-600">Match</span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {user.role === 'founder' && (
                <>
                  <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Dashboard</Link>
                  <Link to="/questionnaire" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Find Schemes</Link>
                </>
              )}
              <span className="text-slate-400 hidden md:inline">|</span>
              <span className="text-sm text-slate-500 hidden md:inline">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-rose-500 hover:text-rose-600 font-medium transition-colors ml-2">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-2">Log In</Link>
              <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

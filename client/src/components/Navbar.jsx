import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  // Hide global navbar on dashboard routes since they use DashboardLayout
  const isDashboardRoute = [
    '/dashboard', '/questionnaire', '/results', '/admin', '/profile', '/saved', '/settings', '/pitch-deck', '/find-schemes'
  ].some(path => location.pathname.startsWith(path));

  if (isDashboardRoute) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            StartSahay
          </span>
          {isAdmin && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Admin</span>}
        </Link>

        {/* Center Links (Hidden on Mobile) */}
        {!isAdmin && !user && (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-indigo-600 font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-indigo-600">
              Home
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Contact
            </Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {user.role === 'founder' && (
                <>
                  <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</Link>
                  <Link to="/questionnaire" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Find Schemes</Link>
                </>
              )}
              <span className="text-slate-300 hidden md:inline">|</span>
              <span className="text-sm text-slate-500 hidden md:inline font-medium">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-rose-500 hover:text-rose-600 font-medium transition-colors ml-2">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors px-4 py-2 border border-slate-200 hover:border-indigo-200 rounded-xl">
                Log In
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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

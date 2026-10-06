import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, LayoutDashboard, User, FileText, Search, Bookmark, PieChart, Settings, LogOut } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`${location.pathname}?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (e.key === 'Enter') {
      navigate(location.pathname); // clear search
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin ? [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Schemes', icon: FileText, path: '/admin/schemes' },
    { name: 'Users', icon: User, path: '/admin/users' },
  ] : [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Profile', icon: User, path: '/profile' },
    { name: 'Startup Profile', icon: FileText, path: '/questionnaire' },
    { name: 'Recommendations', icon: FileText, path: '/results' },
    { name: 'Saved Schemes', icon: Bookmark, path: '/saved' },
    { name: 'Pitch Deck', icon: PieChart, path: '/pitch-deck' },
  ];

  return (
    <div className="flex h-screen bg-[#f8faff] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-6 border-b border-slate-50">
          <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              StartSahay
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/results' && location.pathname.startsWith('/results'));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
         {/* Top Header (Optional search bar area like in image) */}
         <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-8 z-10 sticky top-0">
    <div className="flex-1 flex items-center">
       {/* Search Bar */}
       <div className="relative w-full max-w-md hidden md:block">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search schemes, features..." 
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim()) {
                navigate(`${location.pathname}?q=${encodeURIComponent(val.trim())}`, { replace: true });
              } else {
                navigate(location.pathname, { replace: true });
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
       </div>
    </div>
            <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-transparent hover:border-indigo-300 flex items-center justify-center text-indigo-700 font-bold transition-all focus:outline-none"
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="font-bold text-slate-900 text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Edit Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
         </header>

         {/* Content Scroll Area */}
         <div className="flex-1 overflow-y-auto p-8 relative">
           <div className="max-w-6xl mx-auto">
              {children}
           </div>
         </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

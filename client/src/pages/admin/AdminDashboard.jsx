import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Users, FileText, CheckCircle, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalFounders: 0, activeSchemes: 0, totalSchemes: 0, totalRecommendations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/admin/analytics');
      setStats(statsRes.data.data);
    } catch (e) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-slate-500 py-20 flex items-center justify-center">Loading Admin Portal...</div>;

  return (
    <div className="w-full pb-10">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Admin Control Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Founders" value={stats.totalFounders} icon={Users} color="indigo" />
          <StatCard title="Active Schemes" value={stats.activeSchemes} icon={CheckCircle} color="emerald" />
          <StatCard title="Total Schemes" value={stats.totalSchemes} icon={FileText} color="blue" />
          <StatCard title="Recommendations Run" value={stats.totalRecommendations} icon={Search} color="purple" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`p-4 rounded-xl border ${colorStyles[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-semibold mb-1">{title}</p>
        <p className="text-3xl font-display font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalFounders: 0, activeSchemes: 0, totalSchemes: 0, totalRecommendations: 0 });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, schemesRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/schemes?limit=50')
      ]);
      setStats(statsRes.data.data);
      setSchemes(schemesRes.data.data.schemes);
    } catch (e) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to deactivate this scheme?')) {
      try {
        await api.delete(`/admin/schemes/${id}`);
        toast.success('Scheme deactivated');
        fetchData();
      } catch (e) {
        toast.error('Failed to deactivate');
      }
    }
  };

  if (loading) return <div className="min-h-screen pt-28 text-center bg-slate-900 text-white flex items-center justify-center">Loading Admin Portal...</div>;

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-white mb-8">Admin Control Center</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Founders" value={stats.totalFounders} />
          <StatCard title="Active Schemes" value={stats.activeSchemes} />
          <StatCard title="Total Schemes" value={stats.totalSchemes} />
          <StatCard title="Recommendations Run" value={stats.totalRecommendations} />
        </div>

        <div className="glass-card-dark p-6 overflow-hidden border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Managed Schemes</h2>
            <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-primary-500/20">
              + Add Scheme
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-sm">
                  <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Scheme Name</th>
                  <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Body</th>
                  <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Level</th>
                  <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="pb-3 font-medium uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {schemes.map(s => (
                  <tr key={s._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-white">{s.name}</td>
                    <td className="py-4 pr-4 text-slate-400">{s.issuingBody}</td>
                    <td className="py-4 pr-4 capitalize text-slate-400">{s.level}</td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${s.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                        {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-4">
                      {s.isActive ? (
                        <button onClick={() => handleDelete(s._id)} className="text-rose-400 hover:text-rose-300 font-semibold text-xs border border-rose-400/30 px-2 py-1 rounded transition-colors">
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs font-medium">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="glass-card-dark p-6 border border-slate-700/50">
    <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
    <p className="text-4xl font-display font-bold text-white">{value}</p>
  </div>
);

export default AdminDashboard;

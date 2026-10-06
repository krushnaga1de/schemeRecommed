import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminUsers = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get('q') || '').toLowerCase();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.data.users || []);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-slate-500 py-20 flex items-center justify-center">Loading Users...</div>;

  return (
    <div className="w-full pb-10">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        </div>
        
        {/* Users Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10" id="users-section">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Registered Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm bg-slate-50/50">
                  <th className="py-4 pl-4 pr-4 font-bold uppercase tracking-wider text-[11px] rounded-tl-lg">Name</th>
                  <th className="py-4 pr-4 font-bold uppercase tracking-wider text-[11px]">Email</th>
                  <th className="py-4 pr-4 font-bold uppercase tracking-wider text-[11px]">Role</th>
                  <th className="py-4 pr-4 font-bold uppercase tracking-wider text-[11px] rounded-tr-lg">Joined</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).map(u => (
                  <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-4 pr-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{u.email}</td>
                    <td className="py-4 pr-4 capitalize text-slate-600">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>{u.role}</span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

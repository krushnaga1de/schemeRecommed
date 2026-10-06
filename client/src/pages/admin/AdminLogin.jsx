import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><span className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full inline-block"></span></div>;

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      
      if (res.data.data.user.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }

      login(res.data.data.user, res.data.data.accessToken);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full glass-card p-8 animate-fade-in border-t-4 border-primary-600 shadow-xl">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary-100 text-primary-700 h-12 w-12 flex items-center justify-center rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900">Admin Portal</h2>
          <p className="text-slate-500 mt-2">Sign in to manage the platform</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="admin@startupscheme.gov.in"
            />
            {errors.email && <span className="text-xs text-rose-500 mt-1">{errors.email.message}</span>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-xs text-rose-500 mt-1">{errors.password.message}</span>}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
          >
            {isSubmitting ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

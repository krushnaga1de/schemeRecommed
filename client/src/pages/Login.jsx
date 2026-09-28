import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.data.user, res.data.data.accessToken);
      toast.success('Welcome back!');
      
      if (res.data.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Log in to your founder account</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="you@startup.com"
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
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

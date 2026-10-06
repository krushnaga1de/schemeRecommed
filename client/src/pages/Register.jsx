import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Rocket, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (user && !loading) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><span className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full inline-block"></span></div>;

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, role: 'founder' };
      const res = await api.post('/auth/register', payload);
      login(res.data.data.user, res.data.data.accessToken);
      toast.success('Account created successfully!');
      navigate('/questionnaire');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 font-sans pt-24">
      <div className="bg-white rounded-[2rem] shadow-2xl flex max-w-5xl w-full overflow-hidden border border-slate-100">
        
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
          {/* Background decorative blob */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                StartSahay
              </span>
            </Link>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              Join the Startup Support Platform
            </h1>
            <p className="text-slate-600 mb-8 text-lg">
              Create your account and get personalized scheme recommendations, AI analysis and pitch deck generation.
            </p>

            <ul className="space-y-4">
              {[
                'Discover relevant schemes',
                'Check eligibility automatically',
                'Get AI-powered insights',
                'Generate professional pitch decks',
                'Track your startup journey'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 relative z-10 opacity-90">
             <div className="w-full h-48 bg-indigo-100/50 rounded-2xl flex items-center justify-center border border-indigo-200/50 backdrop-blur-sm shadow-sm">
                <svg className="w-24 h-24 text-indigo-300" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
             </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Create Your Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="Enter your full name"
              />
              {errors.name && <span className="text-xs text-rose-500 mt-1.5 font-medium">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="you@example.com"
              />
              {errors.email && <span className="text-xs text-rose-500 mt-1.5 font-medium">{errors.email.message}</span>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium"
                  placeholder="Create a strong password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-rose-500 mt-1.5 font-medium">{errors.password.message}</span>}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 mt-6"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <p className="text-center text-slate-600 mt-8 font-medium">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

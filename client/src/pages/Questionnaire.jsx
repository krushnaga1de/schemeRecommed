import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import StepIndicator from '../components/StepIndicator';

const Questionnaire = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing profile if editing
    api.get('/profile').then(res => {
      const p = res.data.data.profile;
      if (p) {
        Object.keys(p).forEach(key => {
          if (key === 'fundingNeeded') {
            setValue('fundingNeeded.min', p[key].min);
            setValue('fundingNeeded.max', p[key].max);
          } else {
            setValue(key, p[key]);
          }
        });
      }
    }).catch(e => console.log('No existing profile to pre-fill'));
  }, [setValue]);

  const onSubmit = async (data) => {
    if (step < 1) {
      setStep(1);
      return;
    }
    
    setIsLoading(true);
    try {
      // Data cleanup
      data.teamSize = parseInt(data.teamSize) || 1;
      data.fundingNeeded.min = parseInt(data.fundingNeeded.min) || 0;
      data.fundingNeeded.max = parseInt(data.fundingNeeded.max) || 0;

      await api.post('/profile', data);
      
      const recRes = await api.post('/recommend');
      navigate('/results', { state: { recommendations: recRes.data.data } });
    } catch (err) {
      toast.error('Failed to submit profile or generate recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-10 shadow-sm border border-slate-100">
        
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Startup Profile
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Help us understand your startup to find the most relevant schemes.
            </p>
          </div>
        </div>
        <div className="mb-8">
          <StepIndicator currentStep={step} totalSteps={2} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry / Sector</label>
                <select {...register('industry')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="tech">Technology & Software</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="agriculture">Agriculture & Agritech</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Stage</label>
                <select {...register('businessStage')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="idea">Idea / Concept</option>
                  <option value="mvp">MVP / Prototype</option>
                  <option value="early_revenue">Early Revenue</option>
                  <option value="scaling">Scaling</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                  <input type="text" {...register('state')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Maharashtra" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
                  <input type="number" min="1" required {...register('teamSize', { required: true })} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="1" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Funding Needed (₹)</label>
                  <input type="number" min="0" required {...register('fundingNeeded.min', { required: true })} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="500000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Funding Needed (₹)</label>
                  <input type="number" min="0" required {...register('fundingNeeded.max', { required: true })} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="2000000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                <select {...register('businessType')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="tech">Tech Product</option>
                  <option value="manufacturing">Physical Product / Manufacturing</option>
                  <option value="services">Service Based</option>
                  <option value="agriculture">Agri / Farming</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DPIIT Registered?</label>
                <select {...register('dpiitRegistered')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="not_sure">Not Sure</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-xl">
                <p className="text-sm font-bold text-slate-800">Special Categories (Optional)</p>
                <p className="text-xs text-slate-500 mb-2">Check any that apply to unlock reserved funding pools.</p>
                
                <label className="flex items-center p-2 hover:bg-white rounded transition-colors cursor-pointer">
                  <input type="checkbox" {...register('womenLed')} className="mr-3 w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-slate-700">Women-Led Enterprise</span>
                </label>
                <label className="flex items-center p-2 hover:bg-white rounded transition-colors cursor-pointer">
                  <input type="checkbox" {...register('scStFounder')} className="mr-3 w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-slate-700">SC/ST Founder</span>
                </label>
                <label className="flex items-center p-2 hover:bg-white rounded transition-colors cursor-pointer">
                  <input type="checkbox" {...register('differentlyAbledFounder')} className="mr-3 w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-slate-700">Differently Abled Founder</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(0)} className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2">
                &larr; Back
              </button>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="ml-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                   <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                   Analyzing...
                </>
              ) : (
                step === 0 ? 'Next Step' : 'Get Matches \u2728'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;

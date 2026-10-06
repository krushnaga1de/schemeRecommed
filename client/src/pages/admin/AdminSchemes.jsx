import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminSchemes = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get('q') || '').toLowerCase();
  
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editSchemeId, setEditSchemeId] = useState(null);
  const initialSchemeState = {
    name: '', issuingBody: '', level: 'central', state: '', fundingType: 'grant', applicationLink: '', description: '',
    sectorTags: [], businessStageEligibility: [],
    eligibilityCriteria: { minTeamSize: '', maxTeamSize: '', dpiitRequired: false, specialCategoryOnly: [], other: '' },
    fundingAmount: { min: 0, max: 0 }
  };
  const [newScheme, setNewScheme] = useState(initialSchemeState);

  const handleArrayChange = (field, value, isNested = null) => {
    setNewScheme(prev => {
      let currentArray = isNested ? (prev[isNested][field] || []) : (prev[field] || []);
      const newArray = currentArray.includes(value) ? currentArray.filter(i => i !== value) : [...currentArray, value];
      if (isNested) return { ...prev, [isNested]: { ...prev[isNested], [field]: newArray } };
      return { ...prev, [field]: newArray };
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const schemesRes = await api.get('/admin/schemes?limit=50');
      setSchemes(schemesRes.data.data.schemes);
    } catch (e) {
      toast.error('Failed to load schemes');
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

  const handleActivate = async (id) => {
    try {
      await api.put(`/admin/schemes/${id}`, { isActive: true });
      toast.success('Scheme activated');
      fetchData();
    } catch (e) {
      toast.error('Failed to activate');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSchemeId) {
        await api.put(`/admin/schemes/${editSchemeId}`, newScheme);
        toast.success('Scheme updated successfully');
      } else {
        await api.post('/admin/schemes', newScheme);
        toast.success('Scheme added successfully');
      }
      setIsAddModalOpen(false);
      setNewScheme(initialSchemeState);
      setEditSchemeId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save scheme');
    }
  };

  const handleEdit = (scheme) => {
    setNewScheme({
      name: scheme.name || '',
      issuingBody: scheme.issuingBody || '',
      level: scheme.level || 'central',
      state: scheme.state || '',
      fundingType: scheme.fundingType || 'grant',
      applicationLink: scheme.applicationLink || '',
      description: scheme.description || '',
      sectorTags: scheme.sectorTags || [],
      businessStageEligibility: scheme.businessStageEligibility || [],
      eligibilityCriteria: {
        minTeamSize: scheme.eligibilityCriteria?.minTeamSize ?? '',
        maxTeamSize: scheme.eligibilityCriteria?.maxTeamSize ?? '',
        dpiitRequired: scheme.eligibilityCriteria?.dpiitRequired || false,
        specialCategoryOnly: scheme.eligibilityCriteria?.specialCategoryOnly || [],
        other: scheme.eligibilityCriteria?.other || ''
      },
      fundingAmount: {
        min: scheme.fundingAmount?.min || 0,
        max: scheme.fundingAmount?.max || 0
      }
    });
    setEditSchemeId(scheme._id);
    setIsAddModalOpen(true);
  };

  if (loading) return <div className="text-center text-slate-500 py-20 flex items-center justify-center">Loading Schemes...</div>;

  return (
    <div className="w-full pb-10">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manage Schemes</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">All Schemes</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>+</span> Add Scheme
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm bg-slate-50/50">
                  <th className="py-4 pl-4 pr-4 font-bold uppercase tracking-wider text-[11px] rounded-tl-lg">Scheme Name</th>
                  <th className="py-4 pr-4 font-bold uppercase tracking-wider text-[11px]">Body</th>
                  <th className="py-4 pr-4 font-bold uppercase tracking-wider text-[11px]">Level</th>
                  <th className="py-4 pr-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                  <th className="py-4 font-bold uppercase tracking-wider text-[11px] rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {schemes.filter(s => (s.name || '').toLowerCase().includes(q) || (s.issuingBody || '').toLowerCase().includes(q)).map(s => (
                  <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-4 pr-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{s.issuingBody}</td>
                    <td className="py-4 pr-4 capitalize text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200">{s.level}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-bold flex w-max items-center gap-1.5 ${s.isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-white font-semibold text-xs border border-indigo-200 hover:bg-indigo-600 hover:border-indigo-600 px-3 py-1.5 rounded-lg transition-all">
                          Edit
                        </button>
                        {s.isActive ? (
                          <button onClick={() => handleDelete(s._id)} className="text-rose-600 hover:text-white font-semibold text-xs border border-rose-200 hover:bg-rose-600 hover:border-rose-600 px-3 py-1.5 rounded-lg transition-all">
                            Deactivate
                          </button>
                        ) : (
                          <button onClick={() => handleActivate(s._id)} className="text-emerald-600 hover:text-white font-semibold text-xs border border-emerald-200 hover:bg-emerald-600 hover:border-emerald-600 px-3 py-1.5 rounded-lg transition-all">
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {schemes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No schemes found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Scheme Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-slate-800">{editSchemeId ? 'Edit Scheme' : 'Add New Scheme'}</h2>
              <button onClick={() => { setIsAddModalOpen(false); setEditSchemeId(null); setNewScheme(initialSchemeState); }} className="text-slate-400 hover:text-slate-700 text-2xl leading-none transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Scheme Name</label>
                    <input required value={newScheme.name} onChange={e => setNewScheme({...newScheme, name: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Issuing Body</label>
                    <input required value={newScheme.issuingBody} onChange={e => setNewScheme({...newScheme, issuingBody: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Level</label>
                    <select value={newScheme.level} onChange={e => setNewScheme({...newScheme, level: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                      <option value="central">Central</option>
                      <option value="state">State</option>
                    </select>
                  </div>
                  {newScheme.level === 'state' && (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Which State?</label>
                      <input required value={newScheme.state} onChange={e => setNewScheme({...newScheme, state: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="E.g. Karnataka" />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                    <textarea required value={newScheme.description} onChange={e => setNewScheme({...newScheme, description: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" rows="2"></textarea>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Classification & Tags</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Sector Tags</label>
                  <div className="flex flex-wrap gap-3">
                    {['tech', 'manufacturing', 'agriculture', 'services', 'other'].map(tag => (
                      <label key={tag} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <input type="checkbox" checked={newScheme.sectorTags.includes(tag)} onChange={() => handleArrayChange('sectorTags', tag)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span className="capitalize">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Business Stage Eligibility</label>
                  <div className="flex flex-wrap gap-3">
                    {['idea', 'mvp', 'early_revenue', 'scaling'].map(stage => (
                      <label key={stage} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <input type="checkbox" checked={newScheme.businessStageEligibility.includes(stage)} onChange={() => handleArrayChange('businessStageEligibility', stage)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span className="capitalize">{stage.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Eligibility Criteria</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Min Team Size</label>
                    <input type="number" min="1" value={newScheme.eligibilityCriteria.minTeamSize === null ? '' : newScheme.eligibilityCriteria.minTeamSize} onChange={e => setNewScheme({...newScheme, eligibilityCriteria: {...newScheme.eligibilityCriteria, minTeamSize: e.target.value === '' ? null : Number(e.target.value)}})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Max Team Size</label>
                    <input type="number" min="1" value={newScheme.eligibilityCriteria.maxTeamSize === null ? '' : newScheme.eligibilityCriteria.maxTeamSize} onChange={e => setNewScheme({...newScheme, eligibilityCriteria: {...newScheme.eligibilityCriteria, maxTeamSize: e.target.value === '' ? null : Number(e.target.value)}})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 p-3 rounded-xl hover:bg-slate-100 transition-colors w-max">
                      <input type="checkbox" checked={newScheme.eligibilityCriteria.dpiitRequired} onChange={e => setNewScheme({...newScheme, eligibilityCriteria: {...newScheme.eligibilityCriteria, dpiitRequired: e.target.checked}})} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                      DPIIT Registration Required
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Special Category Only (Optional)</label>
                    <div className="flex flex-wrap gap-3">
                      {['women', 'sc_st', 'differently_abled'].map(cat => (
                        <label key={cat} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                          <input type="checkbox" checked={newScheme.eligibilityCriteria.specialCategoryOnly.includes(cat)} onChange={() => handleArrayChange('specialCategoryOnly', cat, 'eligibilityCriteria')} className="rounded text-indigo-600 focus:ring-indigo-500" />
                          <span className="capitalize">{cat.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Other Criteria</label>
                    <input value={newScheme.eligibilityCriteria.other} onChange={e => setNewScheme({...newScheme, eligibilityCriteria: {...newScheme.eligibilityCriteria, other: e.target.value}})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="E.g. Must have a scalable business model" />
                  </div>
                </div>
              </div>

              {/* Funding & Application */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Funding & Application</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Funding Type</label>
                    <select value={newScheme.fundingType} onChange={e => setNewScheme({...newScheme, fundingType: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                      <option value="grant">Grant</option>
                      <option value="loan">Loan</option>
                      <option value="subsidy">Subsidy</option>
                      <option value="equity">Equity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Application Link</label>
                    <input required type="url" value={newScheme.applicationLink} onChange={e => setNewScheme({...newScheme, applicationLink: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="https://" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Min Funding (₹)</label>
                    <input type="number" min="0" required value={newScheme.fundingAmount.min} onChange={e => setNewScheme({...newScheme, fundingAmount: {...newScheme.fundingAmount, min: e.target.value === '' ? '' : Number(e.target.value)}})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Max Funding (₹)</label>
                    <input type="number" min="0" required value={newScheme.fundingAmount.max} onChange={e => setNewScheme({...newScheme, fundingAmount: {...newScheme.fundingAmount, max: e.target.value === '' ? '' : Number(e.target.value)}})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditSchemeId(null); setNewScheme(initialSchemeState); }} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-semibold">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">{editSchemeId ? 'Update Scheme' : 'Save Scheme'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchemes;

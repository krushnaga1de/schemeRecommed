import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/recommend/history'),
      api.get('/profile/saved-schemes')
    ])
      .then(([historyRes, savedRes]) => {
        setHistory(historyRes.data.data.history);
        const savedIds = new Set(savedRes.data.data.schemes.map(s => s._id));
        setSavedSchemes(savedIds);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-10 pb-6 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Welcome, {user?.name.split(' ')[0]}</h1>
            <p className="text-slate-500 mt-1">Manage your profile and past recommendations</p>
          </div>
          <Link to="/questionnaire" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md">
            Update Profile & Rematch
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full inline-block"></span>
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-2xl mx-auto mt-12 border-dashed border-2 border-slate-300">
            <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No recommendations yet</h3>
            <p className="text-slate-500 mb-6">Complete your business profile to see which government schemes you qualify for.</p>
            <Link to="/questionnaire" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md inline-block">
              Start Questionnaire
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            <h2 className="font-display text-2xl font-bold text-slate-800 mb-6">Recommendation History</h2>
            {history.map((run) => (
              <div key={run._id} className="animate-fade-in bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Matches from {new Date(run.generatedAt).toLocaleDateString()}
                  </h3>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {run.recommendedSchemes.length} scheme{run.recommendedSchemes.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                
                {run.recommendedSchemes.length === 0 ? (
                  <p className="text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">No matching schemes were found during this run.</p>
                ) : (
                  <div className="flex flex-col gap-[14px]">
                    {run.recommendedSchemes.map(rs => (
                      <SchemeCard 
                        key={rs.schemeId?._id || rs._id} 
                        scheme={rs.schemeId} 
                        score={rs.matchScore} 
                        explanation={rs.explanation} 
                        initialIsSaved={savedSchemes.has(rs.schemeId?._id)} 
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search } from 'lucide-react';
import api from '../services/api';
import SchemeCard from '../components/SchemeCard';

const Saved = () => {
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedSchemes();
  }, []);

  const fetchSavedSchemes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile/saved-schemes');
      setSavedSchemes(res.data.data.schemes);
    } catch (error) {
      console.error('Failed to fetch saved schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-indigo-600" />
              Saved Schemes
            </h1>
            <p className="text-slate-500 mt-2">Schemes you've bookmarked for later review or application</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full inline-block"></span>
          </div>
        ) : savedSchemes.length === 0 ? (
          <div className="bg-white/50 p-12 rounded-2xl border-dashed border-2 border-slate-200 text-center max-w-2xl mx-auto mt-12">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No saved schemes yet</h3>
            <p className="text-slate-500 mb-6">You haven't saved any schemes yet. Browse your recommendations and click save on the ones you're interested in.</p>
            <Link to="/results" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              View Recommendations
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {savedSchemes.map((scheme) => (
              <SchemeCard 
                key={scheme._id} 
                scheme={scheme} 
                initialIsSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;

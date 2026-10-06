import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const SchemeCard = ({ scheme, score, explanation, initialIsSaved = false }) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/profile/saved-schemes/${scheme._id}`);
      setIsSaved(res.data.isSaved);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to update saved scheme');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (matchScore) => {
    if (matchScore >= 80) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (matchScore >= 65) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (matchScore < 50) return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-blue-50 text-blue-600 border-blue-200';
  };

  return (
    <div className="bg-white rounded-[16px] p-[20px] md:p-[22px] border border-slate-100 shadow-sm hover:shadow-md transition-all grid grid-cols-1 sm:grid-cols-[96px_1fr_150px] gap-4 sm:gap-6 items-stretch w-full">
      
      {/* Top row on mobile: Score + Content */}
      <div className="grid grid-cols-[80px_1fr] gap-4 sm:contents">
        
        {/* Score Block */}
        {score ? (
          <div className={`col-span-1 flex flex-col items-center justify-center rounded-xl p-3 border ${getScoreColor(score)}`}>
            <span className="text-2xl sm:text-3xl font-bold">{score}%</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 opacity-80 text-center">Match</span>
          </div>
        ) : (
          <div className="hidden sm:block"></div>
        )}

        {/* Content Block */}
        <div className={`flex flex-col justify-center min-w-0 ${!score ? 'col-span-2 sm:col-span-1' : 'col-span-1'}`}>
          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 truncate">{scheme.name}</h3>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mb-2 truncate">{scheme.issuingBody}</p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {scheme.fundingType}
            </span>
            {scheme.businessStageEligibility?.map(stage => (
              <span key={stage} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {stage.replace('_', ' ')}
              </span>
            ))}
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {scheme.level === 'central' ? 'All India' : scheme.state}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-2">
            {scheme.description}
          </p>
          
          {/* Explanation */}
          {explanation && (
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              <strong className="text-slate-700 font-semibold">Why this matches:</strong> {explanation}
            </p>
          )}
        </div>
      </div>

      {/* Actions Block */}
      <div className="flex flex-row sm:flex-col gap-3 justify-center sm:pl-4 sm:border-l border-slate-100 mt-1 sm:mt-0 w-full">
        <a 
          href={scheme.applicationLink} 
          target="_blank" 
          rel="noreferrer"
          className="flex-1 sm:w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          View Details
        </a>
        <button 
          onClick={handleSave}
          disabled={loading}
          aria-pressed={isSaved}
          className={`flex-1 sm:w-full text-center border-2 font-bold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${isSaved ? 'border-rose-100 text-rose-600 bg-rose-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> 
          {loading ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
        </button>
      </div>
    </div>
  );
};

export default SchemeCard;

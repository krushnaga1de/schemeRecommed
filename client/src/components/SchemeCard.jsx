import React from 'react';

const SchemeCard = ({ scheme, score, explanation }) => {
  return (
    <div className="glass-card p-6 hover:shadow-2xl transition-all border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md mb-2">
            {scheme.issuingBody} • {scheme.level.toUpperCase()}
          </span>
          <h3 className="text-xl font-bold text-slate-900">{scheme.name}</h3>
        </div>
        {score && (
          <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {score}% Match
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-slate-500 mb-1 font-medium">Funding Amount</p>
          <p className="font-semibold text-slate-800">
            ₹{scheme.fundingAmount.min.toLocaleString()} - ₹{scheme.fundingAmount.max.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-slate-500 mb-1 font-medium">Funding Type</p>
          <p className="font-semibold text-slate-800 capitalize">{scheme.fundingType}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-slate-600 text-sm line-clamp-2">{scheme.description}</p>
      </div>

      {explanation && (
        <div className="bg-primary-50/50 border-l-4 border-primary-500 p-4 rounded-r-lg mb-6">
          <p className="text-sm text-primary-900 leading-relaxed italic">
            "{explanation}"
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
        <a 
          href={scheme.applicationLink} 
          target="_blank" 
          rel="noreferrer"
          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-1 bg-primary-50 px-4 py-2 rounded-lg"
        >
          Apply on Official Portal <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default SchemeCard;

import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';

const Results = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations;

  if (!recommendations) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Recommended Schemes
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Based on your startup profile, here are the most relevant schemes for you.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
             <Link to="/questionnaire" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
               Edit Profile
             </Link>
          </div>
        </div>

        {recommendations.schemes?.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No exact matches right now</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              We couldn't find active schemes that perfectly match your current business stage and funding needs. Check back later or adjust your criteria.
            </p>
            <Link to="/questionnaire" className="text-primary-600 font-bold hover:underline">
              &larr; Edit your profile
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 animate-fade-in">
            {recommendations.schemes?.map((s, idx) => (
              <div key={s._id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slide-up" style={{animationFillMode: 'both'}}>
                <SchemeCard scheme={s} score={s.matchScore} explanation={s.explanation} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 font-bold transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;

import React from 'react';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <React.Fragment key={i}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${i < currentStep ? 'bg-primary-600 text-white shadow-md' : i === currentStep ? 'bg-primary-100 text-primary-700 border-2 border-primary-500 scale-110' : 'bg-slate-200 text-slate-500'}`}>
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`h-1 w-12 rounded-full transition-all ${i < currentStep ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;

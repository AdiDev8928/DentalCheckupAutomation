import React from 'react';
import { TREATMENT_OPTIONS } from '../data/dentalData';
import { TreatmentOption } from '../types';
import {
  Sparkles,
  Sun,
  Smile,
  ShieldAlert,
  ShieldCheck,
  HeartHandshake,
  Activity,
  Stethoscope,
  Check,
  Clock
} from 'lucide-react';

interface TreatmentSelectorProps {
  selectedTreatmentId: string;
  onSelectTreatment: (treatment: TreatmentOption) => void;
}

export const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({
  selectedTreatmentId,
  onSelectTreatment,
}) => {
  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-sky-600" };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Smile':
        return <Smile {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'Stethoscope':
      default:
        return <Stethoscope {...props} />;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-800">
        Select Dental Treatment Type <span className="text-rose-500">*</span>
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TREATMENT_OPTIONS.map((treatment) => {
          const isSelected = selectedTreatmentId === treatment.id || selectedTreatmentId === treatment.title;
          
          return (
            <div
              key={treatment.id}
              onClick={() => onSelectTreatment(treatment)}
              className={`relative cursor-pointer p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/90 border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-100' : 'bg-slate-100'}`}>
                    {getIcon(treatment.iconName)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {treatment.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Approx. {treatment.durationMinutes} mins
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-sky-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-normal pl-10">
                {treatment.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

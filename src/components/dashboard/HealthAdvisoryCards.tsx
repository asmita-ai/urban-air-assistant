import React from 'react';
import { AQIData } from '@/types';
import { ShieldAlert, Baby, UserCheck, HeartPulse, Briefcase } from 'lucide-react';

interface HealthAdvisoryCardsProps {
  data: AQIData;
  onExploreRoutines: () => void;
  onExploreIAQ: () => void;
}

export const HealthAdvisoryCards: React.FC<HealthAdvisoryCardsProps> = ({
  data,
  onExploreRoutines,
  onExploreIAQ,
}) => {
  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
      role="region"
      aria-label="Health and Exposure Protocols"
    >
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
          <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          <span>Health & Exposure Protocol</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{data.healthAdvisory}</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Winter smog particles (PM2.5) are bound to toxic chemical sulphates, nitrates, and heavy
          metals. Prolonged exposure causes systemic inflammation and reduces peak expiratory flow.
        </p>

        {/* Targeted Persona Guidance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Children */}
          <div
            className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5"
            role="article"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
              <Baby className="w-4 h-4" aria-hidden="true" />
              <span>Children & Toddlers</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              {data.vulnerabilityAlerts.children}
            </p>
          </div>

          {/* Seniors */}
          <div
            className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5"
            role="article"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 mb-1">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
              <span>Senior Citizens</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              {data.vulnerabilityAlerts.seniors}
            </p>
          </div>

          {/* Respiratory / Asthmatic */}
          <div
            className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5"
            role="article"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-red-400 mb-1">
              <HeartPulse className="w-4 h-4" aria-hidden="true" />
              <span>Asthma / Cardiac Patients</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              {data.vulnerabilityAlerts.respiratory}
            </p>
          </div>

          {/* Daily Commuters */}
          <div
            className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5"
            role="article"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 mb-1">
              <Briefcase className="w-4 h-4" aria-hidden="true" />
              <span>Daily Commuters</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              {data.vulnerabilityAlerts.outdoorWorkers}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation CTAs */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-3">
        <button
          onClick={onExploreRoutines}
          aria-label="Switch tab to Plan Low-Emission Routine"
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20 text-center cursor-pointer"
        >
          Plan Low-Emission Routine →
        </button>
        <button
          onClick={onExploreIAQ}
          aria-label="Switch tab to Audit Indoor Air & Hacks"
          className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-center cursor-pointer"
        >
          Audit Indoor Air & Hacks →
        </button>
      </div>
    </div>
  );
};

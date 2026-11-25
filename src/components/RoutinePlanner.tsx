'use client';

import React from 'react';
import { RoutinePlan, AQIData, HouseholdProfile } from '@/types';
import {
  Calendar,
  Sparkles,
  Leaf,
  Clock,
  ShieldCheck,
  Zap,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

interface RoutinePlannerProps {
  plan: RoutinePlan | null;
  aqiData: AQIData;
  profile: HouseholdProfile;
  isLoading: boolean;
  onRefreshPlan: () => void;
}

export const RoutinePlanner: React.FC<RoutinePlannerProps> = ({
  plan,
  aqiData,
  profile,
  isLoading,
  onRefreshPlan,
}) => {
  if (isLoading || !plan) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 mx-auto flex items-center justify-center animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Synthesizing Contextual Routine Plan with Gemini...
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Harmonizing real-time AQI in {aqiData.city} ({aqiData.aqi} AQI) with{' '}
          {profile.familyMembers.length} family member risk profiles and commute parameters.
        </p>
      </div>
    );
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Severe':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'High':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Medium':
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Headline, Smog Summary & Emission Savings Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Sparkles className="w-4 h-4" />
              <span>GenAI Dynamic Routine Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {plan.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {plan.smogSeveritySummary}
            </p>
          </div>

          {/* Savings Metric Pills */}
          <div className="flex sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-teal-300">
                  {plan.totalPotentialCO2SavingsKg} kg
                </span>
                <span className="text-[11px] block text-slate-400 font-medium">
                  CO₂ Emissions Avoidable
                </span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-indigo-300">
                  {plan.totalPotentialPMSavingsGrams} g
                </span>
                <span className="text-[11px] block text-slate-400 font-medium">
                  Toxic PM Prevented
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trip-Chaining Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/50 flex items-start space-x-3">
          <Zap className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-teal-300 block mb-0.5">
              Smart Trip Chaining Recommendation:
            </span>
            <span className="text-slate-300 leading-relaxed">{plan.tripCombiningAdvice}</span>
          </div>
        </div>
      </div>

      {/* Routine Timeline Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <span>Time-Slot Specific Actionable Protocols</span>
          </h3>
          <button
            onClick={onRefreshPlan}
            className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-plan with Gemini</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plan.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition-all space-y-4"
            >
              {/* Header: Time, Target, Risk */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold font-mono text-teal-300">{item.timeSlot}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-300 font-semibold bg-slate-800 px-2.5 py-0.5 rounded-full">
                    Target: {item.targetMember}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getRiskBadge(item.exposureRisk)}`}
                >
                  {item.exposureRisk} Exposure Risk
                </span>
              </div>

              {/* Title & Routine Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-2">
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Standard High-Emission Routine:
                    </span>
                    <p className="text-xs text-slate-300 leading-normal">{item.activity}</p>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2">
                  <div className="bg-teal-950/30 rounded-xl p-3 border border-teal-800/50 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider flex items-center space-x-1 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Recommended Low-Emission Alternative:</span>
                      </span>
                      <p className="text-xs text-white font-medium leading-relaxed">
                        {item.lowEmissionAlternative}
                      </p>
                    </div>

                    {/* Savings Chips */}
                    <div className="flex items-center space-x-3 pt-3 mt-2 border-t border-teal-800/40 text-[11px]">
                      {item.emissionsAvoidedKgCO2 > 0 && (
                        <span className="text-emerald-400 font-bold">
                          🌱 -{item.emissionsAvoidedKgCO2} kg CO₂
                        </span>
                      )}
                      {item.pmAvoidedGrams > 0 && (
                        <span className="text-indigo-400 font-bold">
                          🛡️ -{item.pmAvoidedGrams}g PM
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scientific Rationale / Why this matters */}
              <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-teal-400 font-bold flex-shrink-0">Why:</span>
                <span className="leading-relaxed">{item.justification}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

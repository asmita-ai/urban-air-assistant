'use client';

import React, { useState } from 'react';
import { SustainableImpactAction, AQIData } from '@/types';
import { Activity, Leaf, Share2, Award, TrendingDown, TreePine, Check } from 'lucide-react';

interface ImpactTrackerProps {
  aqiData: AQIData;
}

const DEFAULT_ACTIONS: SustainableImpactAction[] = [
  {
    id: 'act-1',
    title: 'Took Metro / Public Electric Transit instead of Solo Car',
    category: 'commute',
    description:
      'Electrified mass transit emits up to 90% less CO₂ per passenger-km compared to single-occupant petrol cars.',
    co2SavingsKg: 3.8,
    pmSavingsGrams: 1.2,
    completed: true,
  },
  {
    id: 'act-2',
    title: 'Trip Chaining: Combined 3 Shopping Errands into 1 Unified Loop',
    category: 'commute',
    description:
      'Eliminated 2 cold engine starts, which produce the highest concentration of toxic unburnt hydrocarbons.',
    co2SavingsKg: 1.4,
    pmSavingsGrams: 0.5,
    completed: true,
  },
  {
    id: 'act-3',
    title: 'Electrostatic Wet Mopping (Banned Dry Broom Sweeping)',
    category: 'home',
    description:
      'Captured floor dust without re-suspending settled PM2.5 and PM10 particles into breathing zones.',
    co2SavingsKg: 0.1,
    pmSavingsGrams: 15.0,
    completed: false,
  },
  {
    id: 'act-4',
    title: 'Wore Certified N95 Respirator During Outdoor Transit',
    category: 'lifestyle',
    description:
      'Filters 95% of fine combustion soot and heavy metal particulates before reaching alveoli.',
    co2SavingsKg: 0.0,
    pmSavingsGrams: 0.9,
    completed: true,
  },
  {
    id: 'act-5',
    title: 'Sealed Bedroom Windows & Installed Door Draft Snakes',
    category: 'home',
    description:
      'Reduced uncontrolled outdoor smog infiltration rate by 55%, lowering purifier energy consumption.',
    co2SavingsKg: 0.6,
    pmSavingsGrams: 2.5,
    completed: false,
  },
  {
    id: 'act-6',
    title: 'Prepared Dinner with Covered Cookware & Exhaust Extraction',
    category: 'home',
    description:
      'Contained aerosolized cooking oils and combustion byproducts within kitchen bounds.',
    co2SavingsKg: 0.2,
    pmSavingsGrams: 0.8,
    completed: false,
  },
];

export const ImpactTracker: React.FC<ImpactTrackerProps> = ({ aqiData }) => {
  const [actions, setActions] = useState<SustainableImpactAction[]>(DEFAULT_ACTIONS);
  const [copied, setCopied] = useState(false);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  const completedActions = actions.filter((a) => a.completed);
  const totalCO2Saved = completedActions.reduce((acc, a) => acc + a.co2SavingsKg, 0);
  const totalPMSaved = completedActions.reduce((acc, a) => acc + a.pmSavingsGrams, 0);
  const treeEquivDays = (totalCO2Saved / 0.06).toFixed(1); // average tree absorbs ~60g CO2/day

  const handleShare = () => {
    const text = `🌱 Today in ${aqiData.city} (AQI: ${aqiData.aqi}), I took sustainable action with VayuMitra:
- Avoided ${totalCO2Saved.toFixed(1)} kg of CO₂ emissions
- Prevented ${totalPMSaved.toFixed(1)}g of toxic particulate pollution
- Completed ${completedActions.length} / ${actions.length} clean air commitments!

Every individual choice breaks the winter smog crisis. Try VayuMitra!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
              <Activity className="w-4 h-4" />
              <span>Direct Personal & Community Impact Tracker</span>
            </div>
            <h2 className="text-xl font-bold text-white">Your Smog Reduction Footprint</h2>
            <p className="text-xs text-slate-400">
              Clear accountability: quantify how your daily commute and lifestyle adjustments
              directly alleviate urban smog.
            </p>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20"
          >
            {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Commitment Card!' : 'Share Commitment Card'}</span>
          </button>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-300">
                {totalCO2Saved.toFixed(1)} kg
              </span>
              <span className="text-[11px] block text-slate-400 font-medium">
                CO₂ Emissions Avoided
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-indigo-300">
                {totalPMSaved.toFixed(1)} g
              </span>
              <span className="text-[11px] block text-slate-400 font-medium">
                PM Particulates Cut
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-teal-300">{treeEquivDays} days</span>
              <span className="text-[11px] block text-slate-400 font-medium">
                Tree Absorption Equivalent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Choices Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-teal-400" />
            <span>
              Interactive Sustainable Actions Checklist ({completedActions.length}/{actions.length})
            </span>
          </h3>
          <span className="text-xs font-semibold text-teal-400">
            {Math.round((completedActions.length / actions.length) * 100)}% Completed
          </span>
        </div>

        <div className="space-y-3">
          {actions.map((act) => (
            <div
              key={act.id}
              role="checkbox"
              aria-checked={act.completed}
              aria-label={act.title}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAction(act.id);
                }
              }}
              onClick={() => toggleAction(act.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                act.completed
                  ? 'bg-teal-950/20 border-teal-500/50'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800/90'
              }`}
            >
              <div className="mt-0.5">
                {act.completed ? (
                  <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center text-slate-950 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-md border-2 border-slate-600 hover:border-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4
                    className={`text-sm font-bold ${act.completed ? 'text-teal-300' : 'text-white'}`}
                  >
                    {act.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px]">
                    {act.co2SavingsKg > 0 && (
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        -{act.co2SavingsKg} kg CO₂
                      </span>
                    )}
                    {act.pmSavingsGrams > 0 && (
                      <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">
                        -{act.pmSavingsGrams}g PM
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-normal">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

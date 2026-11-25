'use client';

import React, { useState } from 'react';
import { IAQAuditResult, AQIData, HouseholdProfile } from '@/types';
import { Home, Fan, Leaf, Layers, Wrench, Sun } from 'lucide-react';

interface IAQLabProps {
  audit: IAQAuditResult | null;
  aqiData: AQIData;
  profile: HouseholdProfile;
  isLoading: boolean;
}

export const IAQLab: React.FC<IAQLabProps> = ({ audit, aqiData, profile: _profile, isLoading }) => {
  // Interactive Room Dimension CADR Calculator state
  const [roomLength, setRoomLength] = useState(15); // ft
  const [roomWidth, setRoomWidth] = useState(12); // ft
  const [roomHeight, setRoomHeight] = useState(10); // ft

  if (isLoading || !audit) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
        <div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Running Indoor Air Quality Audit...</h3>
      </div>
    );
  }

  // Calculate room volume in cubic feet & required CADR (Air Changes Per Hour = 4 to 5 target for clean air)
  const roomVolumeCuFt = roomLength * roomWidth * roomHeight;
  const targetCadrCfm = Math.round((roomVolumeCuFt * 4.5) / 60);

  const getWindowBadge = (status: string) => {
    switch (status) {
      case 'Open Safe':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
        };
      case 'Crack Windows Only':
        return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
      default:
        return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30' };
    }
  };

  const winBadge = getWindowBadge(audit.safeVentilationWindow.windowStatus);

  return (
    <div className="space-y-6">
      {/* Indoor vs Outdoor AQI Differential Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
              <Home className="w-4 h-4" />
              <span>Indoor Micro-Climate Audit</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Indoor Air Quality (IAQ) Defense Center
            </h2>
            <p className="text-xs text-slate-400">
              Outdoor smog infiltrates homes through gaps. Scientific hacks keep your indoor
              sanctuary breathable.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-medium">Outdoor AQI</span>
              <span className="text-2xl font-black text-rose-400">{aqiData.aqi}</span>
            </div>
            <div className="text-slate-600 font-bold">vs</div>
            <div className="text-center">
              <span className="text-[10px] text-teal-400 block font-medium">
                Estimated Indoor AQI
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {audit.currentIndoorAQIEstimate}
              </span>
            </div>
          </div>
        </div>

        {/* Ventilation Window Callout */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Optimal Natural Ventilation Window</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${winBadge.text} ${winBadge.bg} ${winBadge.border}`}
                >
                  {audit.safeVentilationWindow.windowStatus}
                </span>
              </div>
              <div className="text-xl font-extrabold text-teal-300 font-mono">
                {audit.safeVentilationWindow.bestTime}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {audit.safeVentilationWindow.explanation}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-700 text-[11px] text-slate-400">
              💡 Tip: Avoid opening windows before 11:00 AM or after 5:30 PM due to surface
              inversion pooling.
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Fan className="w-4 h-4 text-teal-400" />
                  <span>Purifier Speed & CADR Recommendation</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  {audit.purifierOptimization.recommendedFanSpeed} Speed
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {audit.purifierOptimization.diyHackRecommendation}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-700 flex justify-between text-[11px] text-slate-400">
              <span>Target Air Changes / Hour:</span>
              <span className="font-bold text-teal-300">
                {audit.purifierOptimization.roomAchRate} ACH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CADR Room Sizing Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <span>Interactive Room Air Purifier Sizing (CADR Calculator)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Calculate the exact Clean Air Delivery Rate (CADR in CFM) required to keep your bedroom
          free of toxic winter smog.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="roomLengthSlider" className="text-xs text-slate-300 block mb-1">
              Room Length: {roomLength} ft
            </label>
            <input
              id="roomLengthSlider"
              type="range"
              min="8"
              max="30"
              value={roomLength}
              aria-label="Room Length in feet"
              aria-valuenow={roomLength}
              aria-valuemin={8}
              aria-valuemax={30}
              aria-valuetext={`${roomLength} feet`}
              onChange={(e) => setRoomLength(Number(e.target.value))}
              className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="roomWidthSlider" className="text-xs text-slate-300 block mb-1">
              Room Width: {roomWidth} ft
            </label>
            <input
              id="roomWidthSlider"
              type="range"
              min="8"
              max="25"
              value={roomWidth}
              aria-label="Room Width in feet"
              aria-valuenow={roomWidth}
              aria-valuemin={8}
              aria-valuemax={25}
              aria-valuetext={`${roomWidth} feet`}
              onChange={(e) => setRoomWidth(Number(e.target.value))}
              className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="roomHeightSlider" className="text-xs text-slate-300 block mb-1">
              Ceiling Height: {roomHeight} ft
            </label>
            <input
              id="roomHeightSlider"
              type="range"
              min="8"
              max="14"
              value={roomHeight}
              aria-label="Ceiling Height in feet"
              aria-valuenow={roomHeight}
              aria-valuemin={8}
              aria-valuemax={14}
              aria-valuetext={`${roomHeight} feet`}
              onChange={(e) => setRoomHeight(Number(e.target.value))}
              className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block">Room Volume:</span>
            <span className="text-base font-bold text-white">
              {roomVolumeCuFt.toLocaleString()} cu. ft ({Math.round(roomVolumeCuFt * 0.0283)} m³)
            </span>
          </div>
          <div>
            <span className="text-[11px] text-teal-400 block font-medium">
              Recommended CADR for Severe Smog:
            </span>
            <span className="text-xl font-black text-teal-300">
              {targetCadrCfm} CFM ({Math.round(targetCadrCfm * 1.7)} m³/h)
            </span>
          </div>
          <div className="text-xs text-slate-300 max-w-xs">
            Achieves ~4.5 complete air exchanges per hour, dropping PM2.5 from 300 to &lt;25 within
            35 minutes.
          </div>
        </div>
      </div>

      {/* NASA Clean Air Plants Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span>NASA Clean Air Study — Recommended Indoor Plants</span>
          </h3>
          <p className="text-xs text-slate-400">
            Natural bio-filtration: leaves and root microbiomes absorb volatile organic compounds
            (VOCs) and settle suspended particulate dust.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audit.recommendedPlants.map((plant, idx) => (
            <div
              key={idx}
              className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{plant.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {plant.recommendedPerRoom} / room
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 italic mb-2">
                  {plant.scientificName}
                </div>
                <p className="text-xs text-slate-300 leading-normal mb-3">{plant.nasaBenefit}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center space-x-1">
                <span>🌱 Care:</span>
                <span className="text-slate-300 truncate">{plant.careNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Science Hacks */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-teal-400" />
          <span>Low-Cost Science-Backed Indoor Air Hacks</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audit.actionableHacks.map((hack, idx) => (
            <div
              key={idx}
              className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-teal-400 tracking-wider">
                    {hack.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300">
                    {hack.impactLevel} Impact
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{hack.title}</h4>
                <p className="text-xs text-slate-300 leading-normal mb-3">{hack.description}</p>

                <div className="bg-slate-900/60 rounded-lg p-2.5 mb-3 border border-slate-700/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Science Rationale:
                  </span>
                  <p className="text-[11px] text-slate-300">{hack.scientificReasoning}</p>
                </div>

                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Execution Steps:
                  </span>
                  {hack.actionSteps.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-300 flex items-start space-x-1.5">
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Est. Cost:</span>
                <span className="font-bold text-teal-300">{hack.estimatedCostINR}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

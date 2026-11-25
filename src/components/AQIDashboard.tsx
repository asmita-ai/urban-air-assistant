'use client';

import React from 'react';
import { AQIData } from '@/types';
import { getAQIColor } from '@/lib/aqiCalculator';
import {
  ShieldAlert,
  Wind,
  Droplets,
  Thermometer,
  Clock,
  Layers,
  Baby,
  HeartPulse,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface AQIDashboardProps {
  data: AQIData;
  onExploreRoutines: () => void;
  onExploreIAQ: () => void;
}

export const AQIDashboard: React.FC<AQIDashboardProps> = ({
  data,
  onExploreRoutines,
  onExploreIAQ,
}) => {
  const colors = getAQIColor(data.category);

  // Pollutant reference standards according to CPCB 24-hr standard
  const pollutantDetails = [
    {
      key: 'pm25',
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter (< 2.5 µm)',
      val: data.pollutants.pm25,
      unit: 'µg/m³',
      safeLimit: 60,
      cpcbStandard: '60 µg/m³',
      description: 'Penetrates deep into lung alveoli and enters bloodstream.',
    },
    {
      key: 'pm10',
      name: 'PM10',
      fullName: 'Respirable Particulate Matter (< 10 µm)',
      val: data.pollutants.pm10,
      unit: 'µg/m³',
      safeLimit: 100,
      cpcbStandard: '100 µg/m³',
      description: 'Dust, smoke, and pollen causing upper respiratory irritation.',
    },
    {
      key: 'no2',
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      val: data.pollutants.no2,
      unit: 'µg/m³',
      safeLimit: 80,
      cpcbStandard: '80 µg/m³',
      description: 'High-temperature diesel combustion; triggers acute asthma.',
    },
    {
      key: 'so2',
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      val: data.pollutants.so2,
      unit: 'µg/m³',
      safeLimit: 80,
      cpcbStandard: '80 µg/m³',
      description: 'Industrial and coal emissions; throat constrictor.',
    },
    {
      key: 'co',
      name: 'CO',
      fullName: 'Carbon Monoxide',
      val: data.pollutants.co,
      unit: 'mg/m³',
      safeLimit: 2.0,
      cpcbStandard: '2.0 mg/m³',
      description: 'Incomplete vehicular combustion; reduces blood oxygenation.',
    },
    {
      key: 'o3',
      name: 'O₃',
      fullName: 'Tropospheric Ozone',
      val: data.pollutants.o3,
      unit: 'µg/m³',
      safeLimit: 100,
      cpcbStandard: '100 µg/m³',
      description: 'Secondary photochemical smog formed with sunlight.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-Time Source, Timestamp, and Atmospheric Inversion Alert */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Verified Ground-Truth Station Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <span>Air Quality in {data.city}</span>
          </h2>
          <p className="text-xs text-slate-400 flex items-center space-x-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Observed at: {data.timestamp}</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">Source: {data.source}</span>
          </p>
        </div>

        {/* Atmospheric Winter Inversion Indicator */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center space-x-4 w-full md:w-auto">
          <div className="text-center">
            <div className="flex items-center justify-center text-slate-400 text-[11px] space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span>Temp</span>
            </div>
            <span className="text-sm font-bold text-slate-100">{data.temperature}°C</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="text-center">
            <div className="flex items-center justify-center text-slate-400 text-[11px] space-x-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Humidity</span>
            </div>
            <span className="text-sm font-bold text-slate-100">{data.humidity}%</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="text-center">
            <div className="flex items-center justify-center text-slate-400 text-[11px] space-x-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Wind</span>
            </div>
            <span className="text-sm font-bold text-slate-100">{data.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Main Hero Grid: Gauge Card & Health Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AQI Dial Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: colors.hex }}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                National Air Quality Index (CPCB)
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border"
                style={{
                  backgroundColor: `${colors.hex}20`,
                  color: colors.hex,
                  borderColor: `${colors.hex}40`,
                }}
              >
                {data.category}
              </span>
            </div>

            {/* Circular / Meter Visualization */}
            <div className="my-6 text-center">
              <div className="inline-flex flex-col items-center justify-center relative">
                <div
                  className="w-44 h-44 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-700 shadow-inner"
                  style={{
                    borderColor: colors.hex,
                    boxShadow: `0 0 35px ${colors.hex}30`,
                  }}
                >
                  <span className="text-5xl font-black tracking-tight text-white">{data.aqi}</span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                    CPCB AQI
                  </span>
                  <span
                    className="text-xs font-bold mt-1 px-2 py-0.5 rounded"
                    style={{ color: colors.hex }}
                  >
                    Primary: {data.primaryPollutant}
                  </span>
                </div>
              </div>
            </div>

            {/* AQI Range Legend Bar */}
            <div className="mt-4">
              <div className="h-2 rounded-full overflow-hidden flex w-full">
                <div className="bg-emerald-500 h-full flex-1" title="0-50 Good" />
                <div className="bg-green-500 h-full flex-1" title="51-100 Satisfactory" />
                <div className="bg-amber-500 h-full flex-1" title="101-200 Moderate" />
                <div className="bg-orange-500 h-full flex-1" title="201-300 Poor" />
                <div className="bg-rose-500 h-full flex-1" title="301-400 Very Poor" />
                <div className="bg-red-800 h-full flex-1" title="401-500 Severe" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
                <span>400</span>
                <span>500+</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Inversion Trap Level:</span>
            <span className="font-semibold text-orange-400">
              {data.windSpeed < 8 ? 'High (Calm Air Stagnation)' : 'Moderate Dispersion'}
            </span>
          </div>
        </div>

        {/* Right Column: General Advisory & Vulnerability Badges (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Health & Exposure Protocol</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{data.healthAdvisory}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Winter smog particles (PM2.5) are bound to toxic chemical sulphates, nitrates, and heavy metals. Prolonged exposure causes systemic inflammation and reduces peak expiratory flow.
            </p>

            {/* Targeted Persona Guidance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Children */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
                  <Baby className="w-4 h-4" />
                  <span>Children & Toddlers</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {data.vulnerabilityAlerts.children}
                </p>
              </div>

              {/* Seniors */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 mb-1">
                  <UserCheck className="w-4 h-4" />
                  <span>Senior Citizens</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {data.vulnerabilityAlerts.seniors}
                </p>
              </div>

              {/* Respiratory / Asthmatic */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-red-400 mb-1">
                  <HeartPulse className="w-4 h-4" />
                  <span>Asthma / Cardiac Patients</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {data.vulnerabilityAlerts.respiratory}
                </p>
              </div>

              {/* Daily Commuters */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 mb-1">
                  <Briefcase className="w-4 h-4" />
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
              className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20 text-center"
            >
              Plan Low-Emission Routine →
            </button>
            <button
              onClick={onExploreIAQ}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-center"
            >
              Audit Indoor Air & Hacks →
            </button>
          </div>
        </div>
      </div>

      {/* 24-Hour Hourly Forecast & Ventilation Windows */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>24-Hour Smog Inversion Profile & Ventilation Windows</span>
            </h3>
            <p className="text-xs text-slate-400">
              Smog peaks during morning and late evening thermal inversions. Green badges highlight safer atmospheric mixing windows.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Safe Window</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Peak Inversion</span>
            </span>
          </div>
        </div>

        {/* Hourly Cards Scrollable Container */}
        <div className="flex space-x-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {data.hourly.map((hour, idx) => {
            const hColor = getAQIColor(hour.category);
            const formattedTime = hour.time.includes('T') ? hour.time.split('T')[1].substring(0, 5) : hour.time;
            return (
              <div
                key={idx}
                className={`min-w-[100px] flex-shrink-0 rounded-xl p-3 border text-center transition-all ${
                  hour.isVentilationSafe
                    ? 'bg-emerald-950/40 border-emerald-600/60 ring-1 ring-emerald-500/40'
                    : 'bg-slate-800/60 border-slate-700/60'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-400 font-mono">{formattedTime}</div>
                <div className="my-2">
                  <span className="text-lg font-bold text-white">{hour.aqi}</span>
                  <div className="text-[10px] font-mono text-slate-400">PM {hour.pm25}</div>
                </div>
                <span
                  className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                  style={{ backgroundColor: `${hColor.hex}25`, color: hColor.hex }}
                >
                  {hour.category.substring(0, 8)}
                </span>
                {hour.isVentilationSafe && (
                  <div className="mt-1 text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">
                    ✓ Ventilate
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6-Pollutants Grid Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Full Chemical Pollutants Spectrum (CPCB Standards)</span>
            </h3>
            <p className="text-xs text-slate-400">
              National Ambient Air Quality Standards (NAAQS) 24-hour permissible thresholds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutantDetails.map((p) => {
            const ratio = p.val / p.safeLimit;
            const isExceeded = ratio > 1.0;
            return (
              <div
                key={p.key}
                className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isExceeded
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isExceeded ? `${ratio.toFixed(1)}x Limit` : 'Within Limit'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{p.fullName}</div>
                  <div className="my-2.5 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-black text-white">{p.val}</span>
                    <span className="text-xs text-slate-400">{p.unit}</span>
                  </div>

                  {/* Progress bar vs safe limit */}
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (p.val / (p.safeLimit * 2.5)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>CPCB Standard: {p.cpcbStandard}</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{p.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

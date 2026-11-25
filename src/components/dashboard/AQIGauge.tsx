import React from 'react';
import { AQIData } from '@/types';
import { getAQIColor } from '@/lib/aqiCalculator';

interface AQIGaugeProps {
  data: AQIData;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({ data }) => {
  const colors = getAQIColor(data.category);

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
      role="region"
      aria-label="National Air Quality Index Gauge"
    >
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: colors.hex }}
        aria-hidden="true"
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
              role="status"
              aria-label={`Current AQI is ${data.aqi}, classified as ${data.category}`}
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
        <div className="mt-4" aria-label="AQI scale from 0 to 500+">
          <div className="h-2 rounded-full overflow-hidden flex w-full" aria-hidden="true">
            <div className="bg-emerald-500 h-full flex-1" title="0-50 Good" />
            <div className="bg-green-500 h-full flex-1" title="51-100 Satisfactory" />
            <div className="bg-amber-500 h-full flex-1" title="101-200 Moderate" />
            <div className="bg-orange-500 h-full flex-1" title="201-300 Poor" />
            <div className="bg-rose-500 h-full flex-1" title="301-400 Very Poor" />
            <div className="bg-red-800 h-full flex-1" title="401-500 Severe" />
          </div>
          <div
            className="flex justify-between text-[10px] text-slate-400 font-mono mt-1"
            aria-hidden="true"
          >
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
  );
};

import React from 'react';
import { HourlyAQI } from '@/types';
import { getAQIColor } from '@/lib/aqiCalculator';
import { Clock } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyAQI[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  return (
    <section
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl"
      aria-label="24-Hour Smog Inversion Profile"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <span>24-Hour Smog Inversion Profile & Ventilation Windows</span>
          </h3>
          <p className="text-xs text-slate-400">
            Smog peaks during morning and late evening thermal inversions. Green badges highlight
            safer atmospheric mixing windows.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs" aria-hidden="true">
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
      <div
        className="flex space-x-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar"
        role="region"
        aria-label="Hourly timeline"
        tabIndex={0}
      >
        {hourly.map((hour, idx) => {
          const hColor = getAQIColor(hour.category);
          const formattedTime = hour.time.includes('T')
            ? hour.time.split('T')[1].substring(0, 5)
            : hour.time;
          return (
            <div
              key={idx}
              className={`min-w-[100px] flex-shrink-0 rounded-xl p-3 border text-center transition-all ${
                hour.isVentilationSafe
                  ? 'bg-emerald-950/40 border-emerald-600/60 ring-1 ring-emerald-500/40'
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}
              aria-label={`Time: ${formattedTime}, AQI: ${hour.aqi}, PM2.5: ${hour.pm25}, Status: ${hour.category}${
                hour.isVentilationSafe ? ', Safe to ventilate' : ''
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-400 font-mono">
                {formattedTime}
              </div>
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
    </section>
  );
};

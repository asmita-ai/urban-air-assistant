import React from 'react';
import { PollutantValues } from '@/types';
import { CPCB_SAFE_LIMITS } from '@/lib/constants';
import { Layers } from 'lucide-react';

interface PollutantsGridProps {
  pollutants: PollutantValues;
}

export const PollutantsGrid: React.FC<PollutantsGridProps> = ({ pollutants }) => {
  const pollutantDetails = [
    {
      key: 'pm25',
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter (< 2.5 µm)',
      val: pollutants.pm25,
      unit: 'µg/m³',
      safeLimit: CPCB_SAFE_LIMITS.PM25,
      cpcbStandard: `${CPCB_SAFE_LIMITS.PM25} µg/m³`,
      description: 'Penetrates deep into lung alveoli and enters bloodstream.',
    },
    {
      key: 'pm10',
      name: 'PM10',
      fullName: 'Respirable Particulate Matter (< 10 µm)',
      val: pollutants.pm10,
      unit: 'µg/m³',
      safeLimit: CPCB_SAFE_LIMITS.PM10,
      cpcbStandard: `${CPCB_SAFE_LIMITS.PM10} µg/m³`,
      description: 'Dust, smoke, and pollen causing upper respiratory irritation.',
    },
    {
      key: 'no2',
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      val: pollutants.no2,
      unit: 'µg/m³',
      safeLimit: CPCB_SAFE_LIMITS.NO2,
      cpcbStandard: `${CPCB_SAFE_LIMITS.NO2} µg/m³`,
      description: 'High-temperature diesel combustion; triggers acute asthma.',
    },
    {
      key: 'so2',
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      val: pollutants.so2,
      unit: 'µg/m³',
      safeLimit: CPCB_SAFE_LIMITS.SO2,
      cpcbStandard: `${CPCB_SAFE_LIMITS.SO2} µg/m³`,
      description: 'Industrial and coal emissions; throat constrictor.',
    },
    {
      key: 'co',
      name: 'CO',
      fullName: 'Carbon Monoxide',
      val: pollutants.co,
      unit: 'mg/m³',
      safeLimit: CPCB_SAFE_LIMITS.CO,
      cpcbStandard: `${CPCB_SAFE_LIMITS.CO} mg/m³`,
      description: 'Incomplete vehicular combustion; reduces blood oxygenation.',
    },
    {
      key: 'o3',
      name: 'O₃',
      fullName: 'Tropospheric Ozone',
      val: pollutants.o3,
      unit: 'µg/m³',
      safeLimit: CPCB_SAFE_LIMITS.O3,
      cpcbStandard: `${CPCB_SAFE_LIMITS.O3} µg/m³`,
      description: 'Secondary photochemical smog formed with sunlight.',
    },
  ];

  return (
    <section
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl"
      aria-label="Full Chemical Pollutants Spectrum"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-400" aria-hidden="true" />
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
              role="article"
              aria-label={`${p.name}: ${p.val} ${p.unit}, safe limit is ${p.cpcbStandard}`}
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
                <div
                  className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={p.val}
                  aria-valuemin={0}
                  aria-valuemax={p.safeLimit * 2.5}
                  aria-label={`${p.name} concentration progress`}
                >
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
    </section>
  );
};

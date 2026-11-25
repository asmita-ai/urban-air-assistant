import React from 'react';
import { AQIData } from '@/types';
import { Clock, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherBannerProps {
  data: AQIData;
}

export const WeatherBanner: React.FC<WeatherBannerProps> = ({ data }) => {
  return (
    <header
      role="banner"
      aria-label={`Real-time air quality banner for ${data.city}`}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" aria-hidden="true" />
          <span>Verified Ground-Truth Station Feed</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
          <span>Air Quality in {data.city}</span>
        </h2>
        <p className="text-xs text-slate-400 flex items-center space-x-2 mt-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>Observed at: {data.timestamp}</span>
          <span>•</span>
          <span className="text-slate-300 font-medium">Source: {data.source}</span>
        </p>
      </div>

      {/* Atmospheric Winter Inversion Indicator */}
      <div
        className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center space-x-4 w-full md:w-auto"
        role="region"
        aria-label="Meteorological conditions"
      >
        <div className="text-center">
          <div className="flex items-center justify-center text-slate-400 text-[11px] space-x-1">
            <Thermometer className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
            <span>Temp</span>
          </div>
          <span className="text-sm font-bold text-slate-100">{data.temperature}°C</span>
        </div>
        <div className="h-7 w-[1px] bg-slate-700" aria-hidden="true" />
        <div className="text-center">
          <div className="flex items-center justify-center text-slate-400 text-[11px] space-x-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span>Humidity</span>
          </div>
          <span className="text-sm font-bold text-slate-100">{data.humidity}%</span>
        </div>
        <div className="h-7 w-[1px] bg-slate-700" aria-hidden="true" />
        <div className="text-center">
          <div className="flex items-center justify-center text-slate-400 text-[11px] space-x-1">
            <Wind className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
            <span>Wind</span>
          </div>
          <span className="text-sm font-bold text-slate-100">{data.windSpeed} km/h</span>
        </div>
      </div>
    </header>
  );
};

'use client';

import React from 'react';
import { AQIData } from '@/types';
import {
  WeatherBanner,
  AQIGauge,
  HealthAdvisoryCards,
  HourlyForecast,
  PollutantsGrid,
} from './dashboard';

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
  return (
    <div className="space-y-6" role="main" aria-label={`Air quality dashboard for ${data.city}`}>
      {/* Real-time Observation Banner */}
      <WeatherBanner data={data} />

      {/* Main Hero: AQI Gauge & Health Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <AQIGauge data={data} />
        </div>
        <div className="lg:col-span-7">
          <HealthAdvisoryCards
            data={data}
            onExploreRoutines={onExploreRoutines}
            onExploreIAQ={onExploreIAQ}
          />
        </div>
      </div>

      {/* 24-Hour Smog Inversion Profile & Safe Windows */}
      <HourlyForecast hourly={data.hourly} />

      {/* 6-Pollutants Spectrum Benchmark */}
      <PollutantsGrid pollutants={data.pollutants} />
    </div>
  );
};

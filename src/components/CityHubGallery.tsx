'use client';

import React, { useState, useEffect } from 'react';
import { INDIAN_CITIES, CityPreset } from '@/lib/cities';
import {
  Compass,
  MapPin,
  RefreshCw,
  Play,
  Pause,
  Grid,
  List,
  Clock,
  Sparkles,
  Radio,
  SlidersHorizontal,
  Navigation
} from 'lucide-react';

interface CityHubGalleryProps {
  currentCity: string;
  onSelectCity: (city: string, lat?: number, lon?: number) => void;
  onForceRefresh: () => void;
  isLoading: boolean;
}

export const CityHubGallery: React.FC<CityHubGalleryProps> = ({
  currentCity,
  onSelectCity,
  onForceRefresh,
  isLoading,
}) => {
  // Telemetry ticker state
  const [packetCount, setPacketCount] = useState<number>(142);
  const [liveClock, setLiveClock] = useState<string>('');
  const [viewMode, setViewMode] = useState<'photos' | 'chips'>('photos');
  const [isAutoTourActive, setIsAutoTourActive] = useState<boolean>(false);
  const [tourCountdown, setTourCountdown] = useState<number>(5);
  const [filterRegion, setFilterRegion] = useState<'all' | 'smog' | 'metro'>('all');
  const [geoLocating, setGeoLocating] = useState<boolean>(false);

  // Ticking packet & live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketCount((prev) => prev + 1);
      const now = new Date();
      setLiveClock(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 5-second Auto-Tour between major Indian hubs
  useEffect(() => {
    if (!isAutoTourActive) return;

    const interval = setInterval(() => {
      setTourCountdown((prev) => {
        if (prev <= 1) {
          // Advance to next city
          const currentIndex = INDIAN_CITIES.findIndex((c) => c.name === currentCity);
          const nextIndex = (currentIndex + 1) % INDIAN_CITIES.length;
          const nextCity = INDIAN_CITIES[nextIndex];
          onSelectCity(nextCity.name, nextCity.lat, nextCity.lon);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoTourActive, currentCity, onSelectCity]);

  // Geolocation handler
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        onSelectCity('My Local Station (GPS)', pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setGeoLocating(false);
        alert('Could not retrieve GPS coordinates. Defaulting to Delhi NCR.');
      },
      { timeout: 8000 }
    );
  };

  const filteredCities = INDIAN_CITIES.filter((c) => {
    if (filterRegion === 'smog') return c.typicalWinterAQI >= 250;
    if (filterRegion === 'metro') return ['Delhi NCR (Central)', 'Mumbai (BKC)', 'Bengaluru (Koramangala)', 'Kolkata (Ballygunge)', 'Chennai (Central)', 'Hyderabad (Hitec City)'].includes(c.name);
    return true;
  });

  const nextCityIndex = (INDIAN_CITIES.findIndex((c) => c.name === currentCity) + 1) % INDIAN_CITIES.length;
  const nextCityName = INDIAN_CITIES[nextCityIndex]?.name.split(' ')[0] || 'Next';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-4 sm:p-5">
      {/* Top Command Telemetry Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Left Status: Auto-refresh & packet counter */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-300">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>1s LIVE AUTO-REFRESH (#{packetCount})</span>
          </span>

          <span className="hidden sm:inline text-slate-600">•</span>

          <span className="text-slate-400 flex items-center space-x-1 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{liveClock || 'Live Syncing'}</span>
          </span>

          <span className="hidden sm:inline text-slate-600">•</span>

          <span className="text-slate-400 text-[11px]">
            Telemetry: <span className="text-white font-mono">1000ms tick</span> • Station: <span className="text-teal-300 font-semibold">{currentCity.split(' ')[0]}</span>
          </span>
        </div>

        {/* Right Controls: Auto-tour, Force Sync, and Location */}
        <div className="flex items-center space-x-2 self-end md:self-auto w-full md:w-auto justify-end">
          {/* Auto Tour Toggle */}
          <button
            onClick={() => {
              setIsAutoTourActive(!isAutoTourActive);
              setTourCountdown(5);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isAutoTourActive
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Auto-tour across Indian smog monitoring stations"
          >
            {isAutoTourActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoTourActive ? `Touring (${tourCountdown}s) → ${nextCityName}` : 'Auto-Tour'}</span>
          </button>

          {/* Force Sync Button */}
          <button
            onClick={onForceRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-50"
            title="Force immediate sensor sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Force Sync</span>
          </button>

          {/* GPS Location Button */}
          <button
            onClick={handleUseLocation}
            disabled={geoLocating}
            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-teal-500/20"
          >
            <Navigation className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
            <span>{geoLocating ? 'Locating...' : 'Use My GPS'}</span>
          </button>
        </div>
      </div>

      {/* Gallery Header and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
            <Radio className="w-4 h-4 text-teal-400" />
            <span>Indian Smog & Air Monitoring Hubs ({INDIAN_CITIES.length} Stations)</span>
            <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">
              Ground-Truth CPCB
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Click any urban hub to instantly switch live telemetric feed, winter inversion factors, and tailored family protocols.
          </p>
        </div>

        {/* Filter Pills & View Mode */}
        <div className="flex items-center space-x-2">
          {/* Filter Pills */}
          <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 flex text-xs">
            <button
              onClick={() => setFilterRegion('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterRegion === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Hubs
            </button>
            <button
              onClick={() => setFilterRegion('smog')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterRegion === 'smog' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Smog (250+)
            </button>
            <button
              onClick={() => setFilterRegion('metro')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterRegion === 'metro' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Megacities
            </button>
          </div>

          {/* Grid vs Chips Toggle */}
          <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 flex text-xs">
            <button
              onClick={() => setViewMode('photos')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'photos' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Motion Photo Cards"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('chips')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'chips' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Compact Chips View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Photo Cards Grid */}
      {viewMode === 'photos' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {filteredCities.map((city) => {
            const isSelected = currentCity === city.name;
            return (
              <div
                key={city.name}
                onClick={() => onSelectCity(city.name, city.lat, city.lon)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border text-left ${
                  isSelected
                    ? 'ring-2 ring-teal-400 border-teal-400 scale-[1.02] shadow-lg shadow-teal-500/20'
                    : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                }`}
              >
                {/* Background Image with Dark Gradient */}
                <div className="h-28 sm:h-32 w-full overflow-hidden relative">
                  <img
                    src={city.imageUrl}
                    alt={city.landmark}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-teal-300 backdrop-blur-sm border border-slate-700/60 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span>LIVE</span>
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-sm">
                        ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* City & Landmark Text Info */}
                <div className="p-2.5 bg-slate-950 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xs font-bold text-white truncate max-w-[110px]">
                      {city.name.split(' ')[0]}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      AQI ~{city.typicalWinterAQI}
                    </span>
                  </div>
                  <div className="text-[10px] text-teal-400 truncate mt-0.5 font-medium">
                    {city.landmark}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">
                    {city.state}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Chips View */
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredCities.map((city) => {
            const isSelected = currentCity === city.name;
            return (
              <button
                key={city.name}
                onClick={() => onSelectCity(city.name, city.lat, city.lon)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{city.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900' : 'text-teal-400'}`}>
                  {city.landmark}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

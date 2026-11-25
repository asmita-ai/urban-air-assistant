'use client';

import React, { useState } from 'react';
import {
  Wind,
  Home,
  Calendar,
  Activity,
  MessageSquare,
  ChevronDown,
  MapPin,
  Search,
  RefreshCw,
} from 'lucide-react';
import { AQIData } from '@/types';
import { INDIAN_CITIES } from '@/lib/cities';
import { getAQIColor } from '@/lib/aqiCalculator';

interface NavbarProps {
  currentCity: string;
  onSelectCity: (city: string, lat?: number, lon?: number) => void;
  aqiData: AQIData | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  aqiData,
  activeTab,
  setActiveTab,
  isLoading = false,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; state: string; lat: number; lon: number }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const aqiColors = aqiData ? getAQIColor(aqiData.category) : null;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Live Smog Monitor', icon: Wind },
    { id: 'routine', label: 'Low-Emission Planner', icon: Calendar },
    { id: 'iaq', label: 'Indoor Air Lab', icon: Home },
    { id: 'impact', label: 'Impact & Actions', icon: Activity },
    { id: 'copilot', label: 'Vayu AI Copilot', icon: MessageSquare, badge: 'GenAI' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20">
              <Wind className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Vayu<span className="text-teal-400">Mitra</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  GenAI Smog Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Winter Smog Navigation & Sustainable Action Engine
              </p>
            </div>
          </div>

          {/* City Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              aria-label="Select City"
              aria-expanded={isCityDropdownOpen}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" aria-hidden="true" />
              ) : (
                <MapPin className="w-4 h-4 text-teal-400" aria-hidden="true" />
              )}
              <span className="font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                {currentCity}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search any Indian city..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    autoFocus
                  />
                </div>

                {isSearching && (
                  <div className="text-center py-2 text-xs text-slate-400">
                    Searching coordinates...
                  </div>
                )}

                {searchResults.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    <p className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Search Results
                    </p>
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onSelectCity(
                            `${res.name}${res.state ? `, ${res.state}` : ''}`,
                            res.lat,
                            res.lon
                          );
                          setIsCityDropdownOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">
                          {res.name}, {res.state}
                        </span>
                        <span className="text-[10px] text-teal-400 ml-2">Live</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Top Smog Hotspots
                    </p>
                    <div className="max-h-52 overflow-y-auto space-y-1">
                      {INDIAN_CITIES.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            onSelectCity(city.name, city.lat, city.lon);
                            setIsCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                            currentCity === city.name
                              ? 'bg-teal-500/20 text-teal-300 font-semibold'
                              : 'hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <span>{city.name}</span>
                          <span className="text-[10px] text-slate-400">{city.state}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick AQI Status Banner */}
          {aqiData && aqiColors && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700">
              <span className={`w-2.5 h-2.5 rounded-full ${aqiColors.accent} animate-pulse`} />
              <span className="text-xs text-slate-400">AQI</span>
              <span className="text-sm font-bold text-white">{aqiData.aqi}</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${aqiColors.hex}25`, color: aqiColors.hex }}
              >
                {aqiData.category}
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar"
          aria-label="Main Navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-slate-950 text-teal-400' : 'bg-teal-500/20 text-teal-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

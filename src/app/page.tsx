'use client';

import React, { useState, useEffect } from 'react';
import { HouseholdProfile } from '@/types';
import { useAQI, useHousehold, usePlanAndAudit } from '@/hooks';
import { Navbar } from '@/components/Navbar';
import { AQIDashboard } from '@/components/AQIDashboard';
import { CityHubGallery } from '@/components/CityHubGallery';
import { HouseholdConfig } from '@/components/HouseholdConfig';
import { RoutinePlanner } from '@/components/RoutinePlanner';
import { IAQLab } from '@/components/IAQLab';
import { ImpactTracker } from '@/components/ImpactTracker';
import { AICopilot } from '@/components/AICopilot';
import { Sliders, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const {
    currentCity,
    aqiData,
    isLoading: isLoadingAQI,
    loadAQIData,
  } = useAQI('Delhi NCR (Central)');
  const { profile, updateProfile, isConfigOpen, toggleConfig } = useHousehold();
  const { plan, audit, isLoadingPlan, isLoadingAudit, fetchPlan, syncPlanAndAudit } =
    usePlanAndAudit();

  // Synchronize AI recommendations on initial AQI load
  useEffect(() => {
    if (aqiData) {
      syncPlanAndAudit(aqiData, profile);
    }
  }, [aqiData?.city, aqiData?.aqi]); // Re-sync when city or AQI changes

  const handleUpdateProfile = (newProfile: HouseholdProfile) => {
    updateProfile(newProfile);
    if (aqiData) {
      syncPlanAndAudit(aqiData, newProfile);
    }
  };

  const handleSelectCity = async (city: string, lat?: number, lon?: number) => {
    const freshData = await loadAQIData(city, lat, lon);
    if (freshData) {
      const updatedProfile = { ...profile, city: freshData.city };
      updateProfile(updatedProfile);
      syncPlanAndAudit(freshData, updatedProfile);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
        aqiData={aqiData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Collapsible Household Personalization Strip */}
        <section
          aria-label="Household Configuration"
          className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
        >
          <div
            onClick={toggleConfig}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleConfig();
              }
            }}
            aria-expanded={isConfigOpen}
            aria-label="Toggle household personalization settings"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">Active Household Context</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-teal-300">
                    {profile.familyMembers.length} Members (
                    {profile.familyMembers.some((m) => m.hasRespiratoryIssue)
                      ? 'Asthma Alert'
                      : 'Standard'}
                    )
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Commute: {profile.commuteMode} ({profile.commuteDistanceKm} km) • Purifier:{' '}
                  {profile.hasAirPurifier ? 'Yes' : 'No'} • Plants: {profile.indoorPlantsCount}
                </p>
              </div>
            </div>

            <div className="text-xs text-teal-400 font-semibold flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-800">
              <span>{isConfigOpen ? 'Hide Profile' : 'Customize Profile'}</span>
              {isConfigOpen ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </div>
          </div>

          {isConfigOpen && aqiData && (
            <div className="p-4 pt-0 border-t border-slate-800/80">
              <HouseholdConfig
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                currentAQI={aqiData.aqi}
              />
            </div>
          )}
        </section>

        {/* Dynamic View Router */}
        {isLoadingAQI && !aqiData ? (
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center shadow-xl space-y-4"
            role="status"
            aria-live="polite"
          >
            <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">
              Fetching Live Air Quality & Smog Sensors...
            </h3>
            <p className="text-xs text-slate-400">
              Connecting to Open-Meteo & CPCB sensor calibration feeds for {currentCity}...
            </p>
          </div>
        ) : aqiData ? (
          <>
            {activeTab === 'dashboard' && (
              <>
                <CityHubGallery
                  currentCity={currentCity}
                  onSelectCity={handleSelectCity}
                  onForceRefresh={() => loadAQIData(currentCity)}
                  isLoading={isLoadingAQI}
                />
                <AQIDashboard
                  data={aqiData}
                  onExploreRoutines={() => setActiveTab('routine')}
                  onExploreIAQ={() => setActiveTab('iaq')}
                />
              </>
            )}

            {activeTab === 'routine' && (
              <RoutinePlanner
                plan={plan}
                aqiData={aqiData}
                profile={profile}
                isLoading={isLoadingPlan}
                onRefreshPlan={() => fetchPlan(aqiData, profile)}
              />
            )}

            {activeTab === 'iaq' && (
              <IAQLab
                audit={audit}
                aqiData={aqiData}
                profile={profile}
                isLoading={isLoadingAudit}
              />
            )}

            {activeTab === 'impact' && <ImpactTracker aqiData={aqiData} />}

            {activeTab === 'copilot' && <AICopilot aqiData={aqiData} profile={profile} />}
          </>
        ) : null}
      </main>

      {/* Accessible Footer */}
      <footer
        className="bg-slate-950 border-t border-slate-800/80 py-6 text-slate-400 text-xs"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">VayuMitra</span>
            <span>•</span>
            <span>Urban Air Quality & Smog Defense Assistant</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Standards: Indian CPCB & WHO</span>
            <span>•</span>
            <span>Data: Open-Meteo Real-Time API</span>
            <span>•</span>
            <span>AI: Google Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

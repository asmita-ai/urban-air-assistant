'use client';

import React, { useState, useEffect } from 'react';
import { AQIData, HouseholdProfile, RoutinePlan, IAQAuditResult } from '@/types';
import { Navbar } from '@/components/Navbar';
import { AQIDashboard } from '@/components/AQIDashboard';
import { HouseholdConfig } from '@/components/HouseholdConfig';
import { RoutinePlanner } from '@/components/RoutinePlanner';
import { IAQLab } from '@/components/IAQLab';
import { ImpactTracker } from '@/components/ImpactTracker';
import { AICopilot } from '@/components/AICopilot';
import {
  ShieldAlert,
  Wind,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Github,
  Heart
} from 'lucide-react';

const INITIAL_PROFILE: HouseholdProfile = {
  city: 'Delhi NCR (Central)',
  familyMembers: [
    { id: 'm1', name: 'Kabir', type: 'child', hasRespiratoryIssue: false, activityLevel: 'high' },
    { id: 'm2', name: 'Dadi (Savitri)', type: 'senior', hasRespiratoryIssue: true, activityLevel: 'low' },
    { id: 'm3', name: 'Arjun', type: 'adult', hasRespiratoryIssue: false, activityLevel: 'moderate' },
  ],
  commuteMode: 'car',
  commuteDistanceKm: 16,
  hasAirPurifier: true,
  homeType: 'apartment',
  indoorPlantsCount: 4,
};

export default function Home() {
  const [currentCity, setCurrentCity] = useState<string>('Delhi NCR (Central)');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  const [profile, setProfile] = useState<HouseholdProfile>(INITIAL_PROFILE);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [plan, setPlan] = useState<RoutinePlan | null>(null);
  const [audit, setAudit] = useState<IAQAuditResult | null>(null);

  const [isLoadingAQI, setIsLoadingAQI] = useState<boolean>(true);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);

  // Load AQI Data when city changes
  const loadAQIData = async (city: string, lat?: number, lon?: number) => {
    setIsLoadingAQI(true);
    try {
      let url = `/api/aqi?city=${encodeURIComponent(city)}`;
      if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch AQI');
      const data: AQIData = await res.json();
      setAqiData(data);
      setCurrentCity(data.city);
      setProfile((prev) => ({ ...prev, city: data.city }));

      // Trigger automatic routine and audit generation with new context
      fetchPlan(data, { ...profile, city: data.city });
      fetchAudit(data, { ...profile, city: data.city });
    } catch (err) {
      console.error('Error fetching AQI:', err);
    } finally {
      setIsLoadingAQI(false);
    }
  };

  const fetchPlan = async (currentAQI: AQIData, currentProfile: HouseholdProfile) => {
    setIsLoadingPlan(true);
    try {
      const res = await fetch('/api/ai/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData: currentAQI, profile: currentProfile }),
      });
      if (!res.ok) throw new Error('Failed to fetch routine plan');
      const planData: RoutinePlan = await res.json();
      setPlan(planData);
    } catch (err) {
      console.error('Error fetching routine plan:', err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const fetchAudit = async (currentAQI: AQIData, currentProfile: HouseholdProfile) => {
    setIsLoadingAudit(true);
    try {
      const res = await fetch('/api/ai/iaq-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData: currentAQI, profile: currentProfile }),
      });
      if (!res.ok) throw new Error('Failed to fetch IAQ audit');
      const auditData: IAQAuditResult = await res.json();
      setAudit(auditData);
    } catch (err) {
      console.error('Error fetching IAQ audit:', err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  useEffect(() => {
    loadAQIData('Delhi NCR (Central)');
  }, []);

  const handleUpdateProfile = (newProfile: HouseholdProfile) => {
    setProfile(newProfile);
    if (aqiData) {
      fetchPlan(aqiData, newProfile);
      fetchAudit(aqiData, newProfile);
    }
  };

  const handleSelectCity = (city: string, lat?: number, lon?: number) => {
    loadAQIData(city, lat, lon);
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
        isLoading={isLoadingAQI}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Collapsible Household Personalization Strip */}
        <section aria-label="Household Configuration" className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all">
          <div
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">Active Household Context</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-teal-300">
                    {profile.familyMembers.length} Members ({profile.familyMembers.some((m) => m.hasRespiratoryIssue) ? 'Asthma Alert' : 'Standard'})
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Commute: {profile.commuteMode} ({profile.commuteDistanceKm} km) • Purifier: {profile.hasAirPurifier ? 'Yes' : 'No'} • Plants: {profile.indoorPlantsCount}
                </p>
              </div>
            </div>

            <button
              className="text-xs text-teal-400 font-semibold flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-800"
              aria-expanded={isConfigOpen}
              aria-label="Toggle household settings"
            >
              <span>{isConfigOpen ? 'Hide Profile' : 'Customize Profile'}</span>
              {isConfigOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">Fetching Live Air Quality & Smog Sensors...</h3>
            <p className="text-xs text-slate-400">Connecting to Open-Meteo & CPCB sensor calibration feeds for {currentCity}...</p>
          </div>
        ) : aqiData ? (
          <>
            {activeTab === 'dashboard' && (
              <AQIDashboard
                data={aqiData}
                onExploreRoutines={() => setActiveTab('routine')}
                onExploreIAQ={() => setActiveTab('iaq')}
              />
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

            {activeTab === 'impact' && (
              <ImpactTracker
                aqiData={aqiData}
              />
            )}

            {activeTab === 'copilot' && (
              <AICopilot
                aqiData={aqiData}
                profile={profile}
              />
            )}
          </>
        ) : null}
      </main>

      {/* Accessible Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-slate-400 text-xs">
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

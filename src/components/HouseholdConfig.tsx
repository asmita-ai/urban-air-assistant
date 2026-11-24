'use client';

import React, { useState } from 'react';
import { HouseholdProfile, HouseholdMember } from '@/types';
import { calculateHouseholdVulnerability } from '@/lib/aqiCalculator';
import {
  Users,
  Plus,
  Trash2,
  HeartPulse,
  Car,
  Home,
  Shield,
  Leaf,
  Sliders,
  Check,
  Baby,
  UserCheck
} from 'lucide-react';

interface HouseholdConfigProps {
  profile: HouseholdProfile;
  onUpdateProfile: (updated: HouseholdProfile) => void;
  currentAQI: number;
}

export const HouseholdConfig: React.FC<HouseholdConfigProps> = ({
  profile,
  onUpdateProfile,
  currentAQI,
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberType, setNewMemberType] = useState<HouseholdMember['type']>('child');
  const [newMemberResp, setNewMemberResp] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const vulnerabilityScore = calculateHouseholdVulnerability(profile, currentAQI);

  const getVulnerabilityColor = (score: number) => {
    if (score < 40) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', label: 'Low Risk' };
    if (score < 70) return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'Moderate Vulnerability' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30', label: 'High / Critical Vulnerability' };
  };

  const vColor = getVulnerabilityColor(vulnerabilityScore);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: HouseholdMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      type: newMemberType,
      hasRespiratoryIssue: newMemberResp,
      activityLevel: 'moderate',
    };

    onUpdateProfile({
      ...profile,
      familyMembers: [...profile.familyMembers, newMember],
    });

    setNewMemberName('');
    setNewMemberResp(false);
    setIsAdding(false);
  };

  const handleRemoveMember = (id: string) => {
    if (profile.familyMembers.length <= 1) return;
    onUpdateProfile({
      ...profile,
      familyMembers: profile.familyMembers.filter((m) => m.id !== id),
    });
  };

  const commuteOptions: Array<{ id: HouseholdProfile['commuteMode']; label: string; icon: string }> = [
    { id: 'metro', label: 'Metro Transit', icon: '🚇' },
    { id: 'bus', label: 'Electric / CNG Bus', icon: '🚌' },
    { id: 'car', label: 'Private Car', icon: '🚗' },
    { id: 'two-wheeler', label: 'Two-Wheeler (Bike/Scooter)', icon: '🛵' },
    { id: 'walk-cycle', label: 'Walk / Cycle', icon: '🚲' },
    { id: 'wfh', label: 'Remote (WFH)', icon: '💻' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header and Vulnerability Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
            <Sliders className="w-4 h-4" />
            <span>Household Personalization Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white">Your Family & Lifestyle Context</h3>
          <p className="text-xs text-slate-400">
            Recommendations adapt directly to who lives with you, daily commute, and home defense measures.
          </p>
        </div>

        {/* Vulnerability Score Card */}
        <div className={`p-3 rounded-xl border flex items-center space-x-3 ${vColor.bg} ${vColor.border}`}>
          <div className="text-center">
            <span className={`text-2xl font-black ${vColor.text}`}>{vulnerabilityScore}</span>
            <span className="text-[10px] block text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <span className={`text-xs font-bold block ${vColor.text}`}>{vColor.label}</span>
            <span className="text-[10px] text-slate-400">Household Vulnerability Index</span>
          </div>
        </div>
      </div>

      {/* Grid: Family Members & Commute Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Members Manager */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Family Members ({profile.familyMembers.length})</span>
            </h4>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            )}
          </div>

          {/* Member List */}
          <div className="space-y-2">
            {profile.familyMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-teal-300 text-sm font-bold">
                    {member.type === 'child' ? <Baby className="w-4 h-4" /> : (member.type === 'senior' ? <UserCheck className="w-4 h-4" /> : <Users className="w-4 h-4" />)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{member.name}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                        {member.type}
                      </span>
                    </div>
                    {member.hasRespiratoryIssue && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-rose-400 mt-0.5">
                        <HeartPulse className="w-3 h-3" />
                        <span>Asthma / Respiratory Sensitivity</span>
                      </span>
                    )}
                  </div>
                </div>

                {profile.familyMembers.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors rounded-lg hover:bg-slate-700/50"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Member Form */}
          {isAdding && (
            <form onSubmit={handleAddMember} className="bg-slate-800 border border-teal-500/40 rounded-xl p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Name (e.g. Aarav, Dadi)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  required
                />
                <select
                  value={newMemberType}
                  onChange={(e) => setNewMemberType(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="child">Child / Toddler (≤10)</option>
                  <option value="senior">Senior Citizen (60+)</option>
                  <option value="adult">Working Adult</option>
                  <option value="infant">Infant / Newborn</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="respCheck"
                  checked={newMemberResp}
                  onChange={(e) => setNewMemberResp(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 bg-slate-900"
                />
                <label htmlFor="respCheck" className="text-xs text-slate-300">
                  Has Asthma, Bronchitis, or Cardiac Condition
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-1 rounded-lg"
                >
                  Save Member
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Commute & Home Environment */}
        <div className="space-y-4">
          {/* Commute Mode Selector */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2 mb-2">
              <Car className="w-4 h-4 text-teal-400" />
              <span>Primary Commute Mode</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {commuteOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateProfile({ ...profile, commuteMode: opt.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    profile.commuteMode === opt.id
                      ? 'bg-teal-500/20 border-teal-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80'
                  }`}
                >
                  <div className="text-base mb-1">{opt.icon}</div>
                  <div className="text-xs">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Commute Distance Slider */}
          {profile.commuteMode !== 'wfh' && (
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>One-Way Commute Distance:</span>
                <span className="font-bold text-teal-400">{profile.commuteDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={profile.commuteDistanceKm}
                onChange={(e) => onUpdateProfile({ ...profile, commuteDistanceKm: Number(e.target.value) })}
                className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>1 km (Local)</span>
                <span>25 km (Cross-City)</span>
                <span>50 km (NCR Transit)</span>
              </div>
            </div>
          )}

          {/* Home Defense Settings */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Air Purifier Toggle */}
            <div
              onClick={() => onUpdateProfile({ ...profile, hasAirPurifier: !profile.hasAirPurifier })}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                profile.hasAirPurifier
                  ? 'bg-teal-500/20 border-teal-500/60'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Shield className={`w-4 h-4 ${profile.hasAirPurifier ? 'text-teal-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold text-white">HEPA Air Purifier</div>
                  <div className="text-[10px] text-slate-400">{profile.hasAirPurifier ? 'Active at Home' : 'None installed'}</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                profile.hasAirPurifier ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-slate-600'
              }`}>
                {profile.hasAirPurifier && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Indoor Plants Counter */}
            <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Indoor Air Plants</div>
                  <div className="text-[10px] text-slate-400">Snake / Areca / Pothos</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateProfile({ ...profile, indoorPlantsCount: Math.max(0, profile.indoorPlantsCount - 1) })}
                  className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs font-bold text-teal-300 w-4 text-center">{profile.indoorPlantsCount}</span>
                <button
                  onClick={() => onUpdateProfile({ ...profile, indoorPlantsCount: profile.indoorPlantsCount + 1 })}
                  className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

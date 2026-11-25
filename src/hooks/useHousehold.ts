import { useState } from 'react';
import { HouseholdProfile } from '@/types';

export const DEFAULT_HOUSEHOLD: HouseholdProfile = {
  city: 'Delhi NCR (Central)',
  familyMembers: [
    { id: 'm1', name: 'Kabir', type: 'child', hasRespiratoryIssue: false, activityLevel: 'high' },
    {
      id: 'm2',
      name: 'Dadi (Savitri)',
      type: 'senior',
      hasRespiratoryIssue: true,
      activityLevel: 'low',
    },
    {
      id: 'm3',
      name: 'Arjun',
      type: 'adult',
      hasRespiratoryIssue: false,
      activityLevel: 'moderate',
    },
  ],
  commuteMode: 'car',
  commuteDistanceKm: 16,
  hasAirPurifier: true,
  homeType: 'apartment',
  indoorPlantsCount: 4,
};

export function useHousehold(initialProfile: HouseholdProfile = DEFAULT_HOUSEHOLD) {
  const [profile, setProfile] = useState<HouseholdProfile>(initialProfile);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  const updateProfile = (updated: HouseholdProfile) => {
    setProfile(updated);
  };

  const toggleConfig = () => {
    setIsConfigOpen((prev) => !prev);
  };

  return {
    profile,
    setProfile,
    updateProfile,
    isConfigOpen,
    setIsConfigOpen,
    toggleConfig,
  };
}

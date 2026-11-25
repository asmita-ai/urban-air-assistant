import { describe, it, expect } from 'vitest';
import {
  computeIndianAQI,
  getAQICategory,
  getHealthAdvisory,
  calculateHouseholdVulnerability,
  calculateCommuteImpact,
} from '../lib/aqiCalculator';
import { HouseholdProfile } from '../types';

describe('AQI Calculation Engine', () => {
  it('correctly categorizes AQI levels based on CPCB standards', () => {
    expect(getAQICategory(35)).toBe('Good');
    expect(getAQICategory(75)).toBe('Satisfactory');
    expect(getAQICategory(150)).toBe('Moderate');
    expect(getAQICategory(250)).toBe('Poor');
    expect(getAQICategory(350)).toBe('Very Poor');
    expect(getAQICategory(450)).toBe('Severe');
    expect(getAQICategory(550)).toBe('Hazardous');
  });

  it('computes Indian AQI from PM2.5 and PM10 sub-indices', () => {
    // 25 ug/m3 PM2.5 is Good (0-50)
    const resultGood = computeIndianAQI({
      pm25: 25,
      pm10: 40,
      no2: 20,
      so2: 10,
      co: 0.5,
      o3: 30,
    });
    expect(resultGood.category).toBe('Good');
    expect(resultGood.aqi).toBeLessThanOrEqual(50);

    // Severe PM2.5 (300 ug/m3)
    const resultSevere = computeIndianAQI({
      pm25: 300,
      pm10: 450,
      no2: 80,
      so2: 20,
      co: 2.5,
      o3: 40,
    });
    expect(resultSevere.category).toBe('Severe');
    expect(resultSevere.aqi).toBeGreaterThanOrEqual(400);
  });

  it('provides tailored health advisories for children and seniors', () => {
    const advisoryGood = getHealthAdvisory(40);
    expect(advisoryGood.children).toContain('Safe for all outdoor games');
    expect(advisoryGood.seniors).toContain('regular morning walks');

    const advisorySevere = getHealthAdvisory(420);
    expect(advisorySevere.children).toContain('Close schools');
    expect(advisorySevere.seniors).toContain('indoor stay');
  });

  it('calculates household vulnerability score accounting for infants and asthmatics', () => {
    const vulnerableProfile: HouseholdProfile = {
      city: 'Delhi',
      familyMembers: [
        {
          id: '1',
          name: 'Grandmother',
          type: 'senior',
          hasRespiratoryIssue: true,
          activityLevel: 'low',
        },
        {
          id: '2',
          name: 'Toddler',
          type: 'infant',
          hasRespiratoryIssue: false,
          activityLevel: 'low',
        },
      ],
      commuteMode: 'two-wheeler',
      commuteDistanceKm: 15,
      hasAirPurifier: false,
      homeType: 'apartment',
      indoorPlantsCount: 0,
    };

    const protectedProfile: HouseholdProfile = {
      city: 'Delhi',
      familyMembers: [
        {
          id: '1',
          name: 'Adult',
          type: 'adult',
          hasRespiratoryIssue: false,
          activityLevel: 'moderate',
        },
      ],
      commuteMode: 'wfh',
      commuteDistanceKm: 0,
      hasAirPurifier: true,
      homeType: 'apartment',
      indoorPlantsCount: 6,
    };

    const severeAQI = 380;
    const scoreVulnerable = calculateHouseholdVulnerability(vulnerableProfile, severeAQI);
    const scoreProtected = calculateHouseholdVulnerability(protectedProfile, severeAQI);

    expect(scoreVulnerable).toBeGreaterThan(scoreProtected);
    expect(scoreVulnerable).toBeGreaterThan(70);
  });

  it('calculates commute emissions and metro savings accurately', () => {
    const impact = calculateCommuteImpact(15, 'car');
    expect(impact.dailyCarEmissions.co2Kg).toBeGreaterThan(4);
    expect(impact.metroSavings.co2KgSaved).toBeGreaterThan(3.5);
    expect(impact.metroSavings.exposureReductionPct).toBe(75);
  });
});

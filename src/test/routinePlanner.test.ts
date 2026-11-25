import { describe, it, expect } from 'vitest';
import { generateRoutinePlan, generateIAQAudit } from '../lib/gemini';
import { AQIData, HouseholdProfile } from '../types';

describe('GenAI Routine Planner and IAQ Engine', () => {
  const mockAQIData: AQIData = {
    city: 'Delhi NCR (Central)',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    aqi: 385,
    category: 'Very Poor',
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 240,
      pm10: 380,
      no2: 65,
      so2: 22,
      co: 1.8,
      o3: 45,
    },
    hourly: [
      { time: '08:00', hour: 8, aqi: 410, pm25: 260, category: 'Severe', isVentilationSafe: false },
      { time: '14:00', hour: 14, aqi: 240, pm25: 140, category: 'Poor', isVentilationSafe: true },
      {
        time: '20:00',
        hour: 20,
        aqi: 390,
        pm25: 250,
        category: 'Very Poor',
        isVentilationSafe: false,
      },
    ],
    temperature: 19.5,
    humidity: 62,
    windSpeed: 4.5,
    source: 'Open-Meteo & CPCB Ground Calibration',
    timestamp: '24 Nov 2026, 12:00 PM',
    healthAdvisory: 'Very Poor: High respiratory risk on prolonged exposure.',
    vulnerabilityAlerts: {
      children: 'Zero outdoor play. Shut classroom windows.',
      seniors: 'Complete indoor confinement recommended.',
      respiratory: 'Severe emergency risk. Double check medication supply.',
      outdoorWorkers: 'Wear fit-tested N95 masks.',
    },
  };

  const mockProfile: HouseholdProfile = {
    city: 'Delhi NCR (Central)',
    familyMembers: [
      { id: '1', name: 'Kabir', type: 'child', hasRespiratoryIssue: false, activityLevel: 'high' },
      { id: '2', name: 'Dadi', type: 'senior', hasRespiratoryIssue: true, activityLevel: 'low' },
      {
        id: '3',
        name: 'Arjun',
        type: 'adult',
        hasRespiratoryIssue: false,
        activityLevel: 'moderate',
      },
    ],
    commuteMode: 'car',
    commuteDistanceKm: 18,
    hasAirPurifier: true,
    homeType: 'apartment',
    indoorPlantsCount: 4,
  };

  it('generates a tailored routine plan accounting for vulnerable family members', async () => {
    const plan = await generateRoutinePlan(mockAQIData, mockProfile);

    expect(plan).toBeDefined();
    expect(plan.headline).toContain('Smog Alert');
    expect(plan.items.length).toBeGreaterThanOrEqual(3);

    // Verify morning item protects asthmatic senior
    const morningItem = plan.items.find((i) => i.timeSlot.includes('Morning'));
    expect(morningItem).toBeDefined();
    expect(morningItem?.exposureRisk).toBe('Severe');

    // Verify emission savings are quantified
    expect(plan.totalPotentialCO2SavingsKg).toBeGreaterThan(0);
    expect(plan.totalPotentialPMSavingsGrams).toBeGreaterThan(0);

    // Verify trip combining advice is included
    expect(plan.tripCombiningAdvice).toContain('errands');
  });

  it('generates indoor air quality audit with optimal ventilation windows and CADR', async () => {
    const audit = await generateIAQAudit(mockAQIData, mockProfile);

    expect(audit).toBeDefined();
    expect(audit.currentIndoorAQIEstimate).toBeLessThan(mockAQIData.aqi);
    expect(audit.safeVentilationWindow).toBeDefined();
    expect(audit.purifierOptimization.roomAchRate).toBeGreaterThan(0);
    expect(audit.recommendedPlants.length).toBeGreaterThanOrEqual(3);
    expect(audit.actionableHacks.length).toBeGreaterThanOrEqual(3);

    // Check specific science-backed hacks
    const hasMoppingHack = audit.actionableHacks.some((h) => h.title.includes('Mopping'));
    expect(hasMoppingHack).toBe(true);
  });
});

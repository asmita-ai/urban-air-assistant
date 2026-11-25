import { describe, it, expect } from 'vitest';
import {
  HouseholdProfileSchema,
  RoutinePlanSchema,
  ChatRequestSchema,
  RoutineRequestSchema,
} from '../lib/schemas';

describe('Zod Runtime Schema Validation', () => {
  const sampleProfile = {
    city: 'Delhi NCR',
    familyMembers: [
      {
        id: '1',
        name: 'Aarav',
        type: 'child' as const,
        hasRespiratoryIssue: true,
        activityLevel: 'moderate' as const,
      },
    ],
    commuteMode: 'metro' as const,
    commuteDistanceKm: 15,
    hasAirPurifier: true,
    homeType: 'apartment' as const,
    indoorPlantsCount: 4,
  };

  const sampleAQIData = {
    city: 'Delhi NCR',
    country: 'India',
    latitude: 28.61,
    longitude: 77.2,
    aqi: 340,
    category: 'Severe' as const,
    primaryPollutant: 'PM2.5',
    pollutants: {
      pm25: 180,
      pm10: 290,
      no2: 65,
      so2: 20,
      co: 1.8,
      o3: 45,
    },
    hourly: [
      {
        time: '2026-11-25T12:00:00Z',
        hour: 12,
        aqi: 340,
        pm25: 180,
        category: 'Severe' as const,
        isVentilationSafe: false,
      },
    ],
    temperature: 20,
    humidity: 60,
    windSpeed: 5,
    source: 'CPCB',
    timestamp: '25 Nov 2026, 12:00 PM',
    healthAdvisory: 'High smog risk',
    vulnerabilityAlerts: {
      children: 'Avoid outdoor play',
      seniors: 'Stay indoors',
      respiratory: 'Keep emergency inhaler ready',
      outdoorWorkers: 'Wear N95',
    },
  };

  it('validates a correct HouseholdProfile', () => {
    const result = HouseholdProfileSchema.safeParse(sampleProfile);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid HouseholdProfile with empty family members', () => {
    const invalid = { ...sampleProfile, familyMembers: [] };
    const result = HouseholdProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates a complete RoutineRequest payload', () => {
    const payload = {
      aqiData: sampleAQIData,
      profile: sampleProfile,
    };
    const result = RoutineRequestSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('validates a correct RoutinePlan structure', () => {
    const plan = {
      headline: 'Severe Smog Advisory',
      smogSeveritySummary: 'High PM2.5 levels',
      householdVulnerabilityScore: 85,
      items: [
        {
          id: 'item-1',
          timeSlot: 'Morning (06:00 - 11:00)' as const,
          title: 'Indoor Yoga',
          activity: 'Cardio exercise',
          lowEmissionAlternative: 'Indoor stretching',
          targetMember: 'All',
          exposureRisk: 'Severe' as const,
          emissionsAvoidedKgCO2: 0,
          pmAvoidedGrams: 0.8,
          justification: 'Inversion layer traps toxic particulates.',
        },
      ],
      tripCombiningAdvice: 'Chain trips together in the afternoon.',
      totalPotentialCO2SavingsKg: 3.2,
      totalPotentialPMSavingsGrams: 1.5,
    };
    const result = RoutinePlanSchema.safeParse(plan);
    expect(result.success).toBe(true);
  });

  it('rejects an empty message in ChatRequestSchema', () => {
    const invalidChat = {
      message: '',
      aqiData: sampleAQIData,
      profile: sampleProfile,
    };
    const result = ChatRequestSchema.safeParse(invalidChat);
    expect(result.success).toBe(false);
  });
});

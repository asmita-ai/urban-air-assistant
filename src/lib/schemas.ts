import { z } from 'zod';

export const HouseholdMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['child', 'senior', 'adult', 'infant']),
  hasRespiratoryIssue: z.boolean(),
  activityLevel: z.enum(['low', 'moderate', 'high']),
});

export const HouseholdProfileSchema = z.object({
  city: z.string().min(1),
  customLocation: z.string().optional(),
  familyMembers: z.array(HouseholdMemberSchema).min(1, 'At least one family member is required'),
  commuteMode: z.enum(['metro', 'bus', 'car', 'two-wheeler', 'walk-cycle', 'wfh']),
  commuteDistanceKm: z.number().min(0).max(200),
  hasAirPurifier: z.boolean(),
  homeType: z.enum(['apartment', 'independent-house', 'dense-neighborhood']),
  indoorPlantsCount: z.number().min(0).max(100),
});

export const PollutantValuesSchema = z.object({
  pm25: z.number().min(0),
  pm10: z.number().min(0),
  no2: z.number().min(0),
  so2: z.number().min(0),
  co: z.number().min(0),
  o3: z.number().min(0),
});

export const HourlyAQISchema = z.object({
  time: z.string(),
  hour: z.number().min(0).max(23),
  aqi: z.number().min(0),
  pm25: z.number().min(0),
  category: z.enum([
    'Good',
    'Satisfactory',
    'Moderate',
    'Poor',
    'Very Poor',
    'Severe',
    'Hazardous',
  ]),
  isVentilationSafe: z.boolean(),
});

export const AQIDataSchema = z.object({
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  aqi: z.number().min(0),
  category: z.enum([
    'Good',
    'Satisfactory',
    'Moderate',
    'Poor',
    'Very Poor',
    'Severe',
    'Hazardous',
  ]),
  primaryPollutant: z.string(),
  pollutants: PollutantValuesSchema,
  hourly: z.array(HourlyAQISchema),
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  source: z.string(),
  timestamp: z.string(),
  healthAdvisory: z.string(),
  vulnerabilityAlerts: z.object({
    children: z.string(),
    seniors: z.string(),
    respiratory: z.string(),
    outdoorWorkers: z.string(),
  }),
});

// API Request Schemas
export const RoutineRequestSchema = z.object({
  aqiData: AQIDataSchema,
  profile: HouseholdProfileSchema,
});

export const IAQAuditRequestSchema = z.object({
  aqiData: AQIDataSchema,
  profile: HouseholdProfileSchema,
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  aqiData: AQIDataSchema,
  profile: HouseholdProfileSchema,
});

// Gemini Output Schema for validation
export const RoutineItemSchema = z.object({
  id: z.string(),
  timeSlot: z.enum([
    'Morning (06:00 - 11:00)',
    'Afternoon (11:00 - 17:00)',
    'Evening (17:00 - 22:00)',
    'Night (22:00 - 06:00)',
  ]),
  title: z.string(),
  activity: z.string(),
  lowEmissionAlternative: z.string(),
  targetMember: z.string(),
  exposureRisk: z.enum(['Low', 'Medium', 'High', 'Severe']),
  emissionsAvoidedKgCO2: z.number(),
  pmAvoidedGrams: z.number(),
  justification: z.string(),
});

export const RoutinePlanSchema = z.object({
  headline: z.string(),
  smogSeveritySummary: z.string(),
  householdVulnerabilityScore: z.number().min(0).max(100),
  items: z.array(RoutineItemSchema).min(1),
  tripCombiningAdvice: z.string(),
  totalPotentialCO2SavingsKg: z.number(),
  totalPotentialPMSavingsGrams: z.number(),
});

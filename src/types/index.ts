export type AQICategory =
  'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' | 'Hazardous';

export interface PollutantValues {
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  no2: number; // ug/m3
  so2: number; // ug/m3
  co: number; // mg/m3
  o3: number; // ug/m3
}

export interface HourlyAQI {
  time: string;
  hour: number;
  aqi: number;
  pm25: number;
  category: AQICategory;
  isVentilationSafe: boolean;
}

export interface AQIData {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  aqi: number;
  category: AQICategory;
  primaryPollutant: string;
  pollutants: PollutantValues;
  hourly: HourlyAQI[];
  temperature: number;
  humidity: number;
  windSpeed: number;
  source: string;
  timestamp: string;
  healthAdvisory: string;
  vulnerabilityAlerts: {
    children: string;
    seniors: string;
    respiratory: string;
    outdoorWorkers: string;
  };
}

export interface HouseholdMember {
  id: string;
  name: string;
  type: 'child' | 'senior' | 'adult' | 'infant';
  hasRespiratoryIssue: boolean;
  activityLevel: 'low' | 'moderate' | 'high';
}

export interface HouseholdProfile {
  city: string;
  customLocation?: string;
  familyMembers: HouseholdMember[];
  commuteMode: 'metro' | 'bus' | 'car' | 'two-wheeler' | 'walk-cycle' | 'wfh';
  commuteDistanceKm: number;
  hasAirPurifier: boolean;
  homeType: 'apartment' | 'independent-house' | 'dense-neighborhood';
  indoorPlantsCount: number;
}

export interface RoutineItem {
  id: string;
  timeSlot:
    | 'Morning (06:00 - 11:00)'
    | 'Afternoon (11:00 - 17:00)'
    | 'Evening (17:00 - 22:00)'
    | 'Night (22:00 - 06:00)';
  title: string;
  activity: string;
  lowEmissionAlternative: string;
  targetMember: string;
  exposureRisk: 'Low' | 'Medium' | 'High' | 'Severe';
  emissionsAvoidedKgCO2: number;
  pmAvoidedGrams: number;
  justification: string;
}

export interface RoutinePlan {
  headline: string;
  smogSeveritySummary: string;
  householdVulnerabilityScore: number; // 0-100
  items: RoutineItem[];
  tripCombiningAdvice: string;
  totalPotentialCO2SavingsKg: number;
  totalPotentialPMSavingsGrams: number;
}

export interface IAQHack {
  title: string;
  category: 'ventilation' | 'purification' | 'plants' | 'cooking' | 'diy';
  impactLevel: 'High' | 'Medium' | 'Essential';
  description: string;
  scientificReasoning: string;
  estimatedCostINR: string;
  actionSteps: string[];
}

export interface IAQAuditResult {
  currentIndoorAQIEstimate: number;
  safeVentilationWindow: {
    bestTime: string;
    explanation: string;
    windowStatus: 'Open Safe' | 'Crack Windows Only' | 'Keep Sealed';
  };
  purifierOptimization: {
    recommendedFanSpeed: 'Silent' | 'Medium' | 'Turbo' | 'Continuous High';
    roomAchRate: number;
    diyHackRecommendation: string;
  };
  recommendedPlants: Array<{
    name: string;
    scientificName: string;
    nasaBenefit: string;
    recommendedPerRoom: number;
    careNote: string;
  }>;
  actionableHacks: IAQHack[];
}

export interface SustainableImpactAction {
  id: string;
  title: string;
  category: 'commute' | 'home' | 'lifestyle';
  description: string;
  co2SavingsKg: number;
  pmSavingsGrams: number;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tags?: string[];
}

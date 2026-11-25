/**
 * Application Constants and Scientific Benchmarks
 * Centralized configuration to eliminate magic numbers and duplicate literals.
 */

// Gemini Model Configuration
export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// Cache Time-To-Live (TTL) in milliseconds
export const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Rate Limiting Configuration
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute per IP

// Indian CPCB National Ambient Air Quality Standards (NAAQS) 24-hr Permissible Limits
export const CPCB_SAFE_LIMITS = {
  PM25: 60, // ug/m3
  PM10: 100, // ug/m3
  NO2: 80, // ug/m3
  SO2: 80, // ug/m3
  CO: 2.0, // mg/m3
  O3: 100, // ug/m3
} as const;

// Emission Factors (Urban India Transport averages)
export const EMISSION_FACTORS = {
  PETROL_CAR_CO2_PER_KM: 0.165, // kg CO2 per vehicle-km
  PETROL_CAR_PM_PER_KM: 0.05, // grams PM per vehicle-km
  TWO_WHEELER_CO2_PER_KM: 0.045, // kg CO2 per km
  TWO_WHEELER_PM_PER_KM: 0.03, // grams PM per km
  METRO_CO2_PER_PASSENGER_KM: 0.015, // kg CO2 per passenger-km
  BUS_CO2_PER_PASSENGER_KM: 0.035, // kg CO2 per passenger-km
  METRO_EXPOSURE_REDUCTION_PCT: 75, // Filtered HVAC cabin exposure reduction %
  CARPOOL_SAVINGS_RATIO: 0.6,
  TRIP_CHAINING_SAVINGS_RATIO: 0.35,
} as const;

// Clean Air Delivery Rate (CADR) calculation benchmarks
export const IAQ_BENCHMARKS = {
  TARGET_ACH_SEVERE_SMOG: 4.5, // Target Air Changes per Hour
  INDOOR_PURIFIER_ATTENUATION: 0.22, // Retains only ~22% of outdoor PM with HEPA active
  INDOOR_NATURAL_ATTENUATION: 0.72, // Infiltration without purifier is ~72%
} as const;

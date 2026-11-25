import { AQICategory, PollutantValues, HouseholdProfile } from '@/types';

/**
 * Calculates Indian National Air Quality Index (CPCB standard)
 * Based on CPCB sub-index linear interpolation formula:
 * Ip = [ (I_hi - I_lo) / (B_hi - B_lo) ] * (Cp - B_lo) + I_lo
 */
interface Breakpoint {
  bLo: number;
  bHi: number;
  iLo: number;
  iHi: number;
}

const PM25_BREAKPOINTS: Breakpoint[] = [
  { bLo: 0, bHi: 30, iLo: 0, iHi: 50 },
  { bLo: 31, bHi: 60, iLo: 51, iHi: 100 },
  { bLo: 61, bHi: 90, iLo: 101, iHi: 200 },
  { bLo: 91, bHi: 120, iLo: 201, iHi: 300 },
  { bLo: 121, bHi: 250, iLo: 301, iHi: 400 },
  { bLo: 251, bHi: 500, iLo: 401, iHi: 500 },
];

const PM10_BREAKPOINTS: Breakpoint[] = [
  { bLo: 0, bHi: 50, iLo: 0, iHi: 50 },
  { bLo: 51, bHi: 100, iLo: 51, iHi: 100 },
  { bLo: 101, bHi: 250, iLo: 101, iHi: 200 },
  { bLo: 251, bHi: 350, iLo: 201, iHi: 300 },
  { bLo: 351, bHi: 430, iLo: 301, iHi: 400 },
  { bLo: 431, bHi: 600, iLo: 401, iHi: 500 },
];

function calculateSubIndex(concentration: number, breakpoints: Breakpoint[]): number {
  if (concentration < 0) return 0;
  for (const bp of breakpoints) {
    if (concentration >= bp.bLo && concentration <= bp.bHi) {
      const sub = ((bp.iHi - bp.iLo) / (bp.bHi - bp.bLo)) * (concentration - bp.bLo) + bp.iLo;
      return Math.round(sub);
    }
  }
  // Exceeds upper threshold
  const last = breakpoints[breakpoints.length - 1];
  if (concentration > last.bHi) {
    return Math.min(500, Math.round(400 + ((concentration - last.bHi) / 100) * 50));
  }
  return 0;
}

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  if (aqi <= 500) return 'Severe';
  return 'Hazardous';
}

export function getAQIColor(category: AQICategory): {
  bg: string;
  text: string;
  border: string;
  accent: string;
  hex: string;
} {
  switch (category) {
    case 'Good':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800', accent: 'bg-emerald-500', hex: '#10b981' };
    case 'Satisfactory':
      return { bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-800', accent: 'bg-green-500', hex: '#22c55e' };
    case 'Moderate':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800', accent: 'bg-amber-500', hex: '#f59e0b' };
    case 'Poor':
      return { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-800', accent: 'bg-orange-500', hex: '#f97316' };
    case 'Very Poor':
      return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-800', accent: 'bg-rose-500', hex: '#ef4444' };
    case 'Severe':
    case 'Hazardous':
    default:
      return { bg: 'bg-red-950/60 dark:bg-red-950/80', text: 'text-red-400 dark:text-red-200', border: 'border-red-600', accent: 'bg-red-700', hex: '#b91c1c' };
  }
}

export function computeIndianAQI(pollutants: PollutantValues): { aqi: number; primaryPollutant: string; category: AQICategory } {
  const pm25Index = calculateSubIndex(pollutants.pm25, PM25_BREAKPOINTS);
  const pm10Index = calculateSubIndex(pollutants.pm10, PM10_BREAKPOINTS);

  let primary = 'PM2.5';
  let maxAQI = pm25Index;

  if (pm10Index > maxAQI) {
    maxAQI = pm10Index;
    primary = 'PM10';
  }

  const category = getAQICategory(maxAQI);
  return { aqi: maxAQI, primaryPollutant: primary, category };
}

export function getHealthAdvisory(aqi: number): {
  general: string;
  children: string;
  seniors: string;
  respiratory: string;
  outdoorWorkers: string;
} {
  if (aqi <= 50) {
    return {
      general: 'Air quality is satisfactory and poses little or no risk.',
      children: 'Safe for all outdoor games and sports activities.',
      seniors: 'Enjoy regular morning walks and outdoor recreation.',
      respiratory: 'Standard activity. No precautionary masks needed.',
      outdoorWorkers: 'Ideal working conditions outdoors.',
    };
  } else if (aqi <= 100) {
    return {
      general: 'Acceptable air quality for most. Minor sensitivity possible for sensitive groups.',
      children: 'Normal outdoor play allowed. Keep well hydrated.',
      seniors: 'Normal outdoor walks. Moderate pace if sensitive.',
      respiratory: 'Keep emergency inhaler handy during vigorous exercise.',
      outdoorWorkers: 'Normal activity. Stay hydrated.',
    };
  } else if (aqi <= 200) {
    return {
      general: 'May cause breathing discomfort to people with lung disease, asthma, and heart conditions.',
      children: 'Reduce prolonged intense outdoor athletic drills. Schedule play after 12:00 PM.',
      seniors: 'Limit brisk morning walks during cold early hours (before 8 AM).',
      respiratory: 'Take prescribed preventers. Wear a standard surgical or N95 mask outside.',
      outdoorWorkers: 'Take periodic breaks indoors or in shaded/filtered areas.',
    };
  } else if (aqi <= 300) {
    return {
      general: 'Causes breathing discomfort to most people on prolonged exposure. Smog haze visible.',
      children: 'Strictly avoid outdoor sports. Keep school recesses indoors.',
      seniors: 'Stay indoors during early mornings and late evenings. Keep doors closed.',
      respiratory: 'High risk of acute flare-ups. Use N95 mask outside; run indoor air purifier.',
      outdoorWorkers: 'Mandatory N95 mask. Rest every 2 hours in indoor clean zones.',
    };
  } else if (aqi <= 400) {
    return {
      general: 'Very Poor: Causes respiratory illness on prolonged exposure. Significant toxic smog.',
      children: 'Zero outdoor play. Shut classroom windows. Use indoor educational games.',
      seniors: 'Complete indoor confinement recommended. Avoid cold air inhalation.',
      respiratory: 'Severe emergency risk. Double check medication supply, keep nebulizer accessible.',
      outdoorWorkers: 'Wear fit-tested N95/N99 masks. Restrict outdoor hours to essential tasks only.',
    };
  } else {
    return {
      general: 'Severe / Emergency: Severe health emergency. Healthy individuals will experience chest tightness.',
      children: 'Close schools or switch to hybrid mode. Run room air purifiers continuously.',
      seniors: 'Absolute indoor stay. Seal window cracks. Avoid any physical exertion.',
      respiratory: 'Critical threat. Consult doctor if experiencing wheezing or persistent cough.',
      outdoorWorkers: 'Halt non-essential outdoor work. Employers must provide N95 masks and clean air hubs.',
    };
  }
}

/**
 * Calculates Household Vulnerability Score (0 - 100)
 */
export function calculateHouseholdVulnerability(profile: HouseholdProfile, aqi: number): number {
  let score = 20; // baseline

  // AQI severity multiplier (0 - 40)
  score += Math.min(40, (aqi / 500) * 40);

  // Vulnerable members
  profile.familyMembers.forEach((member) => {
    if (member.type === 'infant') score += 15;
    if (member.type === 'child') score += 8;
    if (member.type === 'senior') score += 12;
    if (member.hasRespiratoryIssue) score += 20;
  });

  // Protection mitigating factors
  if (profile.hasAirPurifier) score -= 15;
  if (profile.indoorPlantsCount >= 5) score -= 5;

  // Commute vulnerability
  if (profile.commuteMode === 'two-wheeler' || profile.commuteMode === 'walk-cycle') {
    score += 10;
  } else if (profile.commuteMode === 'wfh') {
    score -= 10;
  }

  return Math.max(5, Math.min(100, Math.round(score)));
}

/**
 * Commute emission & exposure impact calculator
 */
export function calculateCommuteImpact(distanceKm: number, _currentMode?: string) {
  // Baseline: Average petrol car emission factor in urban India: ~0.165 kg CO2/km, 0.05g PM2.5/km
  // Two-wheeler: ~0.045 kg CO2/km, 0.03g PM2.5/km
  // Metro: ~0.015 kg CO2/passenger-km, negligible localized PM2.5
  // Bus (Electric/CNG): ~0.035 kg CO2/passenger-km
  
  const roundTrip = distanceKm * 2;
  const carCO2 = roundTrip * 0.165;
  const carPM = roundTrip * 0.05;

  const metroCO2 = roundTrip * 0.015;
  const busCO2 = roundTrip * 0.035;

  return {
    dailyCarEmissions: { co2Kg: Number(carCO2.toFixed(2)), pmGrams: Number(carPM.toFixed(2)) },
    metroSavings: {
      co2KgSaved: Number((carCO2 - metroCO2).toFixed(2)),
      pmGramsSaved: Number((carPM * 0.95).toFixed(2)),
      exposureReductionPct: 75, // Metro stations/trains have HEPA HVAC
    },
    busSavings: {
      co2KgSaved: Number((carCO2 - busCO2).toFixed(2)),
      pmGramsSaved: Number((carPM * 0.85).toFixed(2)),
    },
    carpoolSavings: {
      co2KgSaved: Number((carCO2 * 0.6).toFixed(2)),
      pmGramsSaved: Number((carPM * 0.6).toFixed(2)),
      exposureReductionPct: 20,
    },
    tripChainingSavings: {
      co2KgSaved: Number((carCO2 * 0.35).toFixed(2)),
      pmGramsSaved: Number((carPM * 0.35).toFixed(2)),
    }
  };
}

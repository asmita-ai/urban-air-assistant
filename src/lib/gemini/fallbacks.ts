import { AQIData, HouseholdProfile, RoutinePlan, IAQAuditResult } from '@/types';
import { calculateCommuteImpact } from '../aqiCalculator';
import { IAQ_BENCHMARKS } from '../constants';

/**
 * High-fidelity deterministic generator matching the RoutinePlan schema
 */
export function generateDeterministicRoutinePlan(
  aqiData: AQIData,
  profile: HouseholdProfile,
  vulnerabilityScore: number,
  commuteStats: ReturnType<typeof calculateCommuteImpact>
): RoutinePlan {
  const isSevere = aqiData.aqi >= 300;

  const child = profile.familyMembers.find((m) => m.type === 'child' || m.type === 'infant');
  const senior = profile.familyMembers.find((m) => m.type === 'senior');
  const asthmatic = profile.familyMembers.find((m) => m.hasRespiratoryIssue);

  const items = [
    {
      id: 'item-1',
      timeSlot: 'Morning (06:00 - 11:00)' as const,
      title: senior ? 'Shift Morning Walk to Sunlit Hours' : 'Reschedule Outdoor Cardio Drills',
      activity:
        'Early morning physical exercise or walk during peak winter temperature inversion layer',
      lowEmissionAlternative: isSevere
        ? 'Indoor yoga / stretching in a HEPA-purified room; avoid cold morning smog entirely'
        : 'Shift walk to 10:30 AM after sun breaks the ground inversion layer',
      targetMember: senior
        ? `${senior.name} (Senior)`
        : asthmatic
          ? `${asthmatic.name} (Asthma Care)`
          : 'All Adults',
      exposureRisk: isSevere ? ('Severe' as const) : ('High' as const),
      emissionsAvoidedKgCO2: 0,
      pmAvoidedGrams: 0.8,
      justification:
        'Between 6-8 AM, cold stagnant air traps particulate matter PM2.5 near the ground. Delaying outdoor exposure reduces lung toxic intake by up to 65%.',
    },
    {
      id: 'item-2',
      timeSlot: 'Morning (06:00 - 11:00)' as const,
      title: 'Eco-Commute & Metro Transition',
      activity: `Daily commute of ${profile.commuteDistanceKm} km currently via ${profile.commuteMode}`,
      lowEmissionAlternative:
        profile.commuteMode === 'metro'
          ? 'Continue using Delhi Metro; encourage 2 colleagues to carpool for last-mile connectivity'
          : `Switch to Metro or AC Electric Bus; combine morning drop-off with office route`,
      targetMember: 'Working Commuters',
      exposureRisk: isSevere ? ('High' as const) : ('Medium' as const),
      emissionsAvoidedKgCO2: commuteStats.metroSavings.co2KgSaved,
      pmAvoidedGrams: commuteStats.metroSavings.pmGramsSaved,
      justification: `Switching from private motor transit to electrified mass transit saves ~${commuteStats.metroSavings.co2KgSaved} kg CO2 today and avoids sitting in stationary exhaust congestion plumes.`,
    },
    {
      id: 'item-3',
      timeSlot: 'Afternoon (11:00 - 17:00)' as const,
      title: child ? 'School Recess & Indoor Physical Activity' : 'Mid-Day Smart Errands Chaining',
      activity: child
        ? 'School outdoor play or sports practice'
        : 'Multiple scattered short shopping and errand trips',
      lowEmissionAlternative: child
        ? 'Keep sports sessions strictly indoors or switch to low-intensity board / mental games'
        : 'Trip Chaining: combine grocery, banking, and pickup into a single planned 20-minute loop',
      targetMember: child ? `${child.name} (Child)` : 'Household Coordinator',
      exposureRisk: isSevere ? ('High' as const) : ('Medium' as const),
      emissionsAvoidedKgCO2: commuteStats.tripChainingSavings.co2KgSaved,
      pmAvoidedGrams: commuteStats.tripChainingSavings.pmGramsSaved,
      justification:
        'Combining short errands eliminates cold engine starts which emit 3x more hydrocarbons and PM per kilometer than warmed engines.',
    },
    {
      id: 'item-4',
      timeSlot: 'Evening (17:00 - 22:00)' as const,
      title: 'Kitchen Exhaust & Sealed Indoor Zone Protocol',
      activity: 'Evening cooking, dinner preparation, and family relaxation',
      lowEmissionAlternative:
        'Cook with lids on and chimney exhaust on high; seal bedroom doors with door-snakes and engage purifier',
      targetMember: 'Whole Household',
      exposureRisk: isSevere ? ('High' as const) : ('Low' as const),
      emissionsAvoidedKgCO2: 0.3,
      pmAvoidedGrams: 0.5,
      justification:
        'Frying and roasting release significant ultrafine PM2.5 indoors. Exhaust hood extraction combined with closed interior doors confines particulates to the kitchen.',
    },
  ];

  const totalCO2 = items.reduce((acc, i) => acc + i.emissionsAvoidedKgCO2, 0);
  const totalPM = items.reduce((acc, i) => acc + i.pmAvoidedGrams, 0);

  return {
    headline: `${aqiData.category} Smog Alert for ${profile.city}: Protect High-Risk Members & Slash Transit Footprint`,
    smogSeveritySummary: `Current AQI of ${aqiData.aqi} is dominated by ${aqiData.primaryPollutant} (${aqiData.pollutants.pm25} µg/m³). Inversion conditions and calm winds (${aqiData.windSpeed} km/h) make early morning and late evening outdoor exposure hazardous.`,
    householdVulnerabilityScore: vulnerabilityScore,
    items,
    tripCombiningAdvice: `Batch your upcoming 3 errands into one unified route this afternoon between 1:30 PM and 3:30 PM. This avoids peak traffic congestion and saves an estimated ${(totalCO2 * 0.4).toFixed(1)} kg CO2.`,
    totalPotentialCO2SavingsKg: Number(totalCO2.toFixed(2)),
    totalPotentialPMSavingsGrams: Number(totalPM.toFixed(2)),
  };
}

/**
 * Science-backed Indoor Air Quality (IAQ) audit generator
 */
export function generateIAQAuditCalculation(
  aqiData: AQIData,
  profile: HouseholdProfile
): IAQAuditResult {
  const indoorEstimate = profile.hasAirPurifier
    ? Math.round(aqiData.aqi * IAQ_BENCHMARKS.INDOOR_PURIFIER_ATTENUATION)
    : Math.round(aqiData.aqi * IAQ_BENCHMARKS.INDOOR_NATURAL_ATTENUATION);

  const sortedHourly = [...aqiData.hourly].sort((a, b) => a.aqi - b.aqi);
  const bestHour = sortedHourly.find((h) => h.hour >= 12 && h.hour <= 16) || sortedHourly[0];
  const bestTimeStr = bestHour
    ? `${bestHour.hour.toString().padStart(2, '0')}:00 - ${(bestHour.hour + 1).toString().padStart(2, '0')}:00`
    : '13:00 - 15:00';

  const windowStatus =
    aqiData.aqi > 350 ? 'Keep Sealed' : aqiData.aqi > 200 ? 'Crack Windows Only' : 'Open Safe';

  return {
    currentIndoorAQIEstimate: indoorEstimate,
    safeVentilationWindow: {
      bestTime: bestTimeStr,
      explanation: `Atmospheric vertical mixing is maximum between 1:00 PM and 3:30 PM when solar radiation warms the surface, temporarily thinning ground-level smog concentrations by up to 35%.`,
      windowStatus,
    },
    purifierOptimization: {
      recommendedFanSpeed:
        aqiData.aqi > 300 ? 'Continuous High' : aqiData.aqi > 150 ? 'Medium' : 'Silent',
      roomAchRate: profile.hasAirPurifier ? IAQ_BENCHMARKS.TARGET_ACH_SEVERE_SMOG : 0.8,
      diyHackRecommendation: profile.hasAirPurifier
        ? 'Place purifier 2 feet away from walls in the center of airflow; vacuum the pre-filter mesh weekly to prevent airflow choking.'
        : 'DIY Box-Fan Filter Hack: Tape a MERV 13 or H13 HEPA furnace filter to the intake side of a standard 20-inch box fan. Achieves 80% CADR of commercial purifiers at 1/10th cost.',
    },
    recommendedPlants: [
      {
        name: 'Snake Plant (Sansevieria)',
        scientificName: 'Dracaena trifasciata',
        nasaBenefit:
          'Releases oxygen at night (Crassulacean Acid Metabolism) while absorbing benzene and formaldehyde.',
        recommendedPerRoom: 2,
        careNote: 'Water only every 2-3 weeks; thrives in low light.',
      },
      {
        name: 'Areca Palm',
        scientificName: 'Dypsis lutescens',
        nasaBenefit:
          'Top-tier natural humidifier and xylene/toluene filter for dry winter smog bedrooms.',
        recommendedPerRoom: 1,
        careNote: 'Keep soil moist, indirect sunlight.',
      },
      {
        name: 'Spider Plant',
        scientificName: 'Chlorophytum comosum',
        nasaBenefit:
          'Removes carbon monoxide and nitrogen dioxide generated from gas stovetops and traffic ingress.',
        recommendedPerRoom: 2,
        careNote: 'Pet-safe, resilient, thrives on windowsills.',
      },
      {
        name: 'Money Plant (Golden Pothos)',
        scientificName: 'Epipremnum aureum',
        nasaBenefit: 'High absorption rate of VOCs and airborne particulate settling surface.',
        recommendedPerRoom: 2,
        careNote: 'Grow in water or soil, minimal maintenance.',
      },
    ],
    actionableHacks: [
      {
        title: 'Wet Mopping vs Dry Sweeping',
        category: 'diy',
        impactLevel: 'Essential',
        description:
          'Dry brooms aerosolize settled micro-particles back into breathing zones for 4+ hours.',
        scientificReasoning:
          'Electrostatic wet microfiber mops capture PM2.5 and PM10 particles through capillary adhesion without resuspending dust.',
        estimatedCostINR: '₹150 for microfiber mop',
        actionSteps: [
          'Add a splash of neem extract or mild vinegar to mop water',
          'Avoid dry brooms entirely during smog emergencies',
          'Mop twice daily in bedrooms of asthmatic elders and children',
        ],
      },
      {
        title: 'Door-Draft Stopper & Window Edge Sealing',
        category: 'ventilation',
        impactLevel: 'High',
        description:
          'Prevent outside toxic particulate infiltration through door crevices and window frames.',
        scientificReasoning:
          'Infiltration accounts for 50-70% of indoor PM2.5 in unsealed Indian urban apartments.',
        estimatedCostINR: '₹200 - ₹400 for weather stripping foam',
        actionSteps: [
          'Install self-adhesive foam strips along window borders',
          'Place rolled towels or silicone draft snakes under exterior doors',
          'Keep bathroom exhausts closed when not actively venting moisture',
        ],
      },
      {
        title: 'Cooking Smog Containment Protocol',
        category: 'cooking',
        impactLevel: 'High',
        description:
          'Stir-frying and spice tempering (tadka) spike indoor PM2.5 beyond 600 µg/m³ in minutes.',
        scientificReasoning:
          'Heated oil fumes aerosolize into ultrafine volatile droplets that bypass nasal filters.',
        estimatedCostINR: '₹0 (Behavioral)',
        actionSteps: [
          'Turn on kitchen chimney/exhaust 2 minutes before igniting burners',
          'Keep kitchen doors firmly shut while cooking',
          'Cover cookware with lids to contain oil vapors',
        ],
      },
    ],
  };
}

/**
 * Intelligent deterministic fallback chat responses
 */
export function getFallbackChatResponse(
  message: string,
  aqiData: AQIData,
  profile: HouseholdProfile
): string {
  const lower = message.toLowerCase();
  if (lower.includes('mask') || lower.includes('n95')) {
    return `In ${aqiData.city} today with an AQI of ${aqiData.aqi} (${aqiData.category}), standard cloth or surgical masks are insufficient because PM2.5 particles are 30 times smaller than a human hair and pass straight through ordinary fabric. **You should wear a certified N95 or N99 respirator** that forms a tight facial seal. Ensure there are no gaps around the nose bridge. This reduces inhaled particulate burden by over 95%.`;
  }
  if (
    lower.includes('walk') ||
    lower.includes('run') ||
    lower.includes('exercise') ||
    lower.includes('jog')
  ) {
    return `Outdoor cardio in ${aqiData.city} is currently **not recommended**. When you run or jog, deep ventilation increases your lung air intake by 10x to 15x, driving toxic PM2.5 deep into the alveolar sacs. If your family members must walk, wait until **1:00 PM to 3:30 PM** when ground thermal inversions weaken, or better yet, do indoor aerobics/yoga in a closed room with an air purifier.`;
  }
  if (lower.includes('child') || lower.includes('school') || lower.includes('play')) {
    return `With today's AQI of ${aqiData.aqi}, children's lungs and immune systems are at elevated risk because they breathe faster per kilogram of body weight. **Cancel outdoor evening playtime** and keep recess indoors. If traveling to school, ensure they wear an N95 mask during transit and keep bus/car windows closed.`;
  }
  if (lower.includes('purifier') || lower.includes('filter') || lower.includes('diy')) {
    return `If you don't have a commercial air purifier, you can assemble a **DIY Box-Fan Filter**: tape a MERV 13 or True HEPA filter to the back of a standard box fan. Running this in a closed 120 sq ft bedroom can drop PM2.5 by 70-80% within 45 minutes for less than ₹1,500. Keep the room doors and windows sealed.`;
  }
  if (lower.includes('metro') || lower.includes('commute') || lower.includes('car')) {
    const savings = calculateCommuteImpact(profile.commuteDistanceKm, profile.commuteMode);
    return `By switching your ${profile.commuteDistanceKm} km commute to the Metro today, you will prevent approximately **${savings.metroSavings.co2KgSaved} kg of CO2** and **${savings.metroSavings.pmGramsSaved}g of PM emissions**, while reducing your own toxic exhaust exposure by ~${savings.metroSavings.exposureReductionPct}%.`;
  }

  return `Given today's AQI of ${aqiData.aqi} (${aqiData.category}) in ${aqiData.city}, primary pollutant is ${aqiData.primaryPollutant} at ${aqiData.pollutants.pm25} µg/m³. The most effective immediate actions: (1) Keep windows sealed until the 1:00 PM - 3:30 PM atmospheric mixing window, (2) Wet-mop floors instead of dry sweeping to avoid resuspending dust, and (3) Switch commuting to public transit or carpooling to prevent exacerbating local winter smog. How can I help your family further?`;
}

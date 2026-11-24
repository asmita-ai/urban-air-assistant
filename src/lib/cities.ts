export interface CityPreset {
  name: string;
  state: string;
  lat: number;
  lon: number;
  typicalWinterAQI: number;
  smogProneSeason: string;
  majorSources: string[];
}

export const INDIAN_CITIES: CityPreset[] = [
  {
    name: 'Delhi NCR (Central)',
    state: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    typicalWinterAQI: 380,
    smogProneSeason: 'Oct - Feb',
    majorSources: ['Vehicular exhaust', 'Thermal inversion', 'Biomass burning', 'Construction dust'],
  },
  {
    name: 'Noida (Sector 62)',
    state: 'Uttar Pradesh',
    lat: 28.6276,
    lon: 77.3712,
    typicalWinterAQI: 395,
    smogProneSeason: 'Oct - Feb',
    majorSources: ['Highway traffic', 'Industrial emissions', 'Suspended dust', 'Winter inversion'],
  },
  {
    name: 'Gurugram (Cyber City)',
    state: 'Haryana',
    lat: 28.4595,
    lon: 77.0266,
    typicalWinterAQI: 350,
    smogProneSeason: 'Oct - Feb',
    majorSources: ['Heavy diesel generators', 'Expressway transit', 'Construction'],
  },
  {
    name: 'Kolkata (Ballygunge)',
    state: 'West Bengal',
    lat: 22.5726,
    lon: 88.3639,
    typicalWinterAQI: 240,
    smogProneSeason: 'Nov - Jan',
    majorSources: ['Old diesel fleet', 'Port transport', 'Solid fuel burning'],
  },
  {
    name: 'Mumbai (BKC)',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    typicalWinterAQI: 180,
    smogProneSeason: 'Nov - Feb',
    majorSources: ['Coastal humidity trapping dust', 'Heavy construction', 'Marine bunker fuel'],
  },
  {
    name: 'Lucknow (Gomti Nagar)',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lon: 80.9462,
    typicalWinterAQI: 330,
    smogProneSeason: 'Oct - Feb',
    majorSources: ['Valley topography inversion', 'Biomass heating', 'Congested corridors'],
  },
  {
    name: 'Patna (Planetarium)',
    state: 'Bihar',
    lat: 25.5941,
    lon: 85.1376,
    typicalWinterAQI: 370,
    smogProneSeason: 'Nov - Feb',
    majorSources: ['Gangetic plain stagnant air', 'Brick kilns', 'Unpaved road dust'],
  },
  {
    name: 'Bengaluru (Koramangala)',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    typicalWinterAQI: 85,
    smogProneSeason: 'Year-round moderate',
    majorSources: ['Peak hour traffic congestion', 'Construction plumes'],
  },
  {
    name: 'Hyderabad (Hitec City)',
    state: 'Telangana',
    lat: 17.3850,
    lon: 78.4867,
    typicalWinterAQI: 120,
    smogProneSeason: 'Nov - Jan',
    majorSources: ['Traffic corridors', 'Industrial cluster outskirts'],
  },
  {
    name: 'Ahmedabad (Maninagar)',
    state: 'Gujarat',
    lat: 23.0225,
    lon: 72.5714,
    typicalWinterAQI: 210,
    smogProneSeason: 'Nov - Feb',
    majorSources: ['Vatva chemical belt', 'Heavy vehicular movement'],
  },
  {
    name: 'Kanpur (Civil Lines)',
    state: 'Uttar Pradesh',
    lat: 26.4499,
    lon: 80.3319,
    typicalWinterAQI: 360,
    smogProneSeason: 'Oct - Feb',
    majorSources: ['Leather tanneries', 'Thermal plants', 'Winter calm winds'],
  },
];

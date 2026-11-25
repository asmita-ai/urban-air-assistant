import { describe, it, expect } from 'vitest';
import { INDIAN_CITIES } from '../lib/cities';

describe('Indian Cities & Hubs Registry', () => {
  it('contains comprehensive coverage of top Indian smog corridors', () => {
    expect(INDIAN_CITIES.length).toBeGreaterThanOrEqual(12);

    const cityNames = INDIAN_CITIES.map((c) => c.name);
    expect(cityNames.some((n) => n.includes('Delhi'))).toBe(true);
    expect(cityNames.some((n) => n.includes('Mumbai'))).toBe(true);
    expect(cityNames.some((n) => n.includes('Kolkata'))).toBe(true);
    expect(cityNames.some((n) => n.includes('Patna'))).toBe(true);
    expect(cityNames.some((n) => n.includes('Lucknow'))).toBe(true);
  });

  it('has valid coordinates and non-empty landmarks for all cities', () => {
    INDIAN_CITIES.forEach((city) => {
      expect(city.lat).toBeGreaterThan(8.0);
      expect(city.lat).toBeLessThan(37.0);
      expect(city.lon).toBeGreaterThan(68.0);
      expect(city.lon).toBeLessThan(97.0);
      expect(city.landmark.length).toBeGreaterThan(2);
      expect(city.imageUrl).toMatch(/^https:\/\//);
      expect(city.typicalWinterAQI).toBeGreaterThan(0);
      expect(city.majorSources.length).toBeGreaterThan(0);
    });
  });
});

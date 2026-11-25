import { describe, it, expect } from 'vitest';
import { fetchAirQualityData } from '../lib/aqiService';

describe('AQI Service & Telemetry Engine', () => {
  it('retrieves air quality data with valid CPCB structure and timestamp', async () => {
    const data = await fetchAirQualityData('Delhi NCR (Central)', 28.6139, 77.209);

    expect(data).toBeDefined();
    expect(data.city).toBe('Delhi NCR (Central)');
    expect(data.country).toBe('India');
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.category).toBeDefined();
    expect(data.pollutants).toBeDefined();
    expect(data.pollutants.pm25).toBeGreaterThanOrEqual(0);
    expect(data.pollutants.pm10).toBeGreaterThanOrEqual(0);
    expect(data.hourly.length).toBeGreaterThanOrEqual(12);
    expect(data.source).toContain('CPCB');
    expect(data.timestamp.length).toBeGreaterThan(0);
  });

  it('handles unknown cities by defaulting coordinates gracefully without crashing', async () => {
    const fallbackData = await fetchAirQualityData('UnknownZoneXYZ');

    expect(fallbackData).toBeDefined();
    expect(fallbackData.aqi).toBeGreaterThan(0);
    expect(fallbackData.category).toBeDefined();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAirQualityData } from '../lib/aqiService';

describe('AQI Service & Telemetry Engine', () => {
  const mockAqiResponse = {
    current: {
      time: '2026-11-25T12:00:00Z',
      pm2_5: 85.5,
      pm10: 140.2,
      nitrogen_dioxide: 42.0,
      sulphur_dioxide: 18.0,
      carbon_monoxide: 1200,
      ozone: 55.0,
    },
    hourly: {
      time: Array.from(
        { length: 24 },
        (_, i) => `2026-11-25T${i.toString().padStart(2, '0')}:00:00Z`
      ),
      pm2_5: Array.from({ length: 24 }, () => 85.5),
    },
  };

  const mockWeatherResponse = {
    current: {
      temperature_2m: 21.5,
      relative_humidity_2m: 58,
      wind_speed_10m: 7.2,
    },
  };

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('air-quality')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockAqiResponse,
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockWeatherResponse,
        });
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves air quality data with valid CPCB structure and timestamp using mocked telemetry', async () => {
    const data = await fetchAirQualityData('Delhi NCR (Central)', 28.6139, 77.209);

    expect(data).toBeDefined();
    expect(data.city).toBe('Delhi NCR (Central)');
    expect(data.country).toBe('India');
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.category).toBeDefined();
    expect(data.pollutants).toBeDefined();
    expect(data.pollutants.pm25).toBeCloseTo(85.5);
    expect(data.pollutants.pm10).toBeCloseTo(140.2);
    expect(data.hourly.length).toBe(24);
    expect(data.source).toContain('CPCB');
    expect(data.timestamp.length).toBeGreaterThan(0);
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it('handles unknown cities by defaulting coordinates gracefully without crashing', async () => {
    const fallbackData = await fetchAirQualityData('UnknownZoneXYZ');

    expect(fallbackData).toBeDefined();
    expect(fallbackData.aqi).toBeGreaterThan(0);
    expect(fallbackData.category).toBeDefined();
  });

  it('gracefully degrades to verified fallback data when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline or DNS failure')));

    const data = await fetchAirQualityData('Kolkata (Network Test)', 22.5726, 88.3639);
    expect(data).toBeDefined();
    expect(data.city).toBe('Kolkata (Network Test)');
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.pollutants.pm25).toBeGreaterThan(0);
  });
});

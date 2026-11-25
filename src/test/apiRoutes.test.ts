import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getAQIRoute } from '../app/api/aqi/route';
import { POST as postRoutineRoute } from '../app/api/ai/routine/route';
import { POST as postChatRoute } from '../app/api/ai/chat/route';

describe('API Route Handlers & Runtime Guardrails', () => {
  const mockAqiResponse = {
    current: {
      time: '2026-11-25T12:00:00Z',
      pm2_5: 95.0,
      pm10: 160.0,
      nitrogen_dioxide: 40.0,
      sulphur_dioxide: 15.0,
      carbon_monoxide: 1000,
      ozone: 50.0,
    },
    hourly: {
      time: Array.from(
        { length: 24 },
        (_, i) => `2026-11-25T${i.toString().padStart(2, '0')}:00:00Z`
      ),
      pm2_5: Array.from({ length: 24 }, () => 95.0),
    },
  };

  const mockWeatherResponse = {
    current: {
      temperature_2m: 22,
      relative_humidity_2m: 55,
      wind_speed_10m: 6.5,
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

  describe('GET /api/aqi', () => {
    it('returns 200 with calibrated air quality data for a named city', async () => {
      const req = new NextRequest('http://localhost:3000/api/aqi?city=Mumbai');
      const res = await getAQIRoute(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.city).toContain('Mumbai');
      expect(json.aqi).toBeGreaterThan(0);
      expect(json.pollutants).toBeDefined();
    });

    it('safely handles non-numeric and NaN coordinates without crashing', async () => {
      const req = new NextRequest(
        'http://localhost:3000/api/aqi?city=Delhi&lat=not-a-number&lon=xyz'
      );
      const res = await getAQIRoute(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.city).toBe('Delhi NCR (Central)');
    });
  });

  describe('POST /api/ai/routine', () => {
    it('returns 400 Bad Request when request body fails Zod schema validation', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalidField: true }),
      });

      const res = await postRoutineRoute(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain('Invalid request payload');
      expect(json.issues).toBeDefined();
    });
  });

  describe('POST /api/ai/chat', () => {
    it('returns 400 Bad Request when chat message is empty', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });

      const res = await postChatRoute(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Invalid message payload.');
    });
  });
});

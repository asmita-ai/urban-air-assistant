import { useState, useEffect, useCallback } from 'react';
import { AQIData } from '@/types';

export function useAQI(initialCity: string = 'Delhi NCR (Central)') {
  const [currentCity, setCurrentCity] = useState<string>(initialCity);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAQIData = useCallback(async (city: string, lat?: number, lon?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/aqi?city=${encodeURIComponent(city)}`;
      if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch air quality (Status: ${res.status})`);
      }
      const data: AQIData = await res.json();
      setAqiData(data);
      setCurrentCity(data.city);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAQIData(initialCity);
  }, [initialCity, loadAQIData]);

  return {
    currentCity,
    setCurrentCity,
    aqiData,
    isLoading,
    error,
    loadAQIData,
  };
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getCachedWeather, cacheWeather } from '@/lib/db/indexedDB';
import { useUser } from './useUser';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  rain?: {
    "1h"?: number;
  };
}

export function useWeather() {
  const { user, loading: userLoading } = useUser();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const fetchWeather = useCallback(async (lat?: number, lon?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = '';
      // Prioritize the User's Saved Farm Location
      if (user?.location) {
        query = `q=${user.location}`;
      } else if (lat && lon) {
        query = `lat=${lat}&lon=${lon}`;
      } else {
        query = `q=Delhi`;
      }

      const res = await fetch(`/api/weather?${query}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      
      setWeather(data);
      await cacheWeather(data);
      setIsCached(false);
    } catch (err: any) {
      console.error("Weather fetch error:", err);
      setError(err.message || "Using offline data.");
      
      const cached = await getCachedWeather();
      if (cached) {
        setWeather(cached.data);
        setIsCached(true);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.location]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (userLoading) return;
    if (!isInitialLoad.current) return;
    isInitialLoad.current = false;

    const loadWeather = async () => {
      // 1. Try cache
      try {
        const cached = await getCachedWeather();
        if (cached && Date.now() - cached.timestamp < 3600000) {
          setWeather(cached.data);
          setIsCached(true);
          setLoading(false);
        }
      } catch (e) {}

      // 2. Try GPS or Saved Location with Timeout
      if (navigator.geolocation) {
        const timeoutId = setTimeout(() => {
          console.warn("Location request timed out, falling back to profile.");
          fetchWeather();
        }, 5000);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            fetchWeather(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {
            clearTimeout(timeoutId);
            console.error("Geolocation error:", err);
            fetchWeather();
          },
          { timeout: 5000 }
        );
      } else {
        fetchWeather();
      }
    };

    loadWeather();
  }, [userLoading, user?.location, fetchWeather]);

  return { weather, loading, error, isCached, refresh: fetchWeather };
}

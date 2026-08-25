import { useState, useEffect } from 'react';
import defaultData from '../data/data.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// In-memory global cache & promise deduplicator to prevent duplicate network calls
let globalSiteData = null;
let inFlightFetchPromise = null;

async function fetchSiteDataOnce() {
  if (globalSiteData) {
    return globalSiteData;
  }
  if (inFlightFetchPromise) {
    return inFlightFetchPromise;
  }

  inFlightFetchPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_BASE_URL}/api/content`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          globalSiteData = {
            data: {
              ...defaultData,
              ...json.data
            },
            isUsingBackend: true,
            isUsingSupabase: json.storage === 'supabase'
          };
          return globalSiteData;
        }
      }
    } catch (err) {
      console.warn('Express Backend API fetch notice: using local fallback', err.message);
    } finally {
      inFlightFetchPromise = null;
    }

    globalSiteData = {
      data: defaultData,
      isUsingBackend: false,
      isUsingSupabase: false
    };
    return globalSiteData;
  })();

  return inFlightFetchPromise;
}

export function useSiteData() {
  const [data, setData] = useState(globalSiteData?.data || defaultData);
  const [loading, setLoading] = useState(!globalSiteData);
  const [isUsingBackend, setIsUsingBackend] = useState(globalSiteData?.isUsingBackend || false);
  const [isUsingSupabase, setIsUsingSupabase] = useState(globalSiteData?.isUsingSupabase || false);

  const refresh = async () => {
    globalSiteData = null;
    inFlightFetchPromise = null;
    setLoading(true);
    const result = await fetchSiteDataOnce();
    setData(result.data);
    setIsUsingBackend(result.isUsingBackend);
    setIsUsingSupabase(result.isUsingSupabase);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    fetchSiteDataOnce().then((result) => {
      if (isMounted && result) {
        setData(result.data);
        setIsUsingBackend(result.isUsingBackend);
        setIsUsingSupabase(result.isUsingSupabase);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSiteData = async (newData) => {
    setData(newData);
    globalSiteData = {
      data: newData,
      isUsingBackend: true,
      isUsingSupabase: true
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update content via Express API');
      }
      setIsUsingBackend(true);
      setIsUsingSupabase(json.storage === 'supabase');
    } catch (err) {
      console.error('Failed to update content via Express API:', err);
      throw err;
    }
  };

  return {
    data,
    setData,
    loading,
    isUsingSupabase,
    isUsingBackend,
    updateSiteData,
    refresh
  };
}

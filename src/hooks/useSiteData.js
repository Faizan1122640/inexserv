import { useState, useEffect } from 'react';
import defaultData from '../data/data.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useSiteData() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [isUsingBackend, setIsUsingBackend] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setIsUsingBackend(true);
        }
      }
    } catch (err) {
      console.warn('Backend API notice: using fallback data.json', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateSiteData = async (newData) => {
    setData(newData);
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to update content');
      }
      setIsUsingBackend(true);
    } catch (err) {
      console.error('Failed to update content via backend:', err);
      throw err;
    }
  };

  return {
    data,
    setData,
    loading,
    isUsingSupabase: isUsingBackend,
    isUsingBackend,
    updateSiteData,
    refresh: fetchContent
  };
}

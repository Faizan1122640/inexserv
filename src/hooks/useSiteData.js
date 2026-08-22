import { useState, useEffect } from 'react';
import defaultData from '../data/data.json';
import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function useSiteData() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [isUsingBackend, setIsUsingBackend] = useState(false);

  const fetchContent = async () => {
    // 1. Try Express Backend API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${API_BASE_URL}/api/content`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setIsUsingBackend(true);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API fetch notice:', err.message);
    }

    // 2. Fallback to Direct Supabase DB fetch if Express API is unreachable
    if (supabase) {
      try {
        const { data: dbRow, error } = await supabase
          .from('site_content')
          .select('data')
          .eq('id', 'main')
          .single();

        if (!error && dbRow && dbRow.data) {
          setData(dbRow.data);
          setIsUsingBackend(true);
        }
      } catch (sbErr) {
        console.warn('Supabase DB fetch notice: using data.json fallback', sbErr.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateSiteData = async (newData) => {
    setData(newData);
    let success = false;

    // 1. Try Express Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setIsUsingBackend(true);
        success = true;
      }
    } catch (err) {
      console.warn('Backend API update failed, attempting Supabase direct update...', err.message);
    }

    // 2. Fallback to Direct Supabase DB update
    if (!success && supabase) {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 'main', data: newData, updated_at: new Date().toISOString() });
      if (error) throw error;
      setIsUsingBackend(true);
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

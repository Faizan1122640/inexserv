import { useState, useEffect } from 'react';
import defaultData from '../data/data.json';
import { supabase } from '../lib/supabaseClient';

export function useSiteData() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const fetchContent = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: dbRow, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'main')
        .single();

      if (error) {
        console.warn('Supabase fetch notice: using fallback data.json', error.message);
      } else if (dbRow && dbRow.data) {
        setData(dbRow.data);
        setIsUsingSupabase(true);
      }
    } catch (err) {
      console.warn('Supabase error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateSiteData = async (newData) => {
    setData(newData);
    if (supabase) {
      const { error } = await supabase
        .from('site_content')
        .upsert({ id: 'main', data: newData, updated_at: new Date().toISOString() });
      if (error) throw error;
      setIsUsingSupabase(true);
    }
  };

  return { data, setData, loading, isUsingSupabase, updateSiteData, refresh: fetchContent };
}

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://srpgbmsbgqippemtpdyw.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycGdibXNiZ3FpcHBlbXRwZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxOTAwMTEsImV4cCI6MjA1Mzc2NjAxMX0.sample';

let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('Supabase client creation error:', err.message);
}

module.exports = supabase;

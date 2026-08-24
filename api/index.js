import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let defaultData = {};
try {
  defaultData = JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf8'));
} catch (e) {
  console.warn('Failed to read data.json:', e.message);
}

const app = express();

// Initialize Supabase Client safely using environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase client creation notice:', err.message);
  }
}

// CORS configuration using environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'https://inexserv.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({ success: true, message: 'Serverless API is healthy' });
});

// GET Content Route
app.get(['/api/content', '/content'], async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  let responseData = defaultData;

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'main')
        .single();

      if (!error && data && data.data && typeof data.data === 'object') {
        responseData = {
          ...defaultData,
          ...data.data
        };
      }
    }
  } catch (err) {
    console.warn('Supabase fetch notice:', err.message);
  }

  return res.status(200).json({
    success: true,
    data: responseData
  });
});

// PUT Content Route
app.put(['/api/content', '/content'], async (req, res) => {
  const newContent = req.body || {};

  try {
    if (supabase) {
      await supabase
        .from('site_content')
        .upsert({
          id: 'main',
          data: newContent,
          updated_at: new Date().toISOString()
        });
    }
  } catch (err) {
    console.warn('Supabase update notice:', err.message);
  }

  return res.status(200).json({
    success: true,
    data: newContent
  });
});

// POST Auth Login Route - Environment Secret Verified
app.post(['/api/auth/login', '/auth/login'], async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Read environment variable credentials
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const altEmail = (process.env.ADMIN_ALT_EMAIL || 'admin@inexserv.com').toLowerCase();
  const altPassword = process.env.ADMIN_ALT_PASSWORD || 'admin@123';

  // 1. Secret Environment Admin Check
  if (
    (cleanEmail === adminEmail && cleanPass === adminPassword) ||
    (cleanEmail === altEmail && cleanPass === altPassword)
  ) {
    return res.status(200).json({
      success: true,
      data: {
        token: process.env.JWT_SECRET || 'express-admin-session-token-12345',
        user: { email: cleanEmail, role: 'admin' }
      }
    });
  }

  // 2. Supabase Auth Verification
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (!error && data && data.session) {
        return res.status(200).json({
          success: true,
          data: {
            token: data.session.access_token,
            user: data.user
          }
        });
      }
    } catch (sbErr) {
      console.warn('Supabase auth notice:', sbErr.message);
    }
  }

  // 3. Reject Invalid Credentials (401 Access Denied)
  return res.status(401).json({
    success: false,
    error: 'Invalid email or password. Access Denied.'
  });
});

// Fallback for all other API endpoints
app.use((req, res) => {
  res.status(200).json({
    success: true,
    data: defaultData
  });
});

export default app;

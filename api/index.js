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
const supabaseUrl = process.env.SUPABASE_URL || 'https://srpgbmsbgqippemtpdyw.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('Supabase client creation notice:', err.message);
  }
}

// CORS configuration
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
  res.status(200).json({ success: true, message: 'Serverless API is healthy', timestamp: new Date().toISOString() });
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

// POST Upload Route - Direct to Supabase Storage Bucket ('website-assets')
app.post(['/api/upload', '/upload'], async (req, res) => {
  try {
    const { fileBase64, fileName, fileType, bucket = 'website-assets' } = req.body || {};

    if (!fileBase64) {
      return res.status(400).json({
        success: false,
        error: 'No image payload provided (fileBase64 is required).'
      });
    }

    const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : (fileType || 'image/png');
    const base64Data = matches ? matches[2] : fileBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = fileName ? fileName.split('.').pop() || 'png' : 'png';
    const cleanBaseName = (fileName || 'asset')
      .replace(`.${ext}`, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueFileName = `${cleanBaseName}-${Date.now()}.${ext}`;
    const filePath = `uploads/${uniqueFileName}`;

    if (supabase && supabase.storage) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
          return res.status(200).json({
            success: true,
            source: 'supabase-storage',
            bucket,
            path: data.path,
            publicUrl: publicUrlData.publicUrl,
            fileName: uniqueFileName,
            size: buffer.length,
            mimeType
          });
        }
      } else if (error) {
        console.warn('Supabase storage upload error:', error.message);
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Supabase storage service unavailable. Please check credentials.'
    });
  } catch (uploadErr) {
    console.error('Serverless upload error:', uploadErr);
    return res.status(500).json({
      success: false,
      error: uploadErr.message || 'Upload failed'
    });
  }
});

// POST Auth Login Route
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

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const altEmail = (process.env.ADMIN_ALT_EMAIL || 'admin@inexserv.com').toLowerCase();
  const altPassword = process.env.ADMIN_ALT_PASSWORD || 'admin@123';

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

  return res.status(401).json({
    success: false,
    error: 'Invalid email or password. Access Denied.'
  });
});

export default app;

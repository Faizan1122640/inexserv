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

// GET Content Route - Real-time with zero caching
app.get(['/api/content', '/content'], async (req, res) => {
  // Prevent any Edge or Browser caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  let responseData = defaultData;
  let storage = 'fallback';

  try {
    if (supabase) {
      // 8s timeout to avoid any premature fallback on initial cold starts
      const fetchPromise = supabase
        .from('site_content')
        .select('data')
        .eq('id', 'main')
        .single();

      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ timeout: true }), 8000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);

      if (result && !result.timeout && !result.error && result.data && result.data.data && typeof result.data.data === 'object') {
        responseData = {
          ...defaultData,
          ...result.data.data
        };
        storage = 'supabase';
      } else if (result?.error) {
        console.warn('Supabase fetch query notice:', result.error.message);
      }
    }
  } catch (err) {
    console.warn('Supabase fetch notice:', err.message);
  }

  return res.status(200).json({
    success: true,
    data: responseData,
    storage
  });
});

// PUT Content Route
app.put(['/api/content', '/content'], async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const newContent = req.body || {};

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('site_content')
        .upsert({
          id: 'main',
          data: newContent,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('❌ Supabase upsert error:', error.message);
        return res.status(500).json({
          success: false,
          error: `Database write failed: ${error.message}`
        });
      }
      console.log('✅ Supabase site_content updated successfully');

      const savedData = data && data[0] && data[0].data ? data[0].data : newContent;
      return res.status(200).json({
        success: true,
        data: savedData,
        storage: 'supabase'
      });
    } else {
      console.warn('⚠️ Supabase client not initialized in PUT /api/content');
    }
  } catch (err) {
    console.error('❌ Supabase update exception:', err.message);
    return res.status(500).json({
      success: false,
      error: `Server update error: ${err.message}`
    });
  }

  return res.status(200).json({
    success: true,
    data: newContent,
    storage: 'fallback'
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

// POST Auth Login Route - Direct Supabase Auth Verification (No hardcoded credentials)
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

  if (!supabase) {
    return res.status(500).json({
      success: false,
      error: 'Authentication service is currently unavailable.'
    });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass
    });

    if (error || !data || !data.session) {
      return res.status(401).json({
        success: false,
        error: error ? error.message : 'Invalid email or password. Access Denied.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || 'admin',
          user_metadata: data.user.user_metadata
        }
      }
    });
  } catch (sbErr) {
    console.error('Supabase auth exception:', sbErr);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed. Please try again.'
    });
  }
});

export default app;

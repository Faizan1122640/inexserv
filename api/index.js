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

// In-memory leads storage fallback for serverless
let serverlessLeadsCache = [];

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
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  let responseData = defaultData;
  let storage = 'fallback';

  try {
    if (supabase) {
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

      const savedData = data && data[0] && data[0].data ? data[0].data : newContent;
      return res.status(200).json({
        success: true,
        data: savedData,
        storage: 'supabase'
      });
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

// ── LEADS ROUTES ──
// GET /api/leads - Fetch all leads
app.get(['/api/leads', '/leads'], async (req, res) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return res.status(200).json({
            success: true,
            data
          });
        }
      } catch (e) {
        console.warn('Supabase get leads notice:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: serverlessLeadsCache
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }
});

// Set of known columns to prevent redundant RPC calls
const knownColumns = new Set([
  'id',
  'created_at',
  'name',
  'full_name',
  'email',
  'phone',
  'company',
  'status',
  'notes',
  'form_data'
]);

// Helper to sanitize any field key into a valid safe PostgreSQL column identifier
function sanitizeColumnName(rawKey) {
  return String(rawKey || '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase to snake_case
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')         // replace non-alphanumeric with _
    .replace(/^_+|_+$/g, '')             // trim leading/trailing _
    .substring(0, 63);                  // PostgreSQL max identifier length is 63
}

// Ensure columns exist dynamically in Supabase leads table via RPC
async function ensureLeadColumnsExist(fieldKeys) {
  if (!supabase) return;
  for (const rawKey of fieldKeys) {
    const colName = sanitizeColumnName(rawKey);
    if (!colName || knownColumns.has(colName)) continue;

    try {
      const { error } = await supabase.rpc('add_lead_column', {
        column_name: colName,
        column_type: 'text'
      });

      if (!error) {
        knownColumns.add(colName);
        console.log(`✓ Supabase column '${colName}' ensured in leads table.`);
      } else {
        console.warn(`Notice ensuring column '${colName}':`, error.message);
      }
    } catch (e) {
      console.warn(`Dynamic column RPC error for '${colName}':`, e.message);
    }
  }
}

// POST /api/leads - Create lead with dynamic columns support
app.post(['/api/leads', '/leads'], async (req, res) => {
  try {
    const bodyData = req.body || {};
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const createdAt = new Date().toISOString();

    const name = bodyData.name || bodyData.fullName || 'Anonymous Inquiry';
    const email = bodyData.email || bodyData.workEmail || 'not-provided@inquiry.com';
    const phone = bodyData.phone || bodyData.phoneNumber || '';
    const company = bodyData.company || bodyData.organization || '';
    const status = bodyData.status || 'New';

    // Extract dynamic fields (both from root payload and formData if passed)
    const dynamicFields = { ...(bodyData.formData || {}), ...bodyData };
    delete dynamicFields.id;
    delete dynamicFields.created_at;
    delete dynamicFields.formData;

    // Collect all field keys that should be real columns in PostgreSQL
    const allFieldKeys = Object.keys(dynamicFields);

    // 1. Automatically ensure columns exist in Supabase at runtime
    await ensureLeadColumnsExist(allFieldKeys);

    let notes = bodyData.notes || bodyData.message || '';
    const extraFieldKeys = Object.keys(dynamicFields).filter(
      k => !['name', 'fullName', 'email', 'workEmail', 'phone', 'phoneNumber', 'company', 'organization', 'status', 'notes', 'message'].includes(k)
    );

    if (extraFieldKeys.length > 0) {
      const formattedExtras = extraFieldKeys
        .map(k => `• ${k.charAt(0).toUpperCase() + k.slice(1)}: ${dynamicFields[k]}`)
        .join('\n');
      notes = notes ? `${notes}\n\n[Custom Form Fields]:\n${formattedExtras}` : `[Custom Form Fields]:\n${formattedExtras}`;
    }

    const fullLead = {
      id: leadId,
      name,
      email,
      phone,
      company,
      status,
      notes,
      ...dynamicFields,
      formData: dynamicFields,
      created_at: createdAt
    };

    if (supabase) {
      try {
        const insertPayload = {
          name,
          email,
          phone,
          company,
          status,
          notes,
          form_data: dynamicFields
        };

        // Add each dynamic field as a direct column property
        for (const [k, v] of Object.entries(dynamicFields)) {
          const colName = sanitizeColumnName(k);
          if (colName && !insertPayload[colName]) {
            insertPayload[colName] = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
          }
        }

        const { data, error } = await supabase
          .from('leads')
          .insert([insertPayload])
          .select();

        if (!error && data && data.length > 0) {
          return res.status(201).json({
            success: true,
            data: { ...data[0], formData: data[0].form_data || fullLead.formData }
          });
        } else if (error) {
          console.warn('Supabase dynamic insert notice (falling back):', error.message);
          const standardPayload = {
            name,
            email,
            phone,
            company,
            status,
            notes,
            form_data: dynamicFields
          };
          const fallbackRes = await supabase.from('leads').insert([standardPayload]).select();
          if (!fallbackRes.error && fallbackRes.data && fallbackRes.data.length > 0) {
            return res.status(201).json({
              success: true,
              data: { ...fallbackRes.data[0], formData: fallbackRes.data[0].form_data || fullLead.formData }
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase serverless insert error:', sbErr.message);
      }
    }

    serverlessLeadsCache.unshift(fullLead);
    return res.status(201).json({
      success: true,
      data: fullLead
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to submit inquiry'
    });
  }
});

// DELETE /api/leads/:id
app.delete(['/api/leads/:id', '/leads/:id'], async (req, res) => {
  const { id } = req.params;
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id)
          .select();

        if (!error && data) {
          return res.status(200).json({ success: true, data: data[0] });
        }
      } catch (e) {
        console.warn('Supabase delete lead error:', e.message);
      }
    }

    serverlessLeadsCache = serverlessLeadsCache.filter(l => String(l.id) !== String(id));
    return res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
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

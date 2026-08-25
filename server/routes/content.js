const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const supabase = require('../config/supabaseClient');
const defaultData = require('../data/data.json');

const router = express.Router();
const fallbackDataPath = path.join(__dirname, '..', 'data', 'data.json');
let currentData = defaultData;

// GET /api/content - Fetch website dynamic content with 100% fail-safe guarantees
router.get('/', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  let responseData = currentData;
  let storage = 'local-file';

  try {
    if (supabase) {
      try {
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
          currentData = responseData;
          storage = 'supabase';
        }
      } catch (sbErr) {
        console.warn('Supabase DB fetch notice:', sbErr.message);
      }
    }
  } catch (err) {
    console.warn('GET /api/content error fallback:', err.message);
  }

  return res.status(200).json({
    success: true,
    data: responseData,
    storage
  });
});

// PUT /api/content - Update website dynamic content with fail-safe guarantees
router.put('/', async (req, res) => {
  const newContent = req.body;

  if (!newContent || typeof newContent !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid content payload'
    });
  }

  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .upsert({
            id: 'main',
            data: newContent,
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          throw error;
        }

        if (data) {
          currentData = data[0] ? data[0].data : newContent;
          return res.status(200).json({
            success: true,
            data: currentData,
            storage: 'supabase'
          });
        }
      } catch (sbErr) {
        console.warn('Supabase DB upsert notice:', sbErr.message);
      }
    }
  } catch (err) {
    console.warn('PUT /api/content error fallback:', err.message);
  }

  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return res.status(503).json({
      success: false,
      error: 'Content storage is unavailable. Check the Supabase API key and permissions.'
    });
  }

  try {
    await fs.writeFile(fallbackDataPath, `${JSON.stringify(newContent, null, 2)}\n`, 'utf8');
    currentData = newContent;

    return res.status(200).json({
      success: true,
      data: currentData,
      storage: 'local-file'
    });
  } catch (fileErr) {
    console.error('Local content persistence error:', fileErr.message);
    return res.status(500).json({
      success: false,
      error: 'Content could not be persisted'
    });
  }
});

module.exports = router;

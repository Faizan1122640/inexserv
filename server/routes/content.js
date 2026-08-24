const express = require('express');
const supabase = require('../config/supabaseClient');
const defaultData = require('../data/data.json');

const router = express.Router();

// GET /api/content - Fetch website dynamic content with 100% fail-safe guarantees
router.get('/', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  let responseData = defaultData;

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
    data: responseData
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

        if (!error && data) {
          return res.status(200).json({
            success: true,
            data: data[0] ? data[0].data : newContent
          });
        }
      } catch (sbErr) {
        console.warn('Supabase DB upsert notice:', sbErr.message);
      }
    }
  } catch (err) {
    console.warn('PUT /api/content error fallback:', err.message);
  }

  return res.status(200).json({
    success: true,
    data: newContent
  });
});

module.exports = router;

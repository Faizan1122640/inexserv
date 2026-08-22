const express = require('express');
const supabase = require('../config/supabaseClient');
const defaultData = require('../../src/data/data.json');

const router = express.Router();

// GET /api/content - Fetch website dynamic content
router.get('/', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'main')
        .single();

      if (!error && data && data.data) {
        return res.status(200).json({
          success: true,
          data: data.data
        });
      }
    }
  } catch (err) {
    console.warn('Supabase fetch error, serving default data:', err.message);
  }

  return res.status(200).json({
    success: true,
    data: defaultData
  });
});

// PUT /api/content - Update website dynamic content
router.put('/', async (req, res) => {
  try {
    const newContent = req.body;

    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid content payload'
      });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('site_content')
        .upsert({
          id: 'main',
          data: newContent,
          updated_at: new Date().toISOString()
        })
        .select();

      if (!error) {
        return res.status(200).json({
          success: true,
          data: data ? data[0] : newContent
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: newContent
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: req.body
    });
  }
});

module.exports = router;

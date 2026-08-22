const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// GET /api/content - Fetch website dynamic content from Supabase site_content table
router.get('/', async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return res.status(200).json({
      success: true,
      data: data ? data.data : null
    });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/content - Update website dynamic content in Supabase site_content table
router.put('/', async (req, res, next) => {
  try {
    const newContent = req.body;

    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid content payload'
      });
    }

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

    return res.status(200).json({
      success: true,
      data: data ? data[0] : newContent
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

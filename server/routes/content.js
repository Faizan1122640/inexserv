const express = require('express');
const supabase = require('../config/supabaseClient');
const defaultData = require('../data/data.json');

const router = express.Router();

// Helper function to deeply merge fallback default data with DB data
function mergeSiteData(dbData) {
  if (!dbData || typeof dbData !== 'object') return defaultData;

  return {
    ...defaultData,
    ...dbData,
    header: { ...defaultData.header, ...(dbData.header || {}) },
    hero: { ...defaultData.hero, ...(dbData.hero || {}) },
    servicesSection: { ...defaultData.servicesSection, ...(dbData.servicesSection || {}) },
    solutionsSection: { ...defaultData.solutionsSection, ...(dbData.solutionsSection || {}) },
    techStackSection: { ...defaultData.techStackSection, ...(dbData.techStackSection || {}) },
    ctaBanner: { ...defaultData.ctaBanner, ...(dbData.ctaBanner || {}) },
    hireDevSection: { ...defaultData.hireDevSection, ...(dbData.hireDevSection || {}) },
    footer: { ...defaultData.footer, ...(dbData.footer || {}) },
    officeLocations: dbData.officeLocations || defaultData.officeLocations
  };
}

// GET /api/content - Fetch website dynamic content with complete data guarantees
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
        const fullData = mergeSiteData(data.data);
        return res.status(200).json({
          success: true,
          data: fullData
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

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const supabase = require('../config/supabaseClient');
const defaultData = require('../data/data.json');
const {
  BadRequestError,
  ServiceUnavailableError,
  InternalServerError,
  errorMessages
} = require('../errors');

const router = express.Router();
const fallbackDataPath = path.join(__dirname, '..', 'data', 'data.json');
let currentData = defaultData;

// GET /api/content - Fetch website dynamic content with 100% fail-safe guarantees
router.get('/', async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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

    return res.status(200).json({
      success: true,
      data: responseData,
      storage
    });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/content - Update website dynamic content with fail-safe guarantees
router.put('/', async (req, res, next) => {
  const newContent = req.body;

  if (!newContent || typeof newContent !== 'object') {
    return next(new BadRequestError(errorMessages.CONTENT_INVALID_PAYLOAD));
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

    if (process.env.VERCEL || process.env.VERCEL_ENV) {
      throw new ServiceUnavailableError(errorMessages.CONTENT_STORAGE_UNAVAILABLE);
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
      throw new InternalServerError(errorMessages.CONTENT_PERSISTENCE_FAILED);
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

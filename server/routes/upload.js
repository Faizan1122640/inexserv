const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabaseClient');
const { BadRequestError, errorMessages } = require('../errors');

// Ensure local uploads directory exists as a fail-safe fallback
const localUploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(localUploadsDir)) {
  try {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  } catch (e) {
    console.warn('Upload directory notice:', e.message);
  }
}

/**
 * POST /api/upload
 * Senior-level fail-safe image uploader supporting:
 * 1. Supabase Storage Bucket ('website-assets', 'cms-images', 'public', etc.)
 * 2. Local public fallback for 100% uninterrupted offline & local development
 */
router.post('/', async (req, res, next) => {
  try {
    const { fileBase64, fileName, fileType, bucket = 'website-assets' } = req.body;

    if (!fileBase64) {
      throw new BadRequestError(errorMessages.UPLOAD_NO_FILE);
    }

    // Clean base64 string
    const matches = fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : (fileType || 'image/png');
    const base64Data = matches ? matches[2] : fileBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate web-safe unique filename
    const ext = path.extname(fileName || '') || `.${mimeType.split('/')[1] || 'png'}`;
    const cleanBaseName = (fileName || 'asset')
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueFileName = `${cleanBaseName}-${Date.now()}${ext}`;

    // ── Tier 1: Try Direct Supabase Storage Bucket ──
    if (supabase && supabase.storage) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(`uploads/${uniqueFileName}`, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(`uploads/${uniqueFileName}`);

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
          console.warn('Supabase storage bucket notice:', error.message);
        }
      } catch (sbStorageErr) {
        console.warn('Supabase storage call notice:', sbStorageErr.message);
      }
    }

    // ── Tier 2: Local Web Public Assets Fallback ──
    const targetFilePath = path.join(localUploadsDir, uniqueFileName);
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return res.status(200).json({
      success: true,
      source: 'local-public',
      publicUrl,
      fileName: uniqueFileName,
      size: buffer.length,
      mimeType,
      message: 'Image uploaded successfully to public web directory'
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

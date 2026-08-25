import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Converts a File object to a Base64 string
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Uploads an image to Supabase Storage Bucket ('website-assets')
 * @param {File} file - The file to upload
 * @param {string} [bucket='website-assets'] - The Supabase storage bucket name
 * @returns {Promise<{ success: boolean, publicUrl: string, fileName: string, source: string }>}
 */
export async function uploadImageToStorage(file, bucket = 'website-assets') {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Validate format
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Unsupported image format (${file.type}). Please upload PNG, JPG, WEBP, AVIF, or SVG.`);
  }

  // Validate size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File size is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max limit is 10MB.`);
  }

  // ── Tier 1: Backend Secure API Upload to Supabase Storage Bucket ──
  try {
    const fileBase64 = await fileToBase64(file);
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileBase64,
        fileName: file.name,
        fileType: file.type,
        bucket
      })
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.publicUrl) {
        console.log('✅ Image stored in Supabase Bucket:', json.publicUrl);
        return {
          success: true,
          publicUrl: json.publicUrl,
          fileName: json.fileName,
          source: json.source || 'supabase-storage',
          bucket: json.bucket || bucket
        };
      }
    }
  } catch (backendErr) {
    console.warn('Backend API upload notice, trying direct client:', backendErr.message);
  }

  // ── Tier 2: Direct Frontend Supabase Client Upload Fallback ──
  if (supabase && supabase.storage) {
    try {
      const ext = file.name.split('.').pop() || 'png';
      const cleanName = file.name
        .replace(`.${ext}`, '')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-');
      const uniqueFileName = `${cleanName}-${Date.now()}.${ext}`;
      const filePath = `uploads/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        if (urlData && urlData.publicUrl) {
          console.log('✅ Direct Supabase upload successful:', urlData.publicUrl);
          return {
            success: true,
            publicUrl: urlData.publicUrl,
            fileName: uniqueFileName,
            source: 'supabase-client',
            bucket
          };
        }
      }
    } catch (sbErr) {
      console.error('Supabase storage client exception:', sbErr.message);
      throw new Error(sbErr.message);
    }
  }

  throw new Error('Upload failed. Please check your network connection.');
}

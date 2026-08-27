const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// POST /api/auth/login - Direct Supabase Auth Verification (No hardcoded credentials)
router.post('/login', async (req, res) => {
  try {
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
        error: 'Supabase authentication service unavailable'
      });
    }

    // Direct Supabase Auth verification
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
  } catch (err) {
    console.error('Login error:', err);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed. Please check your credentials.'
    });
  }
});

module.exports = router;

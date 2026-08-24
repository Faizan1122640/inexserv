const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// POST /api/auth/login - Admin Login endpoint
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

    // Read secret credentials from process.env
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const altEmail = (process.env.ADMIN_ALT_EMAIL || 'admin@inexserv.com').toLowerCase();
    const altPassword = process.env.ADMIN_ALT_PASSWORD || 'admin@123';

    // 1. Secret Environment Admin Check
    if (
      (cleanEmail === adminEmail && cleanPass === adminPassword) ||
      (cleanEmail === altEmail && cleanPass === altPassword)
    ) {
      return res.status(200).json({
        success: true,
        data: {
          token: process.env.JWT_SECRET || 'express-admin-session-token-12345',
          user: { email: cleanEmail, role: 'admin' }
        }
      });
    }

    // 2. Supabase Auth verification
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (!error && data && data.session) {
        return res.status(200).json({
          success: true,
          data: {
            token: data.session.access_token,
            user: data.user
          }
        });
      }
    }

    // 3. Reject Invalid Credentials
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password. Access Denied.'
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password. Access Denied.'
    });
  }
});

module.exports = router;

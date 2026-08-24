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

    // 1. Demo / fallback credentials check
    const validEmails = ['admin@gmail.com', 'admin@inexserv.com'];
    const validPasswords = ['admin123', 'admin@123'];

    if (validEmails.includes(cleanEmail) && validPasswords.includes(password)) {
      return res.status(200).json({
        success: true,
        data: {
          token: 'express-admin-session-token-12345',
          user: { email: cleanEmail, role: 'admin' }
        }
      });
    }

    // 2. Supabase Auth verification
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
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

    // 3. Reject Wrong Credentials
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

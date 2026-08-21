const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// POST /api/auth/login - Admin Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Demo fallback credentials
    if (email === 'admin@inexserv.com' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        data: {
          token: 'demo-express-jwt-token-12345',
          user: { email: 'admin@inexserv.com', role: 'admin' }
        }
      });
    }

    // Supabase Auth verification
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      return res.status(401).json({
        success: false,
        error: error ? error.message : 'Invalid credentials'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        token: data.session.access_token,
        user: data.user
      }
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

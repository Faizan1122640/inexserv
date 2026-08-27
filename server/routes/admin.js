const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// GET /api/admin/:email - Securely query admin details from Supabase Auth
router.get('/:email', async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email parameter is required'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Database client unavailable'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check Supabase Auth Users
    const { data, error } = await supabase.auth.admin.listUsers();
    if (!error && data && data.users) {
      const user = data.users.find(
        (u) => u.email && u.email.toLowerCase() === cleanEmail
      );
      if (user) {
        return res.status(200).json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            role: 'admin',
            created_at: user.created_at
          }
        });
      }
    }

    return res.status(404).json({
      success: false,
      error: `Admin with email '${email}' not found`
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// GET /api/admin/:email - Securely query admin details by email
router.get('/:email', async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email parameter is required'
      });
    }

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: `Admin with email '${email}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

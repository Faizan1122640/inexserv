const express = require('express');
const supabase = require('../config/supabaseClient');
const {
  BadRequestError,
  UnauthorizedError,
  ServiceUnavailableError,
  errorMessages
} = require('../errors');

const router = express.Router();

// POST /api/auth/login - Direct Supabase Auth Verification
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new BadRequestError(errorMessages.AUTH_EMAIL_PASSWORD_REQUIRED);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!supabase) {
      throw new ServiceUnavailableError(errorMessages.AUTH_SERVICE_UNAVAILABLE);
    }

    // Direct Supabase Auth verification
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass
    });

    if (error || !data || !data.session) {
      throw new UnauthorizedError(
        errorMessages.AUTH_INVALID_CREDENTIALS,
        error ? error.message : undefined
      );
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
    return next(err);
  }
});

module.exports = router;

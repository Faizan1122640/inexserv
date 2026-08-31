/**
 * Global Express Error Handling Middleware
 * 
 * Captures all errors thrown or passed to next(err) in any route,
 * formatting them into a unified JSON structure.
 */

const { errorMessages } = require('../errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // If headers are already sent to client, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || errorMessages.INTERNAL_SERVER_ERROR.message;

  // Handle JSON parse syntax errors (malformed body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    code = 'MALFORMED_JSON';
    message = 'Malformed JSON request body received.';
  }

  // Handle Zod schema validation errors
  if (err.name === 'ZodError' && Array.isArray(err.errors)) {
    statusCode = 400;
    code = errorMessages.VALIDATION_ERROR.code;
    message = `Validation Error: ${err.errors.map((e) => e.message).join(', ')}`;
  }

  // Log 500+ unexpected server errors for debugging
  if (statusCode >= 500) {
    console.error(`❌ [Server Error] [${code}] at ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

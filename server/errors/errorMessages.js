/**
 * Centralized Error Messages & Error Codes Dictionary
 * 
 * Edit any user-facing error message or status code here without modifying route files.
 */

module.exports = {
  // ── Authentication & Authorization Errors ──
  AUTH_REQUIRED: {
    statusCode: 401,
    code: 'AUTH_001',
    message: 'Authentication required. Please log in.'
  },
  AUTH_INVALID_CREDENTIALS: {
    statusCode: 401,
    code: 'AUTH_002',
    message: 'Invalid email or password. Access Denied.'
  },
  AUTH_EMAIL_PASSWORD_REQUIRED: {
    statusCode: 400,
    code: 'AUTH_003',
    message: 'Email and password are required.'
  },
  AUTH_FORBIDDEN: {
    statusCode: 403,
    code: 'AUTH_004',
    message: 'You do not have permission to perform this action.'
  },
  AUTH_SERVICE_UNAVAILABLE: {
    statusCode: 500,
    code: 'AUTH_005',
    message: 'Authentication service is currently unavailable. Please try again later.'
  },
  ADMIN_NOT_FOUND: {
    statusCode: 404,
    code: 'AUTH_006',
    message: 'Admin user not found.'
  },

  // ── Validation Errors ──
  VALIDATION_ERROR: {
    statusCode: 400,
    code: 'VAL_001',
    message: 'Validation failed. Please check your inputs.'
  },
  INVALID_PAYLOAD: {
    statusCode: 400,
    code: 'VAL_002',
    message: 'Invalid request payload provided.'
  },
  INVALID_EMAIL: {
    statusCode: 400,
    code: 'VAL_003',
    message: 'Please provide a valid email address.'
  },

  // ── Leads Management Errors ──
  LEAD_NOT_FOUND: {
    statusCode: 404,
    code: 'LEAD_001',
    message: 'Lead record not found.'
  },
  LEAD_CREATE_FAILED: {
    statusCode: 500,
    code: 'LEAD_002',
    message: 'Failed to create new lead.'
  },
  LEAD_DELETE_FAILED: {
    statusCode: 500,
    code: 'LEAD_003',
    message: 'Failed to delete lead record.'
  },

  // ── Content & CMS Errors ──
  CONTENT_INVALID_PAYLOAD: {
    statusCode: 400,
    code: 'CONTENT_001',
    message: 'Invalid content data payload.'
  },
  CONTENT_STORAGE_UNAVAILABLE: {
    statusCode: 503,
    code: 'CONTENT_002',
    message: 'Content storage is unavailable. Check database connection and permissions.'
  },
  CONTENT_PERSISTENCE_FAILED: {
    statusCode: 500,
    code: 'CONTENT_003',
    message: 'Content could not be persisted to storage.'
  },

  // ── File & Image Upload Errors ──
  UPLOAD_NO_FILE: {
    statusCode: 400,
    code: 'UPLOAD_001',
    message: 'No image file payload provided (fileBase64 is required).'
  },
  UPLOAD_FAILED: {
    statusCode: 500,
    code: 'UPLOAD_002',
    message: 'Failed to upload image file. Please try again.'
  },

  // ── Route & General Server Errors ──
  ROUTE_NOT_FOUND: {
    statusCode: 404,
    code: 'SRV_001',
    message: 'The requested API endpoint was not found.'
  },
  DATABASE_UNAVAILABLE: {
    statusCode: 500,
    code: 'SRV_002',
    message: 'Database client service unavailable.'
  },
  CORS_VIOLATION: {
    statusCode: 403,
    code: 'SRV_003',
    message: 'CORS policy violation: Origin is not allowed.'
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    code: 'SRV_500',
    message: 'An unexpected internal server error occurred.'
  }
};

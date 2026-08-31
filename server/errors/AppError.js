/**
 * Custom Application Error Classes
 * 
 * Provides structured HTTP status codes, error codes, and stack traces.
 */

class AppError extends Error {
  /**
   * @param {Object|string} errorDef - Error definition object from errorMessages or string message
   * @param {string} [customMessage] - Optional custom message to override the default
   * @param {number} [statusCode=500] - HTTP status code (if errorDef is a string)
   * @param {string} [code='APP_ERROR'] - Custom error code (if errorDef is a string)
   */
  constructor(errorDef, customMessage = null, statusCode = 500, code = 'APP_ERROR') {
    if (typeof errorDef === 'object' && errorDef !== null) {
      super(customMessage || errorDef.message || 'Application Error');
      this.statusCode = errorDef.statusCode || statusCode;
      this.code = errorDef.code || code;
    } else {
      super(customMessage || errorDef || 'Application Error');
      this.statusCode = statusCode;
      this.code = code;
    }

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(errorDef = 'Bad Request', customMessage = null) {
    super(errorDef, customMessage, 400, 'BAD_REQUEST');
  }
}

class UnauthorizedError extends AppError {
  constructor(errorDef = 'Unauthorized', customMessage = null) {
    super(errorDef, customMessage, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(errorDef = 'Forbidden', customMessage = null) {
    super(errorDef, customMessage, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(errorDef = 'Resource Not Found', customMessage = null) {
    super(errorDef, customMessage, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(errorDef = 'Conflict', customMessage = null) {
    super(errorDef, customMessage, 409, 'CONFLICT');
  }
}

class InternalServerError extends AppError {
  constructor(errorDef = 'Internal Server Error', customMessage = null) {
    super(errorDef, customMessage, 500, 'INTERNAL_SERVER_ERROR');
  }
}

class ServiceUnavailableError extends AppError {
  constructor(errorDef = 'Service Unavailable', customMessage = null) {
    super(errorDef, customMessage, 503, 'SERVICE_UNAVAILABLE');
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError
};

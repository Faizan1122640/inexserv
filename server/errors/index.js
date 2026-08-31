/**
 * Errors Index Module
 * 
 * Single import point for all error definitions and custom error classes.
 * Example:
 *   const { AppError, errorMessages, NotFoundError } = require('../errors');
 */

const errorMessages = require('./errorMessages');
const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError
} = require('./AppError');

module.exports = {
  errorMessages,
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError
};

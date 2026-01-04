/**
 * Safe error handler utility to prevent exposing database internals to users.
 * Logs full error details for debugging while returning safe messages to users.
 */

interface DatabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

/**
 * Converts database/API errors to user-safe messages without exposing internal details.
 * @param error - The error object from Supabase or other sources
 * @returns A safe error message suitable for displaying to users
 */
export function getSafeErrorMessage(error: unknown): string {
  // Log full error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error('Database error:', error);
  }

  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const dbError = error as DatabaseError;
  const code = dbError.code;
  const message = dbError.message?.toLowerCase() || '';

  // PostgreSQL error codes - map to safe messages
  // https://www.postgresql.org/docs/current/errcodes-appendix.html

  // Unique violation
  if (code === '23505') {
    return 'This record already exists. Please check for duplicates.';
  }

  // Foreign key violation
  if (code === '23503') {
    return 'Cannot complete this action - a related record was not found.';
  }

  // Not null violation
  if (code === '23502') {
    return 'Required information is missing. Please fill in all required fields.';
  }

  // Check constraint violation
  if (code === '23514' || message.includes('violates check constraint')) {
    return 'The provided data is invalid. Please check your input.';
  }

  // RLS policy violation
  if (code === '42501' || message.includes('policy')) {
    return 'You do not have permission to perform this action.';
  }

  // Authentication errors
  if (message.includes('jwt') || message.includes('token') || message.includes('auth')) {
    return 'Your session has expired. Please sign in again.';
  }

  // Connection errors
  if (message.includes('connection') || message.includes('timeout')) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  // Rate limiting
  if (code === '429' || message.includes('rate limit') || message.includes('too many')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Default safe message
  return 'An error occurred. Please try again or contact support if the issue persists.';
}

/**
 * Checks if an error is a validation error that's safe to show to users
 * (e.g., Zod validation errors with field-level messages)
 */
export function isValidationError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  
  // Check for Zod-like error structure
  return 'errors' in error && Array.isArray((error as { errors: unknown[] }).errors);
}

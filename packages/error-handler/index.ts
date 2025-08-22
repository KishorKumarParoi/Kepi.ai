export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      this.details = details;
      Error.captureStackTrace(this);
    }
  }
}
// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resources not found") {
    super(message, 404);
  }
}

// validation Error (use for Joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true);
  }
}

// Authentication Error
export class AuthError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

// Forbidden Error (For Insufficient Permissions)
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403);
  }
}

// Database Error (For MongoDB/Postgres Errors)
export class DatabaseError extends AppError {
  constructor(message = "Database Error", details?: any) {
    super(message, 500, true, details);
  }
}

// Rate Limit Error (if user exceeds API limits)
export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(message, 429);
  }
}

// Bad Request Error (for malformed requests)
export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: any) {
    super(message, 400, true, details);
  }
}

// Conflict Error (for resource conflicts, e.g., duplicate entries)
export class ConflictError extends AppError {
  constructor(message = "Conflict error", details?: any) {
    super(message, 409, true, details);
  }
}

// Service Unavailable Error (for downtime or maintenance)
export class ServiceUnavailableError extends AppError {
  constructor(message = "Service unavailable", details?: any) {
    super(message, 503, true, details);
  }
}

// Timeout Error (for request timeouts)
export class TimeoutError extends AppError {
  constructor(message = "Request timed out", details?: any) {
    super(message, 408, true, details);
  }
}

// Payload Too Large Error (for large request bodies)
export class PayloadTooLargeError extends AppError {
  constructor(message = "Payload too large", details?: any) {
    super(message, 413, true, details);
  }
}

// Unsupported Media Type Error (for invalid content-type)
export class UnsupportedMediaTypeError extends AppError {
  constructor(message = "Unsupported media type", details?: any) {
    super(message, 415, true, details);
  }
}

// Gone Error (for resources that are no longer available)
export class GoneError extends AppError {
  constructor(message = "Resource is gone", details?: any) {
    super(message, 410, true, details);
  }
}

// Precondition Failed Error (for failed preconditions)
export class PreconditionFailedError extends AppError {
  constructor(message = "Precondition failed", details?: any) {
    super(message, 412, true, details);
  }
}

// Unprocessable Entity Error (for semantic errors in request)
export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable entity", details?: any) {
    super(message, 422, true, details);
  }
}

// Internal Server Error (generic server error)
export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details?: any) {
    super(message, 500, false, details);
  }
}

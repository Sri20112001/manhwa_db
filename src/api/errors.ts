export interface ApiErrorOptions {
  status?: number;
  code?: string;
  requestId?: string;
  retryAfter?: number;
  details?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | undefined;
  readonly retryAfter: number | undefined;
  readonly details: unknown;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code ?? 'UNKNOWN_ERROR';
    this.requestId = options.requestId;
    this.retryAfter = options.retryAfter;
    this.details = options.details;
    if (options.cause !== undefined) this.cause = options.cause;
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Your API key is invalid or has been revoked.', options: ApiErrorOptions = {}) {
    super(message, { code: 'INVALID_API_KEY', status: 401, ...options });
    this.name = 'AuthError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests.', options: ApiErrorOptions = {}) {
    super(message, { code: 'RATE_LIMITED', status: 429, ...options });
    this.name = 'RateLimitError';
  }

  get retryAfterSeconds(): number {
    return this.retryAfter ?? 60;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network request failed.', options: ApiErrorOptions = {}) {
    super(message, { code: 'NETWORK_ERROR', status: 0, ...options });
    this.name = 'NetworkError';
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function errorMessage(value: unknown): string {
  if (value instanceof ApiError) return value.message;
  if (value instanceof Error) return value.message;
  return 'Something went wrong.';
}

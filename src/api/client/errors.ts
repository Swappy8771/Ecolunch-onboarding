/**
 * API error types + normalization. One consistent error shape
 * (`ApiError`) for every failure — network, timeout, validation, auth,
 * or server — classified by `getErrorKind()` rather than represented as
 * five different error classes, mirroring the backend's own single
 * `ApiError` response contract (`{ message, details? }`, confirmed
 * against `backend/src/middleware/errorHandler.ts`: Zod validation
 * failures, thrown `ApiError`s, and unhandled exceptions all normalize to
 * that same two-field shape server-side already).
 */

export interface ApiErrorBody {
  message?: string
  /** Present on Zod validation failures (`err.flatten()`) and any `ApiError.details` the backend threw with. */
  details?: unknown
  [key: string]: unknown
}

export type ApiErrorKind =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'conflict'
  | 'server'
  | 'unknown'

export class ApiError extends Error {
  /** `0` for a network/timeout failure that never reached the server — no real HTTP status exists for those. */
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }

  /** The backend's `details` field, if the response body had one (Zod's `.flatten()` shape on validation errors). */
  get details(): unknown {
    return isPlainErrorBody(this.body) ? this.body.details : undefined
  }
}

function isPlainErrorBody(body: unknown): body is ApiErrorBody {
  return typeof body === 'object' && body !== null
}

/** Builds an ApiError from a parsed (possibly non-JSON) response body. */
export function normalizeError(status: number, body: unknown): ApiError {
  const message =
    isPlainErrorBody(body) && typeof body.message === 'string' ? body.message : `Request failed (${status})`

  return new ApiError(message, status, body)
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Classifies an `ApiError` by status code into the one shape every
 * caller should branch on, instead of comparing raw status numbers
 * throughout the app.
 */
export function getErrorKind(error: ApiError): ApiErrorKind {
  if (error.status === 0) return 'network'
  if (error.status === 400) return 'validation'
  if (error.status === 401) return 'authentication'
  if (error.status === 403) return 'authorization'
  if (error.status === 404) return 'not_found'
  if (error.status === 409) return 'conflict'
  if (error.status >= 500) return 'server'
  return 'unknown'
}

export function isUnauthorized(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 401
}

export function isValidationError(error: unknown): error is ApiError {
  return isApiError(error) && getErrorKind(error) === 'validation'
}

export function isNetworkError(error: unknown): error is ApiError {
  return isApiError(error) && getErrorKind(error) === 'network'
}

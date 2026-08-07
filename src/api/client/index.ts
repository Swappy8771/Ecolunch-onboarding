export { httpClient } from './http'
export type { RequestOptions, QueryParams } from './http'

export { API_BASE_URL, DEFAULT_TIMEOUT_MS } from './config'

export {
  ApiError,
  normalizeError,
  isApiError,
  isUnauthorized,
  isValidationError,
  isNetworkError,
  getErrorKind,
} from './errors'
export type { ApiErrorBody, ApiErrorKind } from './errors'

export { getAuthHeader, setUnauthorizedHandler, handleUnauthorized } from './auth'

export { queryClient } from './queryClient'

/**
 * The one shared HTTP client. Every module's `services/api.ts` calls
 * through this — no module calls `fetch` directly. Owns: base URL
 * resolution, header construction (including auth injection), JSON
 * parsing, timeout handling, and error normalization. No module-specific
 * logic lives here.
 */
import { API_BASE_URL, DEFAULT_TIMEOUT_MS } from './config'
import { normalizeError, ApiError } from './errors'
import { getAuthHeader, handleUnauthorized } from './auth'
import { buildQueryString, type QueryParams } from '@shared/utils/url'

export type { QueryParams }

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  baseUrl?: string
  query?: QueryParams
  body?: unknown
  headers?: Record<string, string>
  timeoutMs?: number
  /** Skip attaching the Authorization header — for public endpoints only. */
  skipAuth?: boolean
  /** Which session a 401 on this call should log out — defaults to `'admin'`. Caterer Portal
   *  calls (which always pass `skipAuth: true` + their own manual header) must pass `'caterer'`
   *  so an expired caterer token can never trigger the admin session's logout handler. */
  authDomain?: 'admin' | 'caterer'
  /** The logout call itself is the one request that must never re-trigger the unauthorized
   *  handler on a 401 — that handler IS `logout()`, so an already-expired token at logout
   *  time would otherwise call `logout()` again from inside `logout()`. */
  suppressUnauthorizedHandler?: boolean
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    baseUrl = API_BASE_URL,
    query,
    body,
    headers,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    skipAuth = false,
    authDomain = 'admin',
    suppressUnauthorizedHandler = false,
    ...rest
  } = options

  const url = baseUrl + path + buildQueryString(query ?? {})

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        ...(body ? { 'content-type': 'application/json' } : null),
        ...(skipAuth ? {} : getAuthHeader()),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`, 0, null)
    }
    throw new ApiError('Network request failed', 0, err)
  }
  clearTimeout(timeout)

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const parsedBody = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && !suppressUnauthorizedHandler) handleUnauthorized(authDomain)
    throw normalizeError(res.status, parsedBody)
  }

  return parsedBody as T
}

/** Parses a `Content-Disposition: attachment; filename="..."` header — returns `null` if absent/unparseable. */
function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(header)
  return match ? decodeURIComponent(match[1].replace(/"$/, '')) : null
}

/**
 * For binary/file responses (CSV/XLSX exports, etc.) — every other
 * endpoint in the app returns JSON, so this is intentionally separate
 * from `requestJson` rather than a generic content-type switch there.
 * Non-2xx responses are parsed as JSON and normalized the same way as
 * `requestJson` does.
 */
async function requestBlob(path: string, options: RequestOptions = {}): Promise<{ blob: Blob; fileName: string | null }> {
  const { baseUrl = API_BASE_URL, query, headers, timeoutMs = DEFAULT_TIMEOUT_MS, skipAuth = false, authDomain = 'admin', method } = options

  const url = baseUrl + path + buildQueryString(query ?? {})
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(url, {
      method,
      signal: controller.signal,
      headers: { accept: '*/*', ...(skipAuth ? {} : getAuthHeader()), ...headers },
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`, 0, null)
    }
    throw new ApiError('Network request failed', 0, err)
  }
  clearTimeout(timeout)

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized(authDomain)
    const body = await res.json().catch(() => null)
    throw normalizeError(res.status, body)
  }

  const blob = await res.blob()
  const fileName = filenameFromContentDisposition(res.headers.get('content-disposition'))
  return { blob, fileName }
}

/** Triggers a browser "Save As" download for a blob fetched via `httpClient.getBlob`. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    requestJson<T>(path, { ...options, method: 'GET' }),

  getBlob: (path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    requestBlob(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    requestJson<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    requestJson<T>(path, { ...options, method: 'PATCH', body }),

  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    requestJson<T>(path, { ...options, method: 'PUT', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    requestJson<T>(path, { ...options, method: 'DELETE' }),
}

import { getCached, setCached } from './cache'

export class HttpError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

type RequestJsonOptions = Omit<RequestInit, 'body'> & {
  baseUrl?: string
  query?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
}

function buildUrl(path: string, query?: RequestJsonOptions['query']) {
  const url = new URL(path, 'http://local')
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.pathname + url.search
}

export async function requestJson<T>(path: string, options: RequestJsonOptions = {}): Promise<T> {
  const baseUrl = options.baseUrl ?? (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const url = baseUrl + buildUrl(path, options.query)

  const res = await fetch(url, {
    ...options,
    headers: {
      accept: 'application/json',
      ...(options.body ? { 'content-type': 'application/json' } : null),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as Record<string, unknown>).message === 'string'
        ? String((body as Record<string, unknown>).message)
        : `Request failed (${res.status})`
    throw new HttpError(message, res.status, body)
  }

  return body as T
}

export async function getJsonCached<T>(
  path: string,
  options: Omit<RequestJsonOptions, 'method' | 'body'> & { ttlMs?: number } = {},
): Promise<T> {
  const ttlMs = options.ttlMs ?? 30_000
  const baseUrl = options.baseUrl ?? (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const url = baseUrl + buildUrl(path, options.query)
  const cacheKey = `GET ${url}`

  const cached = getCached<T>(cacheKey)
  if (cached !== undefined) return cached

  const value = await requestJson<T>(path, { ...options, method: 'GET' })
  setCached(cacheKey, value, ttlMs)
  return value
}

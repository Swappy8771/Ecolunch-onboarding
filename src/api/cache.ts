type CacheEntry<T> = { expiresAt: number; value: T }

const cache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return entry.value as T
}

export function setCached<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export function clearCache(prefix?: string) {
  if (!prefix) return cache.clear()
  for (const k of cache.keys()) if (k.startsWith(prefix)) cache.delete(k)
}


/**
 * URL helpers — generic string building, no API/business logic. Used by
 * `src/api/client/http.ts` for query-string serialization so that logic
 * exists in exactly one place.
 */

export type QueryParams = Record<string, string | number | boolean | undefined | null>

export function buildQueryString(params: QueryParams): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

/** Joins path segments with exactly one `/` between them, trimming duplicate/edge slashes. */
export function joinPaths(...segments: string[]): string {
  return segments
    .map((segment, index) =>
      index === 0 ? segment.replace(/\/+$/, '') : segment.replace(/^\/+|\/+$/g, ''),
    )
    .filter(Boolean)
    .join('/')
}

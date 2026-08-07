/**
 * Token retrieval/injection for the HTTP client only — no React, no
 * Redux, no JSX. Reads the same `authToken` storage key
 * `src/shared/utils/storage.ts` owns, so there is exactly one place that
 * knows the storage key name. `src/auth/AuthProvider.tsx` registers a
 * real logout handler at app startup via `setUnauthorizedHandler`, so a
 * 401 anywhere can trigger a full logout (clear state + redirect)
 * without this file depending on React/Redux directly — avoiding a
 * circular dependency between `src/api/` and `src/auth/`.
 *
 * Two independent handler slots (admin/caterer) exist because the two
 * identity systems are genuinely separate sessions — a caterer token
 * expiring must never log out the admin session sharing the same browser
 * (or vice versa). `http.ts`'s `authDomain` request option (default
 * `'admin'`) selects which one fires on a 401 for that call.
 */
import { getStoredToken, clearStoredToken } from '@shared/utils/storage'
import { clearStoredCatererToken } from '@shared/utils/catererStorage'

export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

type UnauthorizedHandler = () => void

let adminUnauthorizedHandler: UnauthorizedHandler | null = null
let catererUnauthorizedHandler: UnauthorizedHandler | null = null

/** Called once, at app startup, by `AuthProvider`. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  adminUnauthorizedHandler = handler
}

/** Called once, at app startup, by `CatererAuthProvider`. */
export function setCatererUnauthorizedHandler(handler: UnauthorizedHandler): void {
  catererUnauthorizedHandler = handler
}

/**
 * Invoked by `http.ts` on every 401 response, for the domain that request
 * belongs to. Falls back to clearing just that domain's stale token
 * directly if no handler has registered yet (e.g. a request fired before
 * the relevant provider mounted) rather than doing nothing.
 */
export function handleUnauthorized(domain: 'admin' | 'caterer' = 'admin'): void {
  if (domain === 'caterer') {
    if (catererUnauthorizedHandler) {
      catererUnauthorizedHandler()
      return
    }
    clearStoredCatererToken()
    return
  }
  if (adminUnauthorizedHandler) {
    adminUnauthorizedHandler()
    return
  }
  clearStoredToken()
}

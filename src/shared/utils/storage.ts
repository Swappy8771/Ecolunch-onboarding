/**
 * Token storage helpers — the one place that owns the `authToken`
 * `localStorage` key name. `src/api/client/auth.ts` (the HTTP client's
 * token injection) and `src/auth/` (the React auth layer) both import
 * from here rather than each hardcoding the key separately.
 */

const AUTH_TOKEN_KEY = 'authToken'

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function hasStoredToken(): boolean {
  return getStoredToken() !== null
}

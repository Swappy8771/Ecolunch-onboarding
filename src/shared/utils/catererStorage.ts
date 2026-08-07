/**
 * Caterer Portal token storage — deliberately separate from
 * `storage.ts`'s admin `authToken` key. The backend signs these with a
 * different secret (`CATERER_JWT_SECRET` vs the admin's `JWT_SECRET`,
 * see `backend/src/middleware/requireCatererAuth.ts`) and verifies them
 * via a different middleware (`requireCatererAuth`, not `requireAuth`) —
 * an admin token sent to `/api/caterer/*` (or vice versa) always 401s, so
 * mixing the two into one storage key would silently break whichever
 * portal wasn't logged in most recently. There is no Caterer Portal login
 * page yet (`POST /api/caterer/auth/login` exists on the backend, unused
 * by the frontend) — this file is the storage half of that future login
 * flow, needed now so `caterer-profile.api.ts` has somewhere real to read
 * a token from once one exists.
 */

const CATERER_AUTH_TOKEN_KEY = 'catererAuthToken'

export function getStoredCatererToken(): string | null {
  return localStorage.getItem(CATERER_AUTH_TOKEN_KEY)
}

export function setStoredCatererToken(token: string): void {
  localStorage.setItem(CATERER_AUTH_TOKEN_KEY, token)
}

export function clearStoredCatererToken(): void {
  localStorage.removeItem(CATERER_AUTH_TOKEN_KEY)
}

export function hasStoredCatererToken(): boolean {
  return getStoredCatererToken() !== null
}

/**
 * Caterer Portal Auth API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/caterer/auth/*`.
 *
 * `login`/`checkInviteToken`/`setPassword`/`forgotPassword` are public
 * (`skipAuth: true`, no token exists yet at that point). `logout`/`me`
 * require a caterer session — same pattern as `caterer-profile.api.ts`:
 * attach the separate caterer token manually rather than going through the
 * shared admin `getAuthHeader()`.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type CatererLoginBody = RequestBody<'/caterer/auth/login', 'post'>
export type CatererSetPasswordBody = RequestBody<'/caterer/auth/set-password', 'post'>
export type CatererForgotPasswordBody = RequestBody<'/caterer/auth/forgot-password', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const catererAuthApi = {
  login: (body: CatererLoginBody) => httpClient.post<unknown>('/caterer/auth/login', body, { skipAuth: true }),

  logout: () =>
    httpClient.post<unknown>('/caterer/auth/logout', undefined, {
      skipAuth: true, authDomain: 'caterer', headers: catererAuthHeaders(), suppressUnauthorizedHandler: true,
    }),

  /** The Support Access Session banner's "End Session" — logs the matching `.end` audit entry. */
  endSupportSession: () =>
    httpClient.post<unknown>('/caterer/auth/support-session/end', undefined, {
      skipAuth: true, authDomain: 'caterer', headers: catererAuthHeaders(), suppressUnauthorizedHandler: true,
    }),

  me: () =>
    httpClient.get<unknown>('/caterer/auth/me', {
      skipAuth: true, authDomain: 'caterer', headers: catererAuthHeaders(),
    }),

  checkInviteToken: (token: string) =>
    httpClient.get<unknown>(`/caterer/auth/check-invite/${token}`, { skipAuth: true }),

  setPassword: (body: CatererSetPasswordBody) =>
    httpClient.post<unknown>('/caterer/auth/set-password', body, { skipAuth: true }),

  forgotPassword: (body: CatererForgotPasswordBody) =>
    httpClient.post<unknown>('/caterer/auth/forgot-password', body, { skipAuth: true }),
} as const

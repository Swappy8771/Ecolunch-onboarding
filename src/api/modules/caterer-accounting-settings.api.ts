/**
 * Caterer Portal Accounting Settings API module (Caterer Portal Document
 * §5.D) — typed functions only, no React/Query/UI code. Backend:
 * `/api/caterer/accounting-settings`.
 *
 * Same separate-token pattern as `caterer-profile.api.ts`: attaches the
 * caterer token manually and passes `authDomain: 'caterer'` so a 401 here
 * only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type UpdateAccountingSettingsBody = RequestBody<'/caterer/accounting-settings', 'patch'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererAccountingSettingsApi = {
  get: () => httpClient.get<unknown>('/caterer/accounting-settings', opts()),

  update: (body: UpdateAccountingSettingsBody) =>
    httpClient.patch<unknown>('/caterer/accounting-settings', body, opts()),
} as const

/**
 * Caterer Portal Daycare / CPE Meals Settings API module (Caterer Portal
 * Document §5.B) — typed functions only, no React/Query/UI code. Backend:
 * `/api/caterer/daycare-meals-settings`.
 *
 * Same separate-token pattern as `caterer-profile.api.ts`: attaches the
 * caterer token manually and passes `authDomain: 'caterer'` so a 401 here
 * only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type UpdateDaycareMealsSettingsBody = RequestBody<'/caterer/daycare-meals-settings', 'patch'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererDaycareMealsSettingsApi = {
  get: () => httpClient.get<unknown>('/caterer/daycare-meals-settings', opts()),

  update: (body: UpdateDaycareMealsSettingsBody) =>
    httpClient.patch<unknown>('/caterer/daycare-meals-settings', body, opts()),
} as const

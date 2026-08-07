/**
 * Caterer Portal School Meals Settings API module (Caterer Portal Document
 * §5.A) — typed functions only, no React/Query/UI code. Backend:
 * `/api/caterer/school-meals-settings`.
 *
 * Same separate-token pattern as `caterer-profile.api.ts`: attaches the
 * caterer token manually and passes `authDomain: 'caterer'` so a 401 here
 * only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type UpdateSchoolMealsSettingsBody = RequestBody<'/caterer/school-meals-settings', 'patch'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererSchoolMealsSettingsApi = {
  get: () => httpClient.get<unknown>('/caterer/school-meals-settings', opts()),

  update: (body: UpdateSchoolMealsSettingsBody) =>
    httpClient.patch<unknown>('/caterer/school-meals-settings', body, opts()),
} as const

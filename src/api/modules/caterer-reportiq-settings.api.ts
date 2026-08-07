/**
 * Caterer Portal ReportIQ Settings API module (Caterer Portal Document
 * §5.E) — typed functions only, no React/Query/UI code. Backend:
 * `/api/caterer/reportiq-settings`.
 *
 * Same separate-token pattern as `caterer-profile.api.ts`: attaches the
 * caterer token manually and passes `authDomain: 'caterer'` so a 401 here
 * only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type UpdateReportiqSettingsBody = RequestBody<'/caterer/reportiq-settings', 'patch'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererReportiqSettingsApi = {
  get: () => httpClient.get<unknown>('/caterer/reportiq-settings', opts()),

  update: (body: UpdateReportiqSettingsBody) =>
    httpClient.patch<unknown>('/caterer/reportiq-settings', body, opts()),
} as const

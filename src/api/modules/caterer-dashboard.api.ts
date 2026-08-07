/**
 * Caterer Portal Dashboard API module — typed functions only, no React/
 * Query/UI code. Backend: `/api/caterer/dashboard` — pure aggregation
 * over Modules & Required Setup / Go-live, same shape/purpose as the
 * admin dashboard's own stats endpoint.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererDashboardApi = {
  getStats: () => httpClient.get<unknown>('/caterer/dashboard', opts()),
} as const

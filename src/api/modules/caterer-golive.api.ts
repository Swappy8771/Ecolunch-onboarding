/**
 * Caterer Portal Go-live API module — typed functions only, no React/
 * Query/UI code. Backend: `/api/caterer/golive/*`. Read-only — a caterer
 * only ever views its own computed readiness summary and Validation
 * Checklist; there is no self-activate/block/unblock action anywhere in
 * this module.
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererGoliveApi = {
  getSummary: () => httpClient.get<unknown>('/caterer/golive/summary', opts()),

  getChecklist: () => httpClient.get<unknown>('/caterer/golive/checklist', opts()),
} as const

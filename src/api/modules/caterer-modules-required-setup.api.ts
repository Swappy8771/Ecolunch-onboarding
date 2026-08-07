/**
 * Caterer Portal Modules & Required Setup API module — typed functions
 * only, no React/Query/UI code. Backend: `/api/caterer/modules-required-setup/*`.
 *
 * Read-only — the caterer never activates a module or sets pricing here;
 * both stay exclusively in the Admin "Modules, Pricing & Configurations"
 * screen. This is a pure reflection of module activation + checklist
 * completion, computed from Establishments/Menus/Document Vault/
 * Corrections/Go-live/EcoLoop — no create/update function exists here at all.
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { QueryParams } from '../generated/helpers'

export type MissingItemsQuery = QueryParams<'/caterer/modules-required-setup/missing-items', 'get'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererModulesRequiredSetupApi = {
  getOverview: () => httpClient.get<unknown>('/caterer/modules-required-setup', opts()),

  getActiveModules: () => httpClient.get<unknown>('/caterer/modules-required-setup/active-modules', opts()),

  getProgress: () => httpClient.get<unknown>('/caterer/modules-required-setup/progress', opts()),

  getMissingItems: (query?: MissingItemsQuery) =>
    httpClient.get<unknown>('/caterer/modules-required-setup/missing-items', { ...opts(), query }),

  getModuleDetail: (moduleKey: string) =>
    httpClient.get<unknown>(`/caterer/modules-required-setup/${moduleKey}`, opts()),
} as const

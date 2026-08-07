/**
 * Caterer Portal Profile API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/caterer/profile/*`.
 *
 * Deliberately does NOT go through the shared `getAuthHeader()` (admin-only,
 * see `api/client/auth.ts`) — every call here attaches the separate caterer
 * token from `shared/utils/catererStorage.ts` instead, since the backend
 * verifies these two token types with different secrets/middleware. Calls
 * pass `skipAuth: true` to suppress the admin header injection and set the
 * caterer bearer header manually, and `authDomain: 'caterer'` so a 401 here
 * logs out the caterer session, never the admin one.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type UpdateCompanyBody = RequestBody<'/caterer/profile/company', 'patch'>
export type UpdateBusinessBody = RequestBody<'/caterer/profile/business', 'patch'>
export type UpdateContactBody = RequestBody<'/caterer/profile/contact', 'patch'>
export type UpdateAddressBody = RequestBody<'/caterer/profile/address', 'patch'>
export type UpdateTaxBody = RequestBody<'/caterer/profile/tax', 'patch'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const catererOpts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererProfileApi = {
  get: () => httpClient.get<unknown>('/caterer/profile', catererOpts()),

  getOverview: () => httpClient.get<unknown>('/caterer/profile/overview', catererOpts()),

  updateCompany: (body: UpdateCompanyBody) => httpClient.patch<unknown>('/caterer/profile/company', body, catererOpts()),

  updateBusiness: (body: UpdateBusinessBody) => httpClient.patch<unknown>('/caterer/profile/business', body, catererOpts()),

  updateContact: (body: UpdateContactBody) => httpClient.patch<unknown>('/caterer/profile/contact', body, catererOpts()),

  updateAddress: (body: UpdateAddressBody) => httpClient.patch<unknown>('/caterer/profile/address', body, catererOpts()),

  updateTax: (body: UpdateTaxBody) => httpClient.patch<unknown>('/caterer/profile/tax', body, catererOpts()),
} as const

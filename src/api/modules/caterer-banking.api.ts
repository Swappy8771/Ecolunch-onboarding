/**
 * Caterer Portal Banks & Banking Information API module — typed functions
 * only, no React/Query/UI code. Backend: `/api/caterer/banking/*`.
 *
 * Masked only — there is no `reveal` function here. Per the caterer-
 * onboarding spec, the caterer must only ever see masked values (e.g.
 * `FR76 *****`), never the full IBAN/account number, even for its own
 * data; `reveal` stays exclusively an admin, separately-audited action.
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type CreateOrUpdateBankingBody = RequestBody<'/caterer/banking', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererBankingApi = {
  get: () => httpClient.get<unknown>('/caterer/banking', opts()),

  getOverview: () => httpClient.get<unknown>('/caterer/banking/overview', opts()),

  createOrUpdate: (body: CreateOrUpdateBankingBody) => httpClient.post<unknown>('/caterer/banking', body, opts()),
} as const

/**
 * Caterer Portal Contracts & Signatures API module — typed functions only,
 * no React/Query/UI code. Backend: `/api/caterer/contracts/*`.
 *
 * Read-only — a caterer never creates/sends/cancels a contract, and signing
 * itself happens entirely on Dropbox Sign's own hosted page (reached via an
 * emailed link this backend never generates or stores), so there is no
 * create/update/sign function here at all.
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

export const catererContractsApi = {
  list: () => httpClient.get<unknown>('/caterer/contracts', opts()),

  getProgress: () => httpClient.get<unknown>('/caterer/contracts/progress', opts()),

  getById: (cid: string) => httpClient.get<unknown>(`/caterer/contracts/${cid}`, opts()),

  getSignedDocument: (cid: string) => httpClient.get<unknown>(`/caterer/contracts/${cid}/document`, opts()),

  getSignedDocumentDownload: (cid: string) =>
    httpClient.get<unknown>(`/caterer/contracts/${cid}/document/download`, opts()),
} as const

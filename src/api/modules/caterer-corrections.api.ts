/**
 * Caterer Portal Corrections & Follow-up API module — typed functions
 * only, no React/Query/UI code. Backend: `/api/caterer/corrections/*`.
 *
 * A caterer only ever views its own corrections, follows up with a
 * comment, and resubmits a fix — no close/reopen/resolve function exists
 * here, since those stay exclusively admin decisions confirming or
 * rejecting the caterer's fix.
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { QueryParams, RequestBody } from '../generated/helpers'

export type ListCorrectionsQuery = QueryParams<'/caterer/corrections', 'get'>
export type ResubmitCorrectionBody = RequestBody<'/caterer/corrections/{id}/resubmit', 'post'>
export type AddCorrectionCommentBody = RequestBody<'/caterer/corrections/{id}/comment', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererCorrectionsApi = {
  list: (query?: ListCorrectionsQuery) => httpClient.get<unknown>('/caterer/corrections', { ...opts(), query }),

  getSummary: () => httpClient.get<unknown>('/caterer/corrections/summary', opts()),

  getById: (id: string) => httpClient.get<unknown>(`/caterer/corrections/${id}`, opts()),

  getHistory: (id: string) => httpClient.get<unknown>(`/caterer/corrections/${id}/history`, opts()),

  resubmit: (id: string, body: ResubmitCorrectionBody) =>
    httpClient.post<unknown>(`/caterer/corrections/${id}/resubmit`, body, opts()),

  addComment: (id: string, body: AddCorrectionCommentBody) =>
    httpClient.post<unknown>(`/caterer/corrections/${id}/comment`, body, opts()),
} as const

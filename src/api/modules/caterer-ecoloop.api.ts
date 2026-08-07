/**
 * Caterer Portal EcoLoop API module — typed functions only, no React/
 * Query/UI code. Backend: `/api/caterer/ecoloop/*`. A caterer only ever
 * views its own conversations and replies — no create/close/reopen/
 * resolve/reassign here.
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { RequestBody } from '../generated/helpers'

export type CatererAddEcoloopMessageBody = RequestBody<'/caterer/ecoloop/{conversationId}/messages', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererEcoloopApi = {
  list: () => httpClient.get<unknown>('/caterer/ecoloop', opts()),

  getById: (conversationId: string) => httpClient.get<unknown>(`/caterer/ecoloop/${conversationId}`, opts()),

  addMessage: (conversationId: string, body: CatererAddEcoloopMessageBody) =>
    httpClient.post<unknown>(`/caterer/ecoloop/${conversationId}/messages`, body, opts()),

  markRead: (conversationId: string) => httpClient.post<unknown>(`/caterer/ecoloop/${conversationId}/read`, undefined, opts()),
} as const

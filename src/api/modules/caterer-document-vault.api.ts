/**
 * Caterer Portal Document Vault API module — typed functions only, no
 * React/Query/UI code. Backend: `/api/caterer/document-vault/*` (the
 * orchestration layer — module-gated requirement catalogue) and
 * `/api/caterer/documents/*` (the underlying file list/upload/view/
 * download/replace).
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { QueryParams, RequestBody } from '../generated/helpers'

export type CatererListDocumentsQuery = QueryParams<'/caterer/documents', 'get'>
export type CatererUploadDocumentBody = RequestBody<'/caterer/documents', 'post'>
export type CatererReplaceDocumentBody = RequestBody<'/caterer/documents/{docId}/replace', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererDocumentVaultApi = {
  getRequirements: () => httpClient.get<unknown>('/caterer/document-vault/requirements', opts()),

  getGroups: () => httpClient.get<unknown>('/caterer/document-vault/groups', opts()),

  getProgress: () => httpClient.get<unknown>('/caterer/document-vault/progress', opts()),

  listDocuments: (query?: CatererListDocumentsQuery) =>
    httpClient.get<unknown>('/caterer/documents', { ...opts(), query }),

  uploadDocument: (body: CatererUploadDocumentBody) => httpClient.post<unknown>('/caterer/documents', body, opts()),

  getDocumentById: (docId: string) => httpClient.get<unknown>(`/caterer/documents/${docId}`, opts()),

  getDownloadLink: (docId: string) => httpClient.get<unknown>(`/caterer/documents/${docId}/download`, opts()),

  replaceDocument: (docId: string, body: CatererReplaceDocumentBody) =>
    httpClient.post<unknown>(`/caterer/documents/${docId}/replace`, body, opts()),
} as const

/**
 * Document Vault API module — typed functions only, no React/Query/UI
 * code. Two backend surfaces: `/api/admin/document-vault/*` (the
 * requirements/progress orchestration layer built on top of the
 * pre-existing Documents module) and `/api/admin/documents/*` (the
 * underlying upload/version/review documents module itself).
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/documents/caterers/{catererId}', 'get'>
type UploadBody = RequestBody<'/admin/documents/caterers/{catererId}', 'post'>
type ReplaceBody = RequestBody<'/admin/documents/{docId}/replace', 'post'>
type ClassifyBody = RequestBody<'/admin/documents/{docId}/classify', 'patch'>
type VisibilityBody = RequestBody<'/admin/documents/{docId}/visibility', 'patch'>
type ReviewBody = RequestBody<'/admin/documents/{docId}/review', 'post'>
export type ExportVaultQuery = QueryParams<'/admin/documents/vault/export', 'get'>

export const documentVaultApi = {
  getRequirements: (catererId: string) => httpClient.get<unknown>(`/admin/document-vault/caterers/${catererId}/requirements`),

  getGroups: (catererId: string) => httpClient.get<unknown>(`/admin/document-vault/caterers/${catererId}/groups`),

  getProgress: (catererId: string) => httpClient.get<unknown>(`/admin/document-vault/caterers/${catererId}/progress`),

  getVaultSummary: () => httpClient.get<unknown>('/admin/documents/vault'),

  /** Returns the raw file blob + parsed filename — pair with `downloadBlob()` to trigger a browser download. */
  exportVaultSummary: (query?: ExportVaultQuery) => httpClient.getBlob('/admin/documents/vault/export', { query }),

  getCategories: () => httpClient.get<unknown>('/admin/documents/categories'),

  list: (catererId: string, query?: ListQuery) => httpClient.get<unknown>(`/admin/documents/caterers/${catererId}`, { query }),

  upload: (catererId: string, body: UploadBody) => httpClient.post<unknown>(`/admin/documents/caterers/${catererId}`, body),

  getById: (docId: string) => httpClient.get<unknown>(`/admin/documents/${docId}`),

  getDownload: (docId: string) => httpClient.get<unknown>(`/admin/documents/${docId}/download`),

  replace: (docId: string, body: ReplaceBody) => httpClient.post<unknown>(`/admin/documents/${docId}/replace`, body),

  classify: (docId: string, body: ClassifyBody) => httpClient.patch<unknown>(`/admin/documents/${docId}/classify`, body),

  setVisibility: (docId: string, body: VisibilityBody) => httpClient.patch<unknown>(`/admin/documents/${docId}/visibility`, body),

  review: (docId: string, body: ReviewBody) => httpClient.post<unknown>(`/admin/documents/${docId}/review`, body),

  getHistory: (docId: string) => httpClient.get<unknown>(`/admin/documents/${docId}/history`),

  getExtractedFields: (docId: string) => httpClient.get<unknown>(`/admin/documents/${docId}/extracted-fields`),

  getValidationStatus: (docId: string) => httpClient.get<unknown>(`/admin/documents/${docId}/validation-status`),

  getOpenDropbox: (docId: string) => httpClient.get<unknown>(`/admin/documents/${docId}/open-dropbox`),
} as const

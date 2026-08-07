/**
 * Contracts & Signatures API module — typed functions only, no
 * React/Query/UI code. Backend: `/api/admin/contracts/*`. Real usage
 * begins in `src/features/adminContracts/` (Phase 4C) — this file itself does
 * not encode any type/status enum, so no mock-vocabulary drift is
 * possible at this layer.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/contracts', 'get'>
type CreateDraftBody = RequestBody<'/admin/contracts/caterers/{catererId}', 'post'>
type SendBody = RequestBody<'/admin/contracts/{cid}/send', 'post'>

/** No generated spec entry (new endpoint) — same shape as Caterers' `ExportQuery`. */
export interface ExportContractsQuery {
  caterer?: string
  status?: string
  type?: string
  format?: 'csv' | 'xlsx'
  [key: string]: string | undefined
}

export const contractsApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/contracts', { query }),

  /** Returns the raw file blob + parsed filename — pair with `downloadBlob()` to trigger a browser download. */
  export: (query?: ExportContractsQuery) => httpClient.getBlob('/admin/contracts/export', { query }),

  templates: () => httpClient.get<unknown>('/admin/contracts/templates'),

  listForCaterer: (catererId: string) => httpClient.get<unknown>(`/admin/contracts/caterers/${catererId}`),

  createDraft: (catererId: string, body: CreateDraftBody) =>
    httpClient.post<unknown>(`/admin/contracts/caterers/${catererId}`, body),

  getSummary: (catererId: string) => httpClient.get<unknown>(`/admin/contracts/caterers/${catererId}/summary`),

  getById: (cid: string) => httpClient.get<unknown>(`/admin/contracts/${cid}`),

  send: (cid: string, body?: SendBody) => httpClient.post<unknown>(`/admin/contracts/${cid}/send`, body),

  ready: (cid: string) => httpClient.post<unknown>(`/admin/contracts/${cid}/ready`),

  retry: (cid: string) => httpClient.post<unknown>(`/admin/contracts/${cid}/retry`),

  resend: (cid: string) => httpClient.post<unknown>(`/admin/contracts/${cid}/resend`),

  cancel: (cid: string) => httpClient.post<unknown>(`/admin/contracts/${cid}/cancel`),

  getHistory: (cid: string) => httpClient.get<unknown>(`/admin/contracts/${cid}/history`),

  getDocument: (cid: string) => httpClient.get<unknown>(`/admin/contracts/${cid}/document`),

  getDocumentDownload: (cid: string) => httpClient.get<unknown>(`/admin/contracts/${cid}/document/download`),
} as const

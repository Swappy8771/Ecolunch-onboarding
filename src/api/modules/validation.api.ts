/**
 * Validation Center API module — typed functions only, no React/Query/UI
 * code. Backend: `/api/admin/validations/*`.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/validations', 'get'>
type CreateBody = RequestBody<'/admin/validations', 'post'>
export type ExportValidationsQuery = QueryParams<'/admin/validations/export', 'get'>
type RejectBody = RequestBody<'/admin/validations/{vid}/reject', 'post'>
type RequestCorrectionBody = RequestBody<'/admin/validations/{vid}/request-correction', 'post'>
type AddNoteBody = RequestBody<'/admin/validations/{vid}/notes', 'post'>
type SendEcoLoopBody = RequestBody<'/admin/validations/{vid}/send-ecoloop', 'post'>

export const validationApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/validations', { query }),

  create: (body: CreateBody) => httpClient.post<unknown>('/admin/validations', body),

  /** Returns the raw file blob + parsed filename — pair with `downloadBlob()` to trigger a browser download. */
  export: (query?: ExportValidationsQuery) => httpClient.getBlob('/admin/validations/export', { query }),

  getById: (vid: string) => httpClient.get<unknown>(`/admin/validations/${vid}`),

  open: (vid: string) => httpClient.post<unknown>(`/admin/validations/${vid}/open`),

  approve: (vid: string) => httpClient.post<unknown>(`/admin/validations/${vid}/approve`),

  /** `reason` is required by the backend (`rejectSchema`) — this previously sent no body at all, which would always 400. */
  reject: (vid: string, body: RejectBody) => httpClient.post<unknown>(`/admin/validations/${vid}/reject`, body),

  requestCorrection: (vid: string, body: RequestCorrectionBody) =>
    httpClient.post<unknown>(`/admin/validations/${vid}/request-correction`, body),

  addNote: (vid: string, body: AddNoteBody) => httpClient.post<unknown>(`/admin/validations/${vid}/notes`, body),

  /** `message` is required by the backend (`sendEcoLoopSchema`) — this previously sent no body at all, which would always 400. */
  sendToEcoLoop: (vid: string, body: SendEcoLoopBody) => httpClient.post<unknown>(`/admin/validations/${vid}/send-ecoloop`, body),

  getHistory: (vid: string) => httpClient.get<unknown>(`/admin/validations/${vid}/history`),
} as const

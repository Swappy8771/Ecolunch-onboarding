/**
 * Corrections & Follow-up API module — typed functions only, no
 * React/Query/UI code. Backend: `/api/admin/corrections/*`.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/corrections', 'get'>
type UpdateBody = RequestBody<'/admin/corrections/{id}', 'patch'>
type ResubmitBody = RequestBody<'/admin/corrections/{id}/resubmit', 'post'>
type ResolveBody = RequestBody<'/admin/corrections/{id}/resolve', 'post'>
type CommentBody = RequestBody<'/admin/corrections/{id}/comment', 'post'>

export const correctionsApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/corrections', { query }),

  getSummary: (catererId: string) => httpClient.get<unknown>('/admin/corrections/summary', { query: { catererId } }),

  getById: (id: string) => httpClient.get<unknown>(`/admin/corrections/${id}`),

  update: (id: string, body: UpdateBody) => httpClient.patch<unknown>(`/admin/corrections/${id}`, body),

  getHistory: (id: string) => httpClient.get<unknown>(`/admin/corrections/${id}/history`),

  close: (id: string) => httpClient.post<unknown>(`/admin/corrections/${id}/close`),

  reopen: (id: string) => httpClient.post<unknown>(`/admin/corrections/${id}/reopen`),

  resubmit: (id: string, body: ResubmitBody) => httpClient.post<unknown>(`/admin/corrections/${id}/resubmit`, body),

  resolve: (id: string, body: ResolveBody) => httpClient.post<unknown>(`/admin/corrections/${id}/resolve`, body),

  addComment: (id: string, body: CommentBody) => httpClient.post<unknown>(`/admin/corrections/${id}/comment`, body),
} as const

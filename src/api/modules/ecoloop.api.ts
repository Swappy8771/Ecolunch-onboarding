/**
 * EcoLoop API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/admin/ecoloop/*`.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/ecoloop', 'get'>
type CreateBody = RequestBody<'/admin/ecoloop', 'post'>
type SendMessageBody = RequestBody<'/admin/ecoloop/{conversationId}/messages', 'post'>
type AddNoteBody = RequestBody<'/admin/ecoloop/{conversationId}/notes', 'post'>
type AddLinkBody = RequestBody<'/admin/ecoloop/{conversationId}/links', 'post'>
type ReassignBody = RequestBody<'/admin/ecoloop/{conversationId}/reassign', 'post'>
type UpdatePriorityBody = RequestBody<'/admin/ecoloop/{conversationId}/priority', 'patch'>
type ReplyBody = RequestBody<'/admin/ecoloop/{conversationId}/reply', 'post'>

export const ecoloopApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/ecoloop', { query }),

  create: (body: CreateBody) => httpClient.post<unknown>('/admin/ecoloop', body),

  getDashboard: () => httpClient.get<unknown>('/admin/ecoloop/dashboard'),

  listForCaterer: (catererId: string, query?: ListQuery) =>
    httpClient.get<unknown>(`/admin/ecoloop/caterers/${catererId}`, { query }),

  getById: (conversationId: string) => httpClient.get<unknown>(`/admin/ecoloop/${conversationId}`),

  getHistory: (conversationId: string) => httpClient.get<unknown>(`/admin/ecoloop/${conversationId}/history`),

  sendMessage: (conversationId: string, body: SendMessageBody) =>
    httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/messages`, body),

  addNote: (conversationId: string, body: AddNoteBody) =>
    httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/notes`, body),

  addLink: (conversationId: string, body: AddLinkBody) =>
    httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/links`, body),

  reassign: (conversationId: string, body: ReassignBody) =>
    httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/reassign`, body),

  updatePriority: (conversationId: string, body: UpdatePriorityBody) =>
    httpClient.patch<unknown>(`/admin/ecoloop/${conversationId}/priority`, body),

  reply: (conversationId: string, body: ReplyBody) =>
    httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/reply`, body),

  close: (conversationId: string) => httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/close`),

  reopen: (conversationId: string) => httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/reopen`),

  resolve: (conversationId: string) => httpClient.post<unknown>(`/admin/ecoloop/${conversationId}/resolve`),
} as const

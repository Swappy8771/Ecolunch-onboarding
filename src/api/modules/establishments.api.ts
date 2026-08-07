/**
 * Establishments API module — typed functions only, no React/Query/UI
 * code. Backend: `/api/admin/establishments/*`.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/establishments/caterers/{catererId}', 'get'>
type CreateBody = RequestBody<'/admin/establishments/caterers/{catererId}', 'post'>
type UpdateBody = RequestBody<'/admin/establishments/{id}', 'patch'>
type AddContactBody = RequestBody<'/admin/establishments/{id}/contacts', 'post'>
type AddClosureBody = RequestBody<'/admin/establishments/{id}/closures', 'post'>

export const establishmentsApi = {
  getActiveModules: (catererId: string) =>
    httpClient.get<unknown>(`/admin/establishments/caterers/${catererId}/active-modules`),

  getDashboard: (catererId: string) => httpClient.get<unknown>(`/admin/establishments/caterers/${catererId}/dashboard`),

  getOverview: (catererId: string) => httpClient.get<unknown>(`/admin/establishments/caterers/${catererId}/overview`),

  list: (catererId: string, query?: ListQuery) =>
    httpClient.get<unknown>(`/admin/establishments/caterers/${catererId}`, { query }),

  create: (catererId: string, body: CreateBody) =>
    httpClient.post<unknown>(`/admin/establishments/caterers/${catererId}`, body),

  getById: (id: string) => httpClient.get<unknown>(`/admin/establishments/${id}`),

  update: (id: string, body: UpdateBody) => httpClient.patch<unknown>(`/admin/establishments/${id}`, body),

  remove: (id: string) => httpClient.delete<unknown>(`/admin/establishments/${id}`),

  addContact: (id: string, body: AddContactBody) =>
    httpClient.post<unknown>(`/admin/establishments/${id}/contacts`, body),

  removeContact: (id: string, contactId: string) =>
    httpClient.delete<unknown>(`/admin/establishments/${id}/contacts/${contactId}`),

  listClosures: (id: string) => httpClient.get<unknown>(`/admin/establishments/${id}/closures`),

  addClosure: (id: string, body: AddClosureBody) =>
    httpClient.post<unknown>(`/admin/establishments/${id}/closures`, body),

  removeClosure: (id: string, closureId: string) =>
    httpClient.delete<unknown>(`/admin/establishments/${id}/closures/${closureId}`),
} as const

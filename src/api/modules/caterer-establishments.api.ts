/**
 * Caterer Portal Establishments API module ("My Clients / Establishments") —
 * typed functions only, no React/Query/UI code. Backend: `/api/caterer/establishments/*`.
 *
 * Same separate-token pattern as `caterer-profile.api.ts`/`caterer-auth.api.ts`:
 * attaches the caterer token manually and passes `authDomain: 'caterer'` so a
 * 401 here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { QueryParams, RequestBody } from '../generated/helpers'

export type ListEstablishmentsQuery = QueryParams<'/caterer/establishments', 'get'>
export type EstablishmentOverviewQuery = QueryParams<'/caterer/establishments/overview', 'get'>
export type CreateEstablishmentBody = RequestBody<'/caterer/establishments', 'post'>
export type UpdateEstablishmentBody = RequestBody<'/caterer/establishments/{id}', 'patch'>
export type AddContactBody = RequestBody<'/caterer/establishments/{id}/contacts', 'post'>
export type AddClosureBody = RequestBody<'/caterer/establishments/{id}/closures', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererEstablishmentsApi = {
  getActiveModules: () => httpClient.get<unknown>('/caterer/establishments/active-modules', opts()),

  getDashboard: () => httpClient.get<unknown>('/caterer/establishments/dashboard', opts()),

  getOverview: (query?: EstablishmentOverviewQuery) =>
    httpClient.get<unknown>('/caterer/establishments/overview', { ...opts(), query }),

  list: (query?: ListEstablishmentsQuery) => httpClient.get<unknown>('/caterer/establishments', { ...opts(), query }),

  create: (body: CreateEstablishmentBody) => httpClient.post<unknown>('/caterer/establishments', body, opts()),

  getById: (id: string) => httpClient.get<unknown>(`/caterer/establishments/${id}`, opts()),

  update: (id: string, body: UpdateEstablishmentBody) =>
    httpClient.patch<unknown>(`/caterer/establishments/${id}`, body, opts()),

  remove: (id: string) => httpClient.delete<unknown>(`/caterer/establishments/${id}`, opts()),

  addContact: (id: string, body: AddContactBody) =>
    httpClient.post<unknown>(`/caterer/establishments/${id}/contacts`, body, opts()),

  removeContact: (id: string, contactId: string) =>
    httpClient.delete<unknown>(`/caterer/establishments/${id}/contacts/${contactId}`, opts()),

  listClosures: (id: string) => httpClient.get<unknown>(`/caterer/establishments/${id}/closures`, opts()),

  addClosure: (id: string, body: AddClosureBody) =>
    httpClient.post<unknown>(`/caterer/establishments/${id}/closures`, body, opts()),

  removeClosure: (id: string, closureId: string) =>
    httpClient.delete<unknown>(`/caterer/establishments/${id}/closures/${closureId}`, opts()),
} as const

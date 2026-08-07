/**
 * Caterer Portal Menus & Packages API module — typed functions only, no
 * React/Query/UI code. Backend: `/api/caterer/menus/*`.
 *
 * Same separate-token pattern as the other caterer API modules: attaches
 * the caterer token manually and passes `authDomain: 'caterer'` so a 401
 * here only ever logs out the caterer session.
 */
import { httpClient } from '../client/http'
import { getStoredCatererToken } from '@shared/utils/catererStorage'
import type { QueryParams, RequestBody } from '../generated/helpers'

export type ListMenusQuery = QueryParams<'/caterer/menus', 'get'>
export type MenuOverviewQuery = QueryParams<'/caterer/menus/overview', 'get'>
export type CreateMenuBody = RequestBody<'/caterer/menus', 'post'>
export type UpdateMenuBody = RequestBody<'/caterer/menus/{id}', 'patch'>
export type CreateDishBody = RequestBody<'/caterer/menus/dishes', 'post'>

function catererAuthHeaders(): Record<string, string> {
  const token = getStoredCatererToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const opts = () => ({ skipAuth: true as const, authDomain: 'caterer' as const, headers: catererAuthHeaders() })

export const catererMenusApi = {
  getActiveModules: () => httpClient.get<unknown>('/caterer/menus/active-modules', opts()),

  getOverview: (query?: MenuOverviewQuery) => httpClient.get<unknown>('/caterer/menus/overview', { ...opts(), query }),

  listDishes: () => httpClient.get<unknown>('/caterer/menus/dishes', opts()),

  createDish: (body: CreateDishBody) => httpClient.post<unknown>('/caterer/menus/dishes', body, opts()),

  deleteDish: (dishId: string) => httpClient.delete<unknown>(`/caterer/menus/dishes/${dishId}`, opts()),

  list: (query?: ListMenusQuery) => httpClient.get<unknown>('/caterer/menus', { ...opts(), query }),

  create: (body: CreateMenuBody) => httpClient.post<unknown>('/caterer/menus', body, opts()),

  getById: (id: string) => httpClient.get<unknown>(`/caterer/menus/${id}`, opts()),

  update: (id: string, body: UpdateMenuBody) => httpClient.patch<unknown>(`/caterer/menus/${id}`, body, opts()),

  remove: (id: string) => httpClient.delete<unknown>(`/caterer/menus/${id}`, opts()),

  addDishToMenu: (id: string, dishId: string) =>
    httpClient.post<unknown>(`/caterer/menus/${id}/dishes/${dishId}`, undefined, opts()),

  removeDishFromMenu: (id: string, dishId: string) =>
    httpClient.delete<unknown>(`/caterer/menus/${id}/dishes/${dishId}`, opts()),
} as const

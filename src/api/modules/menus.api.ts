/**
 * Menus & Packages API module — typed functions only, no React/Query/UI
 * code. Backend: `/api/admin/menus/*`.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/menus/caterers/{catererId}', 'get'>
type CreateBody = RequestBody<'/admin/menus/caterers/{catererId}', 'post'>
type UpdateBody = RequestBody<'/admin/menus/{id}', 'patch'>
type CreateDishBody = RequestBody<'/admin/menus/caterers/{catererId}/dishes', 'post'>

export const menusApi = {
  getActiveModules: (catererId: string) => httpClient.get<unknown>(`/admin/menus/caterers/${catererId}/active-modules`),

  getOverview: (catererId: string) => httpClient.get<unknown>(`/admin/menus/caterers/${catererId}/overview`),

  listDishes: (catererId: string) => httpClient.get<unknown>(`/admin/menus/caterers/${catererId}/dishes`),

  createDish: (catererId: string, body: CreateDishBody) =>
    httpClient.post<unknown>(`/admin/menus/caterers/${catererId}/dishes`, body),

  removeDish: (dishId: string) => httpClient.delete<unknown>(`/admin/menus/dishes/${dishId}`),

  list: (catererId: string, query?: ListQuery) => httpClient.get<unknown>(`/admin/menus/caterers/${catererId}`, { query }),

  create: (catererId: string, body: CreateBody) => httpClient.post<unknown>(`/admin/menus/caterers/${catererId}`, body),

  getById: (id: string) => httpClient.get<unknown>(`/admin/menus/${id}`),

  update: (id: string, body: UpdateBody) => httpClient.patch<unknown>(`/admin/menus/${id}`, body),

  remove: (id: string) => httpClient.delete<unknown>(`/admin/menus/${id}`),

  addDish: (id: string, dishId: string) => httpClient.post<unknown>(`/admin/menus/${id}/dishes/${dishId}`),

  removeDishFromMenu: (id: string, dishId: string) => httpClient.delete<unknown>(`/admin/menus/${id}/dishes/${dishId}`),
} as const

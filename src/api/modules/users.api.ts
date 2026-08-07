/**
 * Users API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/admin/users/*`. Only `GET /admin/users` exists in the
 * generated spec today (no detail/create/update endpoints yet) — this
 * file exposes only what the backend actually implements, per this
 * phase's "document, don't invent" rule.
 */
import { httpClient } from '../client/http'
import type { QueryParams } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/users', 'get'>

export const usersApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/users', { query }),
} as const

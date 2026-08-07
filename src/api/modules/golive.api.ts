/**
 * Go-Live API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/admin/golive/*`.
 */
import { httpClient } from '../client/http'
import type { QueryParams, RequestBody } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/golive', 'get'>
type BlockBody = RequestBody<'/admin/golive/{catererId}/block', 'post'>

/**
 * `/remind` and `/send-ecoloop` are new backend routes added alongside this
 * frontend integration — not yet in the generated OpenAPI spec snapshot
 * (`src/api/generated/`), so their bodies are hand-typed here rather than
 * via `RequestBody<...>`, same convention already used elsewhere for
 * freshly-added endpoints (e.g. Caterers'/Contracts' export bodies).
 */
interface RemindBody {
  message?: string
}
interface SendEcoLoopBody {
  message: string
}

export const goliveApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/golive', { query }),

  getOverview: (catererId: string) => httpClient.get<unknown>(`/admin/golive/${catererId}`),

  getBlockers: (catererId: string) => httpClient.get<unknown>(`/admin/golive/${catererId}/blockers`),

  validate: (catererId: string) => httpClient.post<unknown>(`/admin/golive/${catererId}/validate`),

  block: (catererId: string, body: BlockBody) => httpClient.post<unknown>(`/admin/golive/${catererId}/block`, body),

  unblock: (catererId: string) => httpClient.post<unknown>(`/admin/golive/${catererId}/unblock`),

  activate: (catererId: string) => httpClient.post<unknown>(`/admin/golive/${catererId}/activate`),

  getHistory: (catererId: string) => httpClient.get<unknown>(`/admin/golive/${catererId}/history`),

  getSummary: (catererId: string) => httpClient.get<unknown>(`/admin/golive/${catererId}/summary`),

  getStatus: (catererId: string) => httpClient.get<unknown>(`/admin/golive/${catererId}/status`),

  getChecklist: (catererId: string) => httpClient.get<unknown>(`/admin/golive/${catererId}/checklist`),

  sendReminder: (catererId: string, body: RemindBody) => httpClient.post<unknown>(`/admin/golive/${catererId}/remind`, body),

  sendViaEcoLoop: (catererId: string, body: SendEcoLoopBody) =>
    httpClient.post<unknown>(`/admin/golive/${catererId}/send-ecoloop`, body),
} as const

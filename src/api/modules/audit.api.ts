/**
 * Audit API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/admin/audit/*`. Only `GET /admin/audit` exists in the
 * generated spec today. The still-open decision on whether Audit becomes
 * its own page or stays a Modules & Pricing sub-tab
 * (`development/phase-2-api-integration/Audit.md`) is unaffected by this
 * file and remains undecided.
 */
import { httpClient } from '../client/http'
import type { QueryParams } from '../generated/helpers'

type ListQuery = QueryParams<'/admin/audit', 'get'>

export const auditApi = {
  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/audit', { query }),
} as const

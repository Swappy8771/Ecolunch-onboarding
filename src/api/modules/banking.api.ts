/**
 * Banking API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/admin/banking/*`. One of this phase's 3 reference
 * modules demonstrating full generated-type consumption. Real usage
 * begins when this module's admin page is built (no frontend page exists
 * yet — see `knowledge/03-frontend/phase-2-api-integration/Banking.md`).
 */
import { httpClient } from '../client/http'
import type { RequestBody } from '../generated/helpers'

type CreateOrUpdateBody = RequestBody<'/admin/banking/caterers/{catererId}', 'post'>

export const bankingApi = {
  getByCaterer: (catererId: string) => httpClient.get<unknown>(`/admin/banking/caterers/${catererId}`),

  createOrUpdate: (catererId: string, body: CreateOrUpdateBody) =>
    httpClient.post<unknown>(`/admin/banking/caterers/${catererId}`, body),

  getOverview: (catererId: string) => httpClient.get<unknown>(`/admin/banking/caterers/${catererId}/overview`),

  /** Separately audited server-side — only ever call this behind an explicit user confirmation. */
  reveal: (catererId: string) => httpClient.get<unknown>(`/admin/banking/caterers/${catererId}/reveal`),
} as const

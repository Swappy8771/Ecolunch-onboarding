/**
 * Caterers API module — typed functions only, no React/Query/UI code.
 * Backend: `/api/admin/caterers/*`. One of this phase's 3 reference
 * modules demonstrating full generated-type consumption (path/query
 * params + request bodies come straight from the generated spec; response
 * bodies stay `unknown` — see `src/api/generated/helpers.ts`'s header for
 * why). Real usage begins during this module's own Phase 2 integration —
 * see `development/phase-2-api-integration/Caterers.md`.
 */
import { httpClient } from '../client/http'
import type { PathParams, QueryParams, RequestBody } from '../generated/helpers'

/**
 * The generated `status` filter only covers the four backend-storage
 * statuses (onboarding/active/paused/archived) because the `@openapi`
 * JSDoc block on this route only documents those four — but the real Zod
 * schema (`statusFilterEnum` in `caterers.schema.ts`) also accepts the
 * eight computed *display* statuses (pre-onboarding/in-progress/...) that
 * `GET /admin/caterers` filters on in practice. Widened here to `string`
 * rather than silently left broken; the real fix is a backend JSDoc
 * update so generation reflects the actual accepted values. See
 * `development/phase-3-module-integration/Caterers.md`.
 */
type GeneratedListQuery = QueryParams<'/admin/caterers', 'get'>
export type ListQuery = Omit<GeneratedListQuery, 'status'> & { status?: string }
type CreateBody = RequestBody<'/admin/caterers', 'post'>
type UpdateBody = RequestBody<'/admin/caterers/{id}', 'patch'>
type DetailParams = PathParams<'/admin/caterers/{id}', 'get'>

/**
 * Same widening as `ListQuery.status` (the generated spec only covers the
 * 4 raw db statuses, not the 8 computed display statuses `buildCatererFilter`
 * actually accepts — see `ListQuery`'s doc comment) plus `format`, which
 * previously wasn't sent as a param at all since `export()` took no
 * arguments.
 */
export interface ExportQuery {
  status?: string
  vertical?: string
  assignedAdmin?: string
  search?: string
  format?: 'csv' | 'xlsx'
  [key: string]: string | undefined
}

export interface InviteCatererUserBody {
  email: string
  firstName?: string
  lastName?: string
  role?: 'caterer_admin' | 'caterer_staff'
}

export interface StartSupportSessionResult {
  sessionId: string
  token: string
  expiresAt: string
  caterer: { id: string; companyName: string }
  viewingAsUser: {
    id: string
    catererId: string
    email: string
    firstName: string | null
    lastName: string | null
    role: 'caterer_admin' | 'caterer_staff'
    status: string
  }
}

export const caterersApi = {
  listSimple: () => httpClient.get<unknown>('/admin/caterers/list/simple'),

  list: (query?: ListQuery) => httpClient.get<unknown>('/admin/caterers', { query }),

  /** Returns the raw file blob + parsed filename — pair with `downloadBlob()` to trigger a browser download. */
  export: (query?: ExportQuery) => httpClient.getBlob('/admin/caterers/export', { query }),

  create: (body: CreateBody) => httpClient.post<unknown>('/admin/caterers', body),

  getById: ({ id }: DetailParams) => httpClient.get<unknown>(`/admin/caterers/${id}`),

  update: (id: string, body: UpdateBody) => httpClient.patch<unknown>(`/admin/caterers/${id}`, body),

  archive: (id: string) => httpClient.post<unknown>(`/admin/caterers/${id}/archive`),

  /** `archived → onboarding` only — 400 if the caterer isn't currently archived. See `caterer/NOTES.md` §5.2 "Restore". */
  restore: (id: string) => httpClient.post<unknown>(`/admin/caterers/${id}/restore`),

  invite: (id: string, body: InviteCatererUserBody) => httpClient.post<unknown>(`/admin/caterers/${id}/invite`, body),

  /** "Open Support Access Session" — an audited session, never a normal user switch. See spec §Row Actions. */
  startSupportSession: (id: string, reason: string) =>
    httpClient.post<StartSupportSessionResult>(`/admin/caterers/${id}/support-session`, { reason }),

  endSupportSession: (id: string, sessionId: string) =>
    httpClient.post<unknown>(`/admin/caterers/${id}/support-session/${sessionId}/end`),
} as const

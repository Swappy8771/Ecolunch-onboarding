/**
 * Generic API response shapes — envelope/pagination/metadata patterns
 * that recur across backend modules. Never a copy of a specific module's
 * DTO (that belongs in that module's own `types/` folder).
 *
 * **On "success responses" and "metadata" specifically**: no generic
 * success envelope (e.g. `{ data: T }`) or metadata block (request id,
 * timestamp, etc.) is defined here, because none exists in the real
 * backend — confirmed against this session's own backend work and
 * `backend/src/middleware/errorHandler.ts`: a successful response is
 * just the raw DTO/list shape directly (`GET /admin/golive/:catererId`
 * returns the overview object itself, not `{ data: overview }`), and no
 * module anywhere returns a metadata block. Inventing either type here
 * would document a contract the backend doesn't actually have — see
 * `knowledge/03-frontend/phase-2-api-integration/NOTES.md` for this finding.
 * `ApiListResponse`/`PaginatedResponse` below are kept because that
 * `{ data, total }` / `{ data, total, page, limit }` shape genuinely is
 * the real, repeated pattern across every list endpoint audited this
 * session (Contracts, Corrections, Establishments, Menus, EcoLoop, …).
 */

export interface ApiListResponse<T> {
  data: T[]
  total: number
}

export interface PaginatedResponse<T> extends ApiListResponse<T> {
  page: number
  limit: number
}

/** Matches the backend's actual error body shape exactly (`errorHandler.ts`): a message, plus an optional `details` blob (Zod's `.flatten()` on validation failures, or whatever an `ApiError` was thrown with). */
export interface ApiErrorResponse {
  message: string
  details?: unknown
  [key: string]: unknown
}

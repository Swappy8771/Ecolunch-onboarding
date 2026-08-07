/**
 * Type-level extraction helpers over the generated `paths` map
 * (`./types.ts`). This is hand-written (not generated) — it's the layer
 * that makes the generated types actually *usable* per-endpoint without
 * every module file repeating the same `paths['/x']['get']['parameters']`
 * indexing.
 *
 * **Important, load-bearing finding from this phase:** the backend's
 * `@openapi` JSDoc blocks document `description`s for every response but
 * essentially never a `content`/`schema` (confirmed: 15 of 279 response
 * definitions across the whole spec have any schema at all, and zero
 * reusable `components.schemas` are defined anywhere). `ResponseBody<P, M>`
 * below therefore resolves to `unknown` for nearly every endpoint today —
 * this is not a bug in this file, it's an accurate reflection of what the
 * backend's OpenAPI spec currently documents. See
 * `development/phase-2-api-integration/NOTES.md` for the recommendation
 * this finding produced (add `content.application/json.schema` — ideally
 * via reusable `components.schemas` — to the backend's route JSDoc blocks)
 * and why it isn't done as part of this frontend-scoped phase.
 *
 * Request bodies and path/query parameters, by contrast, ARE meaningfully
 * typed today (29 of 56 write operations have a documented request body
 * schema; path/query parameters are typed for effectively every endpoint,
 * since they come from the route's own `:param` syntax + `@openapi`
 * `parameters` blocks, which were written consistently all session).
 */
import type { paths } from './types'

export type ApiPath = keyof paths
export type ApiMethod<P extends ApiPath> = keyof paths[P] & ('get' | 'post' | 'put' | 'patch' | 'delete')

type OperationOf<P extends ApiPath, M extends keyof paths[P]> = paths[P][M]

export type PathParams<P extends ApiPath, M extends keyof paths[P]> =
  OperationOf<P, M> extends { parameters: { path: infer Params } } ? Params : Record<string, never>

export type QueryParams<P extends ApiPath, M extends keyof paths[P]> =
  OperationOf<P, M> extends { parameters: { query?: infer Params } } ? Params : undefined

export type RequestBody<P extends ApiPath, M extends keyof paths[P]> =
  OperationOf<P, M> extends { requestBody: { content: { 'application/json': infer Body } } }
    ? Body
    : OperationOf<P, M> extends { requestBody?: { content: { 'application/json': infer Body } } }
      ? Body
      : undefined

/**
 * Resolves to the real generated response schema when the backend's spec
 * documents one, and to `unknown` otherwise (see file header) — never
 * `any`, so a caller always has to narrow/assert deliberately rather than
 * silently losing type safety.
 */
export type ResponseBody<P extends ApiPath, M extends keyof paths[P]> =
  OperationOf<P, M> extends { responses: { 200: { content: { 'application/json': infer Body } } } }
    ? Body
    : OperationOf<P, M> extends { responses: { 201: { content: { 'application/json': infer Body } } } }
      ? Body
      : unknown

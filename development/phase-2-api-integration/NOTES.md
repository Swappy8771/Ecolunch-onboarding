# Phase 2 — API Integration — Working Blueprint

**Status:** 🚧 Typed API Contract Layer implemented — per-module page
integration not started · **Updated:** 2026-07-29

---

## Sub-phase: Typed API Contract Layer (implemented 2026-07-29)

Before any module's own page gets integrated, this sub-phase built the
shared typed-contract infrastructure every module integration will build
on. Documented here since it's Phase 2 scope but precedes the per-module
work below.

### OpenAPI source decision

The backend generates its spec via `swagger-jsdoc` from `@openapi` JSDoc
blocks in `*.routes.ts` files (`backend/src/config/swagger.ts`), mounted
at `/docs.json`. A static snapshot (122 paths) was captured by a temporary
script run from inside `backend/` (immediately deleted after use — no
backend files were changed) rather than generating types against a live
server, so type generation works without a running backend/DB. The
snapshot lives at `src/api/generated/openapi.json` and is committed so the
generated types are reproducible without backend access.

Two regeneration scripts were added to `package.json`:
- `generate:api-types` — regenerates from the committed local snapshot.
- `generate:api-types:live` — regenerates from a running backend at
  `http://localhost:4000/docs.json` (confirmed default port via
  `backend/src/config/env.ts`; `/docs.json` is mounted at root, not under
  the API prefix).

### Type-generation strategy

`openapi-typescript` (already the recommended tool; added as a
devDependency) generates `src/api/generated/types.ts` (`paths`/
`components`/`operations` interfaces) from `openapi.json`. This file has
the standard "Do not make direct changes" generated-file header and is
never hand-edited — confirmed by re-running `generate:api-types` and
diffing against the committed file (no drift).

`src/api/generated/helpers.ts` is hand-written (not generated) and
provides `PathParams<P,M>`/`QueryParams<P,M>`/`RequestBody<P,M>`/
`ResponseBody<P,M>`, indexing into `paths[P][M]` by **literal path
string** rather than the `operations` namespace. This was a deliberate
choice: only 11 of 141 operations in the spec have an `operationId` (the
`operations[...]` namespace requires one), while `paths[path][method]`
works for all 141. Using literal paths also means a typo'd or
renamed/removed path fails to typecheck — real drift detection.

**Critical finding, carried forward as backend follow-up work, not
worked around on the frontend:** the spec has real response-body schemas
for only **15 of 279** response definitions, and **zero**
`components.schemas` defined anywhere. `ResponseBody<P,M>` therefore
resolves to `unknown` for nearly every operation — this is not a bug in
`helpers.ts`, it's an honest reflection of what the backend spec actually
documents today. By contrast, **29 of 56** write operations do have real
request-body schemas (this session's own `@openapi` blocks documented
request bodies without documenting responses), so `RequestBody<P,M>` is
meaningfully typed far more often than `ResponseBody<P,M>` is. Every
module function below returns `Promise<unknown>` from `httpClient` as a
result — narrowing that to a real type is future work, gated on the
backend adding `content.application/json.schema` (ideally via
`components.schemas`) to its route JSDoc, module by module, not something
the frontend can invent without duplicating/guessing the backend's actual
contract.

### Module API files

All 13 previously-empty placeholder files
(`src/api/modules/*.api.ts`) were refactored into real typed functions
calling `httpClient`, one function per real backend endpoint, verified
against `openapi.json` path-by-path (not assumed from memory) for every
module. A 14th file, `modulesRequiredSetup.api.ts`, was added — see
"Architectural Decisions" below. Every function: typed path/query/body
params via `helpers.ts` where the spec provides them, `unknown` response
type (see finding above), no React/Query/UI code, named exports only via
a single `as const` object per module (matching the pre-existing
Phase 1.1 placeholder convention).

### Query keys

`src/api/queryKeys.ts` — one object per module (`caterers`, `banking`,
`establishments`, `menus`, `documentVault`, `contracts`, `modules`,
`modulesRequiredSetup`, `corrections`, `validation`, `golive`, `ecoloop`,
`users`, `audit`), each with an `all` key plus factory functions returning
`as const` tuples. No component/hook should ever write a key literal
directly — this is the single source of truth so a mutation's
`invalidateQueries` can target exactly the keys it affects.

### Query/mutation hook factories

`src/api/hooks/{useQueryFactory,useMutationFactory}.ts` — generic
`createQueryHook`/`createMutationHook` builders on top of Phase 1.1's
`useApiQuery`/`useApiMutation`. No module-specific hooks were created yet
(that's per-module Phase 2 integration work); this is infrastructure only.

### Mapping infrastructure

`src/api/mappers/types.ts` — `Mapper<TDto,TViewModel>` generic + `mapList`/
`mapNullable` helpers. Three named placeholder files
(`contracts.mapper.ts`, `documentVault.mapper.ts`, `corrections.mapper.ts`)
exist per the approved file list but are not implemented (`export {}` +
explanatory comment) — real mapping logic is per-module Phase 2 work,
and `documentVault.mapper.ts`'s comment specifically flags the
status-vocabulary drift already found this session as something its real
implementation will need to reconcile.

### Error model

`src/api/client/errors.ts` extended with `ApiErrorKind` (`'network' |
'validation' | 'authentication' | 'authorization' | 'not_found' |
'conflict' | 'server' | 'unknown'`), `getErrorKind()`, a `.details` getter
on `ApiError`, and `isValidationError`/`isNetworkError` type guards
(alongside the pre-existing `isUnauthorized`). Verified against the real
backend shape (`backend/src/middleware/errorHandler.ts`): Zod validation
failures return `{ message: 'Validation failed', details: err.flatten() }`;
thrown `ApiError`s return `{ message, details? }`; unhandled errors return
`{ message: 'Internal server error', error? }` (non-prod only) — `details`
was added to `ApiErrorResponse`/`ApiErrorBody` to match.

### What was explicitly not done (out of this sub-phase's scope)

- No feature page was modified, no mock data replaced, no backend
  endpoint consumed by any UI component.
- No per-module hooks (e.g. `useContractsQuery`) were created — only the
  factories that will build them.
- No mapper bodies were implemented.
- Response-body types were not fabricated to work around the schema gap.

---

### What are we building?

Real backend integration for all 14 target modules listed below, one at a
time, each following the same workflow: document → approve → implement →
audit → update `ROADMAP.md`/`CHANGELOG.md`.

### Why is it needed?

Phase 1 establishes *how* a module talks to the backend. Phase 2 is doing
that, module by module, until every admin page renders real data instead
of a mock array.

### Current state

See the per-module table in the top-level `ROADMAP.md`. Summary: 8 of 14
modules have an existing mock-data admin page to convert; 6 need a page
built from scratch (Banking, Establishments, Menus, Users, an admin-side
Corrections view, Audit as its own surface); 2 modules (Validation Center,
Go-Live) have duplicate frontend implementations that need reconciling
before integration, not after.

### Problems identified

- Not every module's mock data shape matches its backend DTO — this was
  found repeatedly during this session's *backend* work (mock enums with
  extra/missing/renamed values vs. the real schema) and should be assumed
  true on the frontend side too until each module's doc explicitly checks.
- Order matters: integrating a module whose gate/progress computation
  depends on another un-integrated module (e.g. Go-Live's checklist
  aggregates Banking/Establishments/Menus/Document Vault/Contracts/
  Corrections/Modules & Required Setup) risks a page that looks wired but
  silently shows stale/empty data for its dependencies. Suggested order:
  integrate the modules Go-Live depends on before integrating Go-Live's
  own checklist view.

### Proposed solution

One markdown file per module below, each following the same template as
this file (What/Why/Current state/Problems/Proposed solution/Expected
architecture/Risks/Dependencies/Open Questions/Acceptance Criteria/Audit
Notes), populated in detail immediately before that module's
implementation begins — not all up front, since backend contracts and
frontend priorities may shift between now and when a given module's turn
comes.

### Expected architecture

Per `ARCHITECTURE.md` — one `services/api.ts` + `hooks/` per module,
consistent query-key/error-handling conventions from `REACT_QUERY.md`/
`API_LAYER.md`.

### Risks

Scope creep risk: 6 of 14 modules need a new page built, not just a mock
swap — if estimated/planned as if all 14 were equally sized, the plan will
be wrong from the start.

### Dependencies

All of Phase 1's acceptance criteria must be met first.

### Open Questions

1. **Integration order** — not decided. Candidate: start with a module
   that already has a stable page + stable backend contract (Contracts or
   Modules & Pricing) to prove the pattern, before tackling
   build-from-scratch modules.
2. **Should Validation Center's / Go-Live's duplicate frontend
   implementations be reconciled as part of Phase 1's dead-code cleanup,
   or as the first step of each module's own Phase 2 doc?** Not decided —
   leaning toward Phase 1 (removing ambiguity before any module-specific
   work starts), but not locked in.

### Architectural Decisions (Typed API Contract Layer sub-phase)

1. **Modules & Required Setup gets its own `modulesRequiredSetup.api.ts`**,
   resolving the open item left in Phase 1.1's placeholder comment — it is
   a distinct backend module (`/admin/modules-required-setup/*`, pure
   aggregation, no persistence) from Modules & Pricing
   (`/admin/modules-pricing/*`), and `queryKeys.ts` had already modeled
   them as separate keys, so one API file per backend module keeps that
   consistent.
2. **`paths[path][method]` over `operations[operationId]`** for type
   extraction (see "Type-generation strategy" above) — the sparse
   `operationId` coverage (11/141) made the operations namespace
   impractical as the primary interface.
3. **Response types stay `unknown`** rather than being hand-authored to
   "fill the gap" — inventing response schemas here would silently
   duplicate/guess a contract the backend doesn't actually document,
   which is exactly the kind of undocumented assumption this whole
   phased process exists to avoid. Recorded as backend follow-up work
   instead.

### Acceptance Criteria

- [ ] Every module below has its own populated doc before its
      implementation begins.
- [ ] Every module's frontend types are explicitly checked against the
      real backend DTO at integration time (not assumed from the mock).
- [ ] Every module's audit entry is appended to that module's own doc.

### Audit Notes

Per-module audits live in each module's own file, not here.

---

## Modules

| # | Module | Doc |
|---|---|---|
| 1 | Caterers | [`Caterers.md`](./Caterers.md) |
| 2 | Banking | [`Banking.md`](./Banking.md) |
| 3 | Establishments | [`Establishments.md`](./Establishments.md) |
| 4 | Menus | [`Menus.md`](./Menus.md) |
| 5 | Document Vault | [`DocumentVault.md`](./DocumentVault.md) |
| 6 | Contracts | [`Contracts.md`](./Contracts.md) |
| 7 | Modules & Pricing | [`ModulesPricing.md`](./ModulesPricing.md) |
| 8 | Modules & Required Setup | [`ModulesRequiredSetup.md`](./ModulesRequiredSetup.md) |
| 9 | Corrections | [`Corrections.md`](./Corrections.md) |
| 10 | Validation Center | [`ValidationCenter.md`](./ValidationCenter.md) |
| 11 | Go-Live | [`GoLive.md`](./GoLive.md) |
| 12 | EcoLoop | [`EcoLoop.md`](./EcoLoop.md) |
| 13 | Users | [`Users.md`](./Users.md) |
| 14 | Audit | [`Audit.md`](./Audit.md) |

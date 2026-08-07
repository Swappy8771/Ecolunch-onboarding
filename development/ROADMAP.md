# Frontend Roadmap

**Updated:** 2026-07-29

---

## Current Phase

**Phase 3 (Module Integration) in progress — Caterers and Document Vault
integrated.** `/admin/caterers` and `/admin/document-vault` now call the
real backend. Document Vault's integration also included a backend audit
that found and fixed gaps in the underlying Documents module (no DTO
layer, no Swagger response schemas, no uploader-name resolution) before
any frontend code was touched. 12 modules remain; Banking is blocked (no
admin-side page/mock exists — see `phase-3-module-integration/NOTES.md`'s
module table). See `Caterers.md`/`DocumentVault.md` for each module's own
mock-vs-real-DTO drift findings. Still open, carried forward and
unrelated to Phase 3's scope: Phase 1's dead-tree removal / login page /
`AuthProvider` mounting.

---

## Phases

### Phase 1 — Foundation
Status: 🚧 In progress — API foundation (1.1) done; dead-code removal and
login-page/route-guard wiring remain.
The pieces every module-level integration depends on: a real, typed HTTP
client (✅ done); auth wiring (infrastructure ✅ done — login page + route
guarding + dead-code removal still open); a chosen data-fetching/caching
strategy (✅ TanStack Query installed/configured); environment
configuration (✅ `.env.example` created — dev proxy still open); removal
of the dead/duplicate frontend trees discovered during the baseline audit
(⏳ not started). See `phase-1-foundation/NOTES.md`.

### Phase 2 — API Integration
Status: 🚧 In progress — Typed API Contract Layer done; per-module page
integration now tracked under Phase 3 (below).
One document per backend module, each carrying its own approval →
implement → audit cycle. See `phase-2-api-integration/NOTES.md` for the
full module list and current per-module status table.

### Phase 3 — Module Integration
Status: 🚧 In progress — Caterers integrated as the reference
implementation; 13 modules remain.
Establishes the standard Page → feature hook → API module → HTTP client →
Backend pattern with one fully-integrated module, then repeats it for
every remaining module. See `phase-3-module-integration/NOTES.md`.

### Phase 4 — Polish
Status: ⏳ Not started — blocked on Phase 3
Performance, testing, accessibility, and a final cross-module audit once
every module in Phase 3 is wired and wired *consistently* (same client,
same query patterns, same error handling). Note: this tree's folder is
still named `phase-3-polish/` from the original doc scaffold, predating
the introduction of a dedicated Module Integration phase — not renamed
here to avoid an unrelated churn commit; the number in this table is the
authoritative one.

---

## Completed Milestones

- 2026-07-28 — Documentation scaffold created (this tree). No frontend
  code changed.
- 2026-07-28 — Baseline audit performed (see `phase-1-foundation/AUDIT.md`)
  confirming: zero real API calls exist anywhere in the frontend; an HTTP
  client exists but has no call sites; an auth Redux slice exists but is
  never dispatched to; Redux itself is otherwise fully unused; only one
  module (EcoLoop) has any loading/error UI pattern, and it's driven by a
  fake timer, not a real async lifecycle; 8 of 14 target modules have a
  mock-data admin page, the other 6 (Banking, Establishments, Menus, Users,
  Corrections-admin, Audit-as-its-own-surface) do not exist yet; two fully
  orphaned duplicate frontend trees exist (`src/features/onboarding/`,
  `src/routes/admin/`) totaling ~2,600+ lines.
- 2026-07-29 — Phase 1.1 (API Foundation) implemented: shared HTTP client
  (`src/api/client/`), 13 module API boundary placeholders
  (`src/api/modules/`), TanStack Query installed/configured and mounted,
  auth infrastructure (`src/auth/`, built but not yet mounted), shared
  token/URL utilities and API/common types. The two dead HTTP-client files
  (`src/api/http.ts`/`cache.ts`, both zero-call-site) were removed and
  superseded by the new structure. `npm run typecheck` and `npm run lint`
  both pass on the new code. No feature pages touched, no mock data
  replaced, no routing changed. See `phase-1-foundation/AUDIT.md` for the
  full post-implementation audit.

- 2026-07-29 — Phase 2 (Typed API Contract Layer) implemented: OpenAPI
  types generated from the backend's real spec
  (`src/api/generated/{openapi.json,types.ts,helpers.ts}`); all 13 module
  `*.api.ts` files refactored from empty placeholders into real typed
  functions against every actual backend route, plus a new 14th file
  (`modulesRequiredSetup.api.ts`, split out from `modules.api.ts`); a
  module-organized query-key factory (`src/api/queryKeys.ts`);
  query/mutation hook factories; DTO→ViewModel mapping infrastructure
  (3 named placeholders, not implemented); an extended, unified error
  model. `npm run typecheck`/`npm run lint` both pass on the new/changed
  files. No feature page touched, no mock data replaced, no backend
  endpoint consumed by any UI component. Critical finding: the generated
  spec has real response schemas for only 15/279 response definitions and
  zero `components.schemas`, so response-body types resolve to `unknown`
  almost everywhere — flagged as backend follow-up work, not papered over.
  See `phase-2-api-integration/NOTES.md`.

- 2026-07-29 — Phase 3 (Module Integration) started: Caterers integrated
  as the reference implementation (`src/features/caterers/`) —
  list/search/filter/pagination/create/archive on `/admin/caterers` now
  call the real backend. Diffing the mock against the real DTO for the
  first time found five genuine gaps (status vocabulary, a backend
  JSDoc/Zod drift, unresolvable admin name, missing validations/tickets
  counts, a 100-caterer stat-card cap) — all documented in
  `phase-3-module-integration/Caterers.md`, none invented around.
  `npm run typecheck`/`npm run lint` both pass; verified against a live
  dev server with no backend running (renders correctly, shows a real
  error instead of crashing). No other module touched.

- 2026-07-29 — Phase 3: Document Vault audited and integrated
  (`src/features/documentVault/`). Backend audit (done before any
  frontend work) found the Document Vault orchestration layer itself was
  already correctly architected, but the underlying Documents module had
  no DTO layer, no Swagger response schemas, and no uploader-name
  resolution — all three fixed backend-side (new `documents.dto.ts`,
  batch `uploadedByName` via the Users seam built for Caterers). Frontend
  audit found two components (`CategoryGrid`, `DocumentTable`) that looked
  wired but silently ignored which caterer/category was selected — both
  now genuinely scoped. `npm run typecheck`/`npm run lint` clean on both
  backend and frontend; verified against a live dev server with no
  backend running. See `phase-3-module-integration/DocumentVault.md`.

## Upcoming Milestones

1. Remove or reconcile the two orphaned duplicate trees
   (`src/features/onboarding/`, `src/routes/admin/`) — not done as part
   of 1.1, since that was explicitly infrastructure-only scope.
2. Add the Vite dev proxy (`ENVIRONMENT.md`) and confirm the backend's
   actual local port/CORS configuration — not yet verified.
3. Build a real login page and wire `AuthProvider`/`ProtectedRoute` into
   `main.tsx`/`App.tsx` — deliberately deferred in 1.1 (see
   `phase-1-foundation/AUDIT.md`'s "Remaining Work").
4. Begin Phase 2, module by module, in an order to be decided in
   `phase-2-api-integration/NOTES.md` (candidates: start with a module that
   already has a live admin page and a stable backend contract, e.g.
   Contracts or Modules & Pricing, before tackling modules that need a new
   page built from scratch).

## Remaining Modules (Phase 3 scope)

| Module | Frontend page exists today? | Backend ready? |
|---|---|---|
| Caterers | ✅ **integrated (real backend)** | ✅ |
| Banking | ❌ none (admin-side) — blocked, see `phase-3-module-integration/NOTES.md` | ✅ |
| Establishments | ❌ none | ✅ |
| Menus | ❌ none | ✅ |
| Document Vault | ✅ **integrated (real backend)** | ✅ (audited + enhanced this session — DTO layer, Swagger, uploader-name resolution added to the underlying Documents module) |
| Contracts | ✅ (mock) | ✅ (built/audited this session) |
| Modules & Pricing | ✅ (mock) | ✅ |
| Modules & Required Setup | ⚠️ likely partial (`modules-config` sub-page — needs confirmation) | ✅ (built/audited this session) |
| Corrections | ⚠️ client-portal only, no admin page | ✅ (built/audited this session) |
| Validation Center | ✅ (mock — 2 duplicate implementations exist) | ✅ |
| Go-Live | ✅ (mock — 2 duplicate implementations exist) | ✅ (built/audited this session) |
| EcoLoop | ✅ (mock, closest to a real async pattern already) | ✅ |
| Users | ❌ none | ✅ |
| Audit | ⚠️ sub-tab inside Modules & Pricing only, not its own surface | ✅ |

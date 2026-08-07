# Frontend Changelog

Every meaningful frontend change is recorded here, most recent first. Each
entry: **Date · Feature · Files · Reason · Impact**.

---

## 2026-07-29 — Caterers: Create/Edit modal brought to production parity

- **Feature:** the Create Caterer modal, previously capturing only
  4 fields, now captures the full production field set (business info,
  location, verticals, assigned admin, primary/secondary contact,
  address, tax); a genuinely new Edit Caterer modal was added (none
  existed before — only a read-only detail view did); a "Restore
  Caterer" row action was wired for archived caterers (the backend's
  `/restore` endpoint had existed since an earlier Caterers task but was
  never consumed by any UI).
- **Files created:** `src/admin/caterers/components/CatererFormModal.tsx`;
  `src/features/caterers/hooks/useRestoreCaterer.ts`;
  `src/features/users/{types,mappers,hooks}/*` (new feature, built to
  power the Assigned Admin picker via `GET /admin/users`).
- **Files modified:** `src/features/caterers/types/caterer.types.ts` and
  `mappers/caterer.mapper.ts` (expanded to the full backend DTO shape —
  trading name, organization type, website, founded year, address, tax,
  contacts, resolved admin name/email, real validation/ticket counts);
  `hooks/{useCreateCaterer,useUpdateCaterer}.ts` (send the full profile);
  `src/api/modules/caterers.api.ts` (added `restore()`);
  `src/admin/caterers/pages/AdminCaterersPage.tsx` (wired to all of the
  above; detail modal gained an Edit button and a profile-details
  section); `backend/src/modules/caterers/caterers.routes.ts` (corrected
  the `POST`/`PATCH` Swagger request-body docs, which had undersold what
  the real Zod schemas already accepted — a documentation fix, not a
  contract change); `src/api/generated/{openapi.json,types.ts}`
  (regenerated).
- **Reason:** the Create/Edit modal was the last piece of the Caterers
  module not yet at production parity — the backend had supported this
  full field set since an earlier task, but the frontend form and mapper
  had never caught up.
- **Impact:** no backend field, Mongo schema, or API contract changed —
  only a Swagger documentation correction and additive frontend work.
  No client-side validation duplicates the backend's Zod rules; validation
  errors surface via the existing `ApiError`/`isValidationError`
  infrastructure. `npm run typecheck`/`npm run lint` clean on both
  backend and frontend (16 pre-existing frontend findings, none new).
  Verified in a real browser: all form sections render, the assigned-admin
  picker opens, and a failed submission (no backend running) keeps the
  modal open with a visible error banner instead of crashing or silently
  closing. See `development/phase-3-module-integration/Caterers.md`'s
  "Production Modal UI Parity" section for the full field-by-field record.

---

## 2026-07-29 — Phase 3: Document Vault module audited and integrated

- **Feature:** the Document Vault admin page (3-level drill-down: caterer
  vault grid → category tiles → document table) now calls the real
  backend at every level. Preceded by a full backend audit (per the
  task's explicit "audit first, implement only confirmed gaps"
  instruction) that found and fixed real gaps in the *backing* Documents
  module before any frontend code was touched.
- **Backend files created:** `backend/src/modules/documents/documents.dto.ts`.
- **Backend files modified:** `documents.service.ts` (routed through the
  new DTO; added batch `uploadedByName`/`reviewedByName` resolution via
  the existing `usersService.findByIds()` seam); `documents.routes.ts` and
  `document-vault/document-vault.routes.ts` (added Swagger response
  schemas — previously description-only for every endpoint in both
  modules).
- **Frontend files created:** `src/features/documentVault/{types,mappers,hooks}/*`
  (see `development/phase-3-module-integration/DocumentVault.md` for the
  full list).
- **Frontend files modified:** `src/admin/document-vault/pages/
  AdminDocumentVaultPage.tsx` and all 4 of its components, rewired to real
  hooks; `src/api/generated/{openapi.json,types.ts}` regenerated against
  the enhanced backend spec.
- **Frontend files removed:** `src/admin/document-vault/services/mock/documentVaultMock.tsx`
  (zero other call sites, confirmed before deletion).
- **Reason:** prove the "audit an already-implemented backend, fix only
  confirmed gaps, then integrate" pattern — a variant of Caterers'
  "integrate the page" pattern, but starting from a backend that was
  mostly already correct rather than needing a full DTO-layer buildout.
- **Impact:** `/admin/document-vault` now renders live data. The audit
  found two frontend components (`CategoryGrid`, `DocumentTable`) that
  looked wired but silently rendered static/hardcoded data regardless of
  the selected caterer/category — both are now genuinely scoped. Category
  tiles changed meaning from "raw upload count" to "requirements
  approved/pending/missing" (documented as a deliberate shift, matching
  what the backend's requirement-catalogue layer actually computes).
  `npm run typecheck`/`npm run lint` clean on both backend and frontend;
  verified in a real browser against a dev server with no backend running
  (renders correctly, shows a real error instead of crashing). See
  `development/phase-3-module-integration/DocumentVault.md` for the full
  finding-by-finding record.

---

## 2026-07-29 — Phase 3: Caterers module integrated (reference implementation)

- **Feature:** the Caterers admin page (list/search/filter/paginate/
  create/archive) now calls the real backend instead of a local mock
  array, establishing the standard Page → feature hook → API module →
  HTTP client → Backend pattern every remaining module will reuse.
- **Files created:** `src/features/caterers/types/caterer.types.ts`;
  `src/features/caterers/mappers/caterer.mapper.ts`;
  `src/features/caterers/hooks/{useCaterers,useCaterer,useCreateCaterer,useUpdateCaterer,useArchiveCaterer}.ts`;
  `development/phase-3-module-integration/{NOTES,Caterers,AUDIT}.md`.
- **Files modified:** `src/admin/caterers/pages/AdminCaterersPage.tsx`
  (rewired to the hooks above; status/vertical labels rebuilt around the
  real backend vocabulary — see below; a new "Archive Caterer" row action
  added; create-modal fields made controlled/submitting); `src/api/
  modules/caterers.api.ts` (`ListQuery.status` widened from the generated
  literal union to `string` — a documented backend JSDoc/Zod drift, not
  an arbitrary shortcut).
- **Files removed:** `src/admin/caterers/services/mock/caterersMock.ts`
  (zero other call sites, confirmed before deletion) and its now-empty
  `mock/` directory.
- **Reason:** prove the Phase 2 contract layer against one real page
  before repeating the work across the remaining 13 modules.
- **Impact:** `/admin/caterers` now renders live data (verified against a
  real dev server with no backend running: the table shows a loading
  spinner then a real error message, no crash). Diffing the mock against
  the real DTO for the first time surfaced five genuine gaps — status
  vocabulary had no backend equivalent at all, a backend JSDoc/Zod drift
  on the `status` filter, `assignedAdminId` has no resolved name without
  the Users module, `validations`/`tickets` don't exist on the DTO at all
  (require Validation Center/EcoLoop), and stat cards are exact only up to
  100 caterers (backend `limit` cap) — all documented, none invented
  around, in `phase-3-module-integration/Caterers.md`. `npm run
  typecheck`/`npm run lint` both pass (lint count actually dropped by one,
  fixing a pre-existing violation in the code being rewritten). No other
  module was touched.

---

## 2026-07-29 — Phase 2: Typed API Contract Layer implemented

- **Feature:** a strongly-typed integration layer generated from the
  backend's real OpenAPI spec. Adds: `openapi-typescript`-generated types
  (`src/api/generated/types.ts`, `openapi.json` snapshot), hand-written
  extraction helpers (`src/api/generated/helpers.ts`) that index into the
  generated `paths` map by literal path string (so a typo'd/nonexistent
  path fails to typecheck), all 13 module `*.api.ts` files refactored from
  empty placeholders into real typed functions calling `httpClient`
  against every actual backend route (plus a new 14th file,
  `modulesRequiredSetup.api.ts`, split out from `modules.api.ts` — see
  "Architectural Decisions" below), a module-organized query-key factory
  (`src/api/queryKeys.ts`), query/mutation hook factories
  (`src/api/hooks/{useQueryFactory,useMutationFactory}.ts`), DTO→ViewModel
  mapping infrastructure (`src/api/mappers/{types,contracts.mapper,
  documentVault.mapper,corrections.mapper}.ts` — infrastructure and 3
  named placeholders only, no mapper bodies implemented), and an extended
  error model (`ApiErrorKind`, `getErrorKind()`, `.details` getter,
  `isValidationError`/`isNetworkError`) normalizing backend errors into
  one consistent shape.
- **Files created:** `src/api/generated/{openapi.json,types.ts,helpers.ts}`;
  `src/api/queryKeys.ts`; `src/api/hooks/{useQueryFactory,useMutationFactory}.ts`;
  `src/api/mappers/{types,contracts.mapper,documentVault.mapper,corrections.mapper}.ts`;
  `src/api/modules/modulesRequiredSetup.api.ts`.
- **Files modified:** all 13 pre-existing `src/api/modules/*.api.ts`
  placeholders (now real typed functions); `src/api/client/errors.ts`
  (error classification added); `src/api/client/index.ts` (new exports);
  `src/shared/types/api.ts` (`details?` added to `ApiErrorResponse`,
  explicit documented decision against inventing a generic success
  envelope or metadata type); `package.json` (added `openapi-typescript`
  devDependency, `generate:api-types`/`generate:api-types:live` scripts).
- **Reason:** every module's real Phase 2 page-integration work needs a
  typed contract to code against — this phase builds that contract layer
  in isolation, before any feature page is touched, per
  `phase-2-api-integration/NOTES.md`.
- **Impact:** the app still renders 100% mock data everywhere — no feature
  page, mock array, or route was touched. No backend endpoint is consumed
  by any UI component yet. `npm run typecheck`/`npm run lint` both pass on
  the new/changed files (pre-existing lint findings elsewhere untouched).
  Critical finding carried forward: the generated spec has real response
  schemas for only 15 of 279 response definitions and zero
  `components.schemas` — so `ResponseBody<P,M>` (and every module
  function's return type) honestly resolves to `unknown` almost
  everywhere; response-body type safety will require backend schema work,
  not a frontend workaround. See `phase-2-api-integration/NOTES.md` for
  the full decision record.

---

## 2026-07-29 — Phase 1.1: API Foundation implemented

- **Feature:** the shared API client (`src/api/client/`), 13 module API
  boundary placeholders (`src/api/modules/`), a shared API hook wrapper
  (`src/api/hooks/useApi.ts`), TanStack Query installed and configured
  and mounted at the app root, auth infrastructure (`src/auth/`, built as
  a thin facade over the existing `authSlice` rather than a second
  parallel store), shared token/URL utilities (`src/shared/utils/`), and
  shared API/common types (`src/shared/types/`). No feature pages
  touched, no mock data replaced, no routing changed.
- **Files created:** `.env.example`; `src/api/client/{config,errors,auth,http,queryClient,index}.ts`;
  `src/api/modules/{caterers,banking,establishments,menus,documentVault,contracts,modules,corrections,validation,golive,ecoloop,users,audit}.api.ts`;
  `src/api/hooks/useApi.ts`; `src/auth/{auth.types,auth.utils,AuthProvider,ProtectedRoute,index}.{ts,tsx}`;
  `src/shared/utils/{storage,url}.ts`; `src/shared/types/{api,common}.ts`.
- **Files modified:** `package.json`/`package-lock.json` (added
  `@tanstack/react-query`, added a `typecheck` script — none existed
  before); `src/main.tsx` (mounted `QueryClientProvider` alongside the
  existing Redux `Provider`, per `REACT_QUERY.md`'s explicit requirement).
- **Files removed:** `src/api/http.ts`, `src/api/cache.ts` — both had zero
  call sites anywhere (confirmed via the Phase 1 baseline audit and a
  fresh grep before deletion); their functionality is fully superseded by
  `src/api/client/http.ts`. Removing them avoids leaving two competing
  "the HTTP client" implementations side by side, which is exactly the
  ambiguity the baseline audit flagged as a risk for the orphaned page
  trees.
- **Reason:** every Phase 2 module integration depends on this foundation
  existing first — see `phase-1-foundation/NOTES.md`.
- **Impact:** the app still renders 100% mock data everywhere — nothing
  is wired to a real endpoint yet. `AuthProvider`/`ProtectedRoute` are
  built and typecheck but are **not mounted** in `main.tsx`/`App.tsx` (see
  `phase-1-foundation/NOTES.md`'s "Remaining Work" — deliberately deferred
  until a real login page exists, so no currently-navigable page becomes
  unreachable this phase).

---

## 2026-07-28 — Frontend development documentation scaffold created

- **Feature:** the `Ecolunch/development/` documentation tree (this file
  and everything alongside it) — mirrors `backend/development/`'s
  discipline for the frontend.
- **Files:** `README.md`, `ROADMAP.md`, `CHANGELOG.md`, `ARCHITECTURE.md`,
  `STANDARDS.md`, `phase-1-foundation/*`, `phase-2-api-integration/*`,
  `phase-3-polish/*`.
- **Reason:** the frontend is about to be connected to a real backend API
  for the first time (currently 100% mock data, zero network calls
  anywhere) — this documentation exists so every architecture decision
  (HTTP client shape, auth wiring, data-fetching library, per-module
  integration order) is written down and approved *before* code is
  written, rather than discovered mid-implementation the way several
  backend-side spec/code disagreements were discovered this session.
- **Impact:** none — no frontend source code was touched. This is a
  documentation-only commit.

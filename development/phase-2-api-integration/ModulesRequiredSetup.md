# Modules & Required Setup — API Integration

**Status (admin-viewable mirror):** ⏳ Not started — no admin page consumes `modulesRequiredSetup.api.ts`/`queryKeys.modulesRequiredSetup` yet, both still orphaned scaffolding · **Status (Caterer Portal page):** ✅ Done — see below · **Backend:** `/api/admin/modules-required-setup/*` (existing) + `/api/caterer/modules-required-setup/*` (5 new read-only endpoints, built this pass) · **Frontend:** `src/client/modules/` — Caterer Portal side, now wired to real data; admin-side coverage still unconfirmed (possibly `modules-config` under Modules & Pricing — see that module's doc, still 100% mock and orphaned from the sidebar)

### What are we building?
Wiring the setup-checklist/progress/missing-items view to the new,
pure-aggregation backend module (no persistence of its own — it reads
Establishments/Menus/Document Vault/Modules & Pricing's own already-
computed outputs).

### Why is it needed?
This is a caterer-portal page today (`src/client/modules/pages/
ClientModulesPage.tsx`) — per every prior backend blueprint's own D1
reference, the caterer portal is currently paused, so this needs an
**admin-viewable mirror**, not a caterer-facing integration, matching the
pattern already used for every other caterer-portal-content module this
session (Establishments, Menus, Document Vault, Contracts all ship
admin-viewable-only in the current phase).

### Current state
The only existing frontend for this concept is the client-portal mock,
which uses a **materially different checklist item set** than the real
spec doc the backend was built from (verified this session:
Accounting/ReportIQ mocks share almost no items with the spec's real
lists) — this mock should **not** be used as the source of truth for the
real integration; the backend's own `SETUP_REQUIREMENTS` catalogue is.

### Problems identified
- The client mock's per-module item lists are largely fictional relative
  to both the real spec and the real (partially-implemented) backend
  catalogue — do not port them as-is.
- The real backend catalogue implements only 35 of 47 spec items (12
  excluded, with reasons documented in the backend service file) — the
  frontend must render exactly what the backend returns, not backfill the
  missing 12 with invented data.

### Proposed solution
Build a new admin-side page (or repurpose `modules-config` if that's
confirmed to be the right target — see `ModulesPricing.md`) against the
real `getOverview()`/`getModuleDetail()`/`getProgress()`/`getMissingItems()`
endpoints.

### Expected architecture
Standard pattern; `types/` hand-mirrored from
`backend/src/modules/modules-required-setup/modules-required-setup.dto.ts`.

### Risks
Highest content-drift risk after Document Vault — the existing mock is
richer-looking than the real backend data will be (ReportIQ has zero
implemented checklist items server-side today) — the UI must handle
"module active but zero checklist items configured yet" gracefully, not
assume every section always has content.

### Dependencies
Phase 1 complete. Benefits from Establishments/Menus/Document Vault being
integrated first, since this module's checklist items are pointers into
their data.

### Open Questions
11 already documented in `backend/development/admin/models/
modules-required-setup/NOTES.md` — most importantly, Corrections/Go-live/
EcoLoop's linked panels have no real per-module filtering granularity
today (they'll return broader or empty results, not precisely scoped
ones) — the UI should not imply a precision the backend doesn't have.

### Acceptance Criteria
- [ ] Confirmed target page (new build vs. `modules-config` repurpose).
- [ ] Checklist rendered exactly from `getModuleDetail()`, including
      empty sections, with no invented items.

### Audit Notes
_(populate after implementation — admin-viewable mirror still not built)_

---

## Caterer Portal — Modules & Required Setup (`src/client/modules/pages/ClientModulesPage.tsx`)

**Status:** ✅ Done · **Backend:** `/api/caterer/modules-required-setup/*` (5 new endpoints, built this pass — didn't exist before)

### What was there before
100%-hardcoded mock: a fixed `MODULES: ModuleData[]` array with fictional per-module checklist items, linked documents, corrections, blockers, and EcoLoop threads — confirmed materially different from both the real client spec and the real (partially-implemented) backend `SETUP_REQUIREMENTS` catalogue. No API calls anywhere in the file.

### What was built
- **Backend** (didn't exist before): `modules-required-setup.controller.caterer.ts` / `.routes.caterer.ts`, mounted at `/caterer/modules-required-setup` — reuses the existing, unmodified `modulesRequiredSetupService` verbatim (`getOverview`, `getActiveModules`, `getProgress`, `getMissingItems`, `getModuleDetail`), with `catererId` sourced from the caterer's own auth token. No pricing-stripping step was needed — this module's DTOs (`modules-required-setup.dto.ts`) never carried a pricing/commercial field to begin with, confirmed by direct read. Full detail: `backend/development/caterer/models/modules-required-setup/NOTES.md` §7.
- **Frontend:** `src/api/modules/caterer-modules-required-setup.api.ts` (separate-token pattern, `authDomain: 'caterer'`, read-only — no create/update function, matching the read-only backend), `src/features/catererModulesRequiredSetup/{types,mappers,hooks}/` (hand-mirrored from `modules-required-setup.dto.ts`'s real shapes — query hooks only, no mutations).
- **`ClientModulesPage.tsx` rewritten**: the collapsed module-card list now comes from real per-module progress/blocker/correction/conversation counts (`GET /`); each card's expanded detail (checklist + 4 linked panels) lazy-loads `GET /:moduleKey` only once the card is opened, rather than fetching all detail up front; the Active/Inactive module split is driven by `GET /active-modules` instead of a hardcoded `active: boolean` flag per mock module.

### Scope decision, disclosed — two mock fields don't exist on the real DTOs
The mock's Go-Live Blockers were structured `{id, title, severity}` objects; the real `linkedGoLiveBlockers` field is a plain `string[]` (Go-live has no per-module granularity on the backend — a caterer-wide blocker list, not module-scoped), so the rebuilt panel shows plain blocker text with no severity badge. Similarly the mock's EcoLoop entries had an `unread` count; the real `linkedEcoLoopConversations` DTO has no such field, so the rebuilt panel omits the unread bubble rather than fabricating a number. Both are disclosed reductions to match what the backend actually returns, not silent regressions.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file. OpenAPI spec regenerated; all 5 new `/caterer/modules-required-setup*` paths confirmed present.

### Acceptance Criteria
- [x] Caterer-scoped backend API built (didn't exist before this pass).
- [x] `/client/modules` wired to real data — active modules, per-module progress, checklist, missing items, linked documents/corrections/blockers/EcoLoop.
- [x] Zero pricing/commercial field ever reaches this page (verified against the real DTO shapes, not just the UI).
- [x] Inactive modules shown as locked stubs, driven by real `GET /active-modules` flags, not a hardcoded boolean.
- [ ] Admin-viewable mirror (the original blueprint's Open Question #10 path) — still not consumed by any admin page; `modulesRequiredSetup.api.ts`/`queryKeys.modulesRequiredSetup` remain orphaned scaffolding on the admin side.

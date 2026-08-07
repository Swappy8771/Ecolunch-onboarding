# Modules, Pricing & Configurations — API Integration

**Status:** ✅ Integrated — 2026-07-31 · **Backend:** `/api/admin/modules-pricing/*` (existing, unchanged except one frontend-side API-client bug fix) · **Frontend:** `src/admin/modules-pricing/pages/AdminModulesPricingPage.tsx` (real, all 10 screens) — the separate `AdminModulesConfigPage.tsx` (`/admin/modules-config` route) was **not** touched, see "Open Questions" below, which remains unresolved.

### What are we building?
Wiring module activation/pricing/configuration to the real backend.

### Why is it needed?
Every other module's "active modules" gating (Establishments, Menus,
Document Vault, Modules & Required Setup) ultimately reads
`CatererModule.status`/`effectiveDate`, which this module writes.

### Current state
Frontend page exists (mock), including a sub-page that may already
correspond to "Modules & Required Setup" (`modules-config` — needs
confirming, not yet verified precisely which backend module it targets)
and an Audit sub-tab that should likely be extracted into its own module
page (see `Audit.md`).

### Problems identified
Not yet assessed in detail against the real
`modules-pricing.service.ts`'s fairly large method surface (catalogue,
per-caterer setup, pricing, configuration, commercial terms, validation
readiness, contract readiness).

### Proposed solution
Standard pattern. Decide during implementation whether `modules-config`
is actually this module's own configuration UI or should be redirected to
the new Modules & Required Setup integration instead (see that module's
doc) — don't assume without checking the actual component's current
content.

### Expected architecture
Standard pattern; `types/` hand-mirrored from
`backend/src/modules/modules-pricing/modules-pricing.service.ts`'s return
shapes (no dedicated `.dto.ts` exists on the backend for this module yet
either — verify before assuming a shape).

### Risks
Largest/most-method backend service of any module in this list — likely
the most implementation effort even though a page already exists.

### Dependencies
Phase 1 complete.

### Open Questions
- Does `modules-config` (existing frontend sub-page, `/admin/modules-config`) correspond to this
  module or to Modules & Required Setup? **Still not determined** — out of scope for this
  integration pass (which only touched `/admin/modules-pricing`). A compliance check against
  the client's spec (2026-07-31) found `AdminModulesConfigPage.tsx` still renders EcoLoop/Ledger/
  Sezzle/Paysafe as if they were toggleable commercial modules — contradicting the spec's explicit
  "infrastructure components are not ordinary activable modules" rule. This page needs its own
  resolution pass: either delete it, redirect it to Modules & Required Setup, or rebuild it —
  decide before anyone treats its content as real.
- Should the Audit sub-tab move to its own module page during this
  module's integration, or during `Audit.md`'s own pass? Kept as a sub-tab (`AuditScreen.tsx`) of
  this page for now, now wired to the real per-module `GET .../history` endpoint.

### Acceptance Criteria
- [x] Module catalogue, activation, pricing, and configuration all wired.
- [ ] `modules-config`'s actual target confirmed and documented. **Still open** (see above).

### Audit Notes — 2026-07-31

Full frontend integration of `AdminModulesPricingPage.tsx` and its 10 sub-screens against the real
backend. This was the largest single-module integration of any module audited so far (15 backend
service methods, 11 endpoints, 10 frontend screens) — see `backend/development/admin/models/
modules-pricing/NOTES.md`'s new section for the fuller account. Frontend-specific notes:

**Backend bug fixed:** `modulesApi.setModule(catererId, moduleKey)` (`src/api/modules/modules.api.ts`)
sent no request body at all, against a backend (`configureModuleSchema`) that requires at least
one field — every call would have 400'd. Fixed to accept and send a body.

**New layer:** `src/features/modulesPricing/{types,mappers,hooks}/` — hand-authored (no backend DTO
layer exists for this module), mirroring the Validation Center/Caterers pattern. 6 query hooks
(`useCatererModuleSetup`, `useModulePricingDetail`, `useModuleConfigurationDetail`,
`useModuleHistory`, `useValidationStatus`, `useContractReadiness`) + 4 mutation hooks
(`useConfigureModule`, `useSavePricing`, `useSaveConfiguration`, `useSaveCommercialTerms`).

**Architectural correction from the old mock:** the mock treated Founding Partner and Commercial
Terms as single **caterer-wide** settings (one toggle/one contract applied uniformly across every
module). The real backend models both **per module** (`CatererModule.pricing.foundingPartnerFree`,
`CatererModule.commercialTerms.*`) — which actually matches the client's own spec more closely (its
module configuration table lists "founding partner status" as a per-module-row field, e.g. School
Meals / Daycare / Camp Meals each have their own). Rebuilt `FoundingPartnerScreen.tsx` and
`CommercialTermsScreen.tsx` as per-module detail forms (a module selector + that module's own
values), replacing the old single caterer-wide form.

**Operational Rules — the 6 rule buckets (payout/cutoff/credit/notifications/reports/labels) are
stored backend-side as free-form `Schema.Types.Mixed` JSON, not named/typed fields.** The old mock
fabricated a flat list of `OperationalRule` objects with `enabled`/`value`/`status` per rule — no
such structure exists on the backend. Rebuilt as a plain key/value JSON editor per bucket (add/
remove rows, best-effort `JSON.parse` on save) — the only honest representation given the schema.

**"Dependencies between modules"** (the old mock's `ModuleConfig.dependencies: ModuleId[]`, e.g.
ReportIQ "requires" School Meals) **has no backend representation at all** — dropped entirely
rather than fabricated, same treatment as Validation Center's dropped "Reviewer" concept and
Caterers' dropped module dependency chips.

**New caterer → Modules & Pricing entry point** — `AdminCaterersPage.tsx` previously had no way to
navigate to this module from a caterer at all (the client spec's step 38 was a dead end). Added a new
"Modules & Pricing" row action + workspace-section button, deep-linking via `?catererId=` (same
pattern as Document Vault/Contract Management). The main page now reads that param on mount,
consumes it, and defaults the caterer selector to it.

**Also enabled while here:** "Open Validation Items" (`AdminCaterersPage.tsx`) was previously
disabled with a "not wired to real data" tooltip — Validation Center was integrated in a separate,
earlier pass this session and is now real, so this link is now wired too (`?catererId=` support added
to `AdminValidationCenterPage.tsx`).

**Verification:** `tsc -b --noEmit` and `eslint` both clean on every changed file — including fixing
3 `react-hooks/set-state-in-effect` violations by switching from `useEffect` + `setState` to React's
"adjust state during render" pattern for the 3 per-module prefill forms (Founding Partner,
Commercial Terms, Operational Rules).

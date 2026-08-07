# Go-Live — API Integration

**Status:** ✅ Integrated — 2026-07-31 · **Backend:** `/api/admin/golive/*` (11 endpoints + 2 new: `/remind`, `/send-ecoloop`) · **Frontend:** `src/admin/golive-monitor/pages/AdminGolivePage.tsx` (real) — the orphaned duplicate under `src/features/onboarding/golive-monitor/` is deleted.

### What are we building?
Wiring the live Go-Live Monitor page to the real backend, including the
new canonical `getSummary()`/`getStatus()`/`getChecklist()` endpoints
built this session.

### Why is it needed?
The final aggregation point of onboarding readiness — depends on nearly
every other module having correct real data first.

### Current state
Live mock (`src/admin/golive-monitor/`) is reasonably faithful to the real
11-item model and matches the documented admin action set closely, but is
100% `console.log`-driven with no real calls, has no `waived` status
support (the real enum has 4 values, the mock only 3), and has an "odd"
disabled condition on its "Validate Go-live" button (disabled specifically
*when* the caterer is already ready — flagged as possibly a mock bug, not
confirmed intentional). An orphaned duplicate with an incompatible data
shape also exists under `src/features/onboarding/`.

### Problems identified
- **The already-shipped backend itself has four different, mutually
  disagreeing definitions of "ready"/"blocking"** across its own methods
  — this was found and documented, not fixed, during this session's
  backend audit. The frontend must pick ONE source (recommended: the new
  `getSummary()`, which established a single canonical evaluation) rather
  than mixing data from `getOverview()`'s blockers, `getBlockers()`, and
  `getSummary()` on the same page.
- No `waived` support in the mock — must be added if the real UI should
  ever show a waived requirement distinctly from complete/incomplete/
  blocked.
- The richer "Validation Checklist" (9 sections: Documents & Compliance,
  Banking, Contracts, Legal, School Meals, Daycare, Accounting, ReportIQ,
  Open Corrections) is now a real endpoint (`getChecklist()`) — use it
  rather than the mock's own 40-item invented taxonomy.

### Proposed solution
Reconcile the duplicate tree first (Phase 1 scope). Then wire: `GET /` +
`GET /:catererId` (existing overview) for the caterer list/detail view,
`GET /:catererId/summary` for the single canonical readiness/blocker/
warning view, `GET /:catererId/checklist` for the 9-section breakdown, and
the existing `validate`/`block`/`unblock`/`activate` actions.

### Expected architecture
Standard pattern; `types/` hand-mirrored from
`backend/src/modules/golive/golive.dto.ts` (new) and the pre-existing
`GoLiveOverview`/`GoLiveSummary` shapes in `golive.service.ts`.

### Risks
Do not build "Request Go-Live" UI as a functioning feature — it has zero
backend implementation and no spec backing (both specs explicitly say
only admin activates); if the mock's button is kept for visual parity, it
must not appear to do anything real, or must be removed.

### Dependencies
Phase 1 complete, including reconciling the duplicate tree. Benefits from
every module feeding the checklist (Banking, Establishments, Menus,
Document Vault, Contracts, Modules & Required Setup, Corrections) being
integrated first — otherwise the checklist page will show correct
structure but wrong/empty section data.

### Open Questions
15 already documented in `backend/development/admin/models/golive/
NOTES.md` (the four inconsistent readiness definitions, the fixed-11-vs-
variable-checklist spec contradiction, the Pattern A/B gate-writing
asymmetry, Request Go-Live's complete absence). None resolved from the
frontend side — the frontend should surface data as the backend actually
returns it, not paper over these with its own interpretation.

### Acceptance Criteria
- [x] Duplicate frontend tree resolved before this module's work begins.
- [x] One canonical readiness source (`getSummary()`) used consistently,
      not mixed with the older inconsistent endpoints. (`getOverview()` is
      also used, but only for its flat 11-item requirement list, which
      `getSummary()` doesn't provide — the two are complementary, not
      competing sources of the same "ready" answer; see below.)
- [x] `waived` status representable in the UI.
- [x] "Request Go-Live" — confirmed moot: the live-routed page's `ActionBar.tsx`
      never had such a button (only the now-deleted orphaned duplicate might
      have; not carried into this integration either way).

### Audit Notes — 2026-07-31

Full integration, plus the backend gaps this session's earlier audit found were fixed first (per
the user's explicit "clear the gaps" instruction) rather than surfaced as-is:

**Backend fixes (see `backend/development/admin/models/golive/NOTES.md`'s new section for full
detail):**
- The "blockers always empty" bug in `buildOverview()`/`list()` (required a `blockingReason` that's
  only ever set on the synthetic block row) — fixed to match `evaluateGoLive()`'s already-correct logic.
- Added a 10th checklist section (**Open Validations**) — previously missing entirely despite being
  a required display field; pulls from `validationService.list()`, narrowed to non-terminal statuses.
- Added the previously-omitted **Camp Meals** section to the 9-section (now 10) checklist aggregation.
- Wired the previously-dead `ecoloop_blockers_closed` gate to real `Conversation` data (complete when
  zero open/waiting conversations exist for the caterer) — recomputed from `ecoloop.service.ts` via a
  dynamic import (avoids a circular static dependency, since `golive.service.ts` already imports
  `ecoloopService` for the new send-message actions below).
- Added **2 new endpoints** — `POST /:catererId/remind` (auto-generates a message from current
  blockers if none given) and `POST /:catererId/send-ecoloop` (free-form message) — both post through
  the app's real, internally-built EcoLoop conversation system (`ecoloopService`), not the separate
  always-stub `integrations/ecoloop.ts` adapter Validation Center's own EcoLoop action uses.
- Added `openCorrectionsCount`/`openValidationsCount`/`isBlocked` to `list()`'s per-row summary — cheap
  counts (not the full 9/10-section aggregation), needed because the table shows these as required
  columns per the client spec.
- **Not fixed** (explicitly out of scope, still true): Parent Subscriptions and CSS Reporting have no
  checklist section — `modules-required-setup`'s own `ModuleKey` type only covers 5 of 7 catalogue
  modules, so there's no checklist content to aggregate for those 2 without inventing it. The four
  historically-disagreeing internal readiness definitions in `golive.service.ts` are unchanged by
  design (per the file's own header comment) — this session added a 5th-and-6th caller
  (`sendReminder`'s blocker-list generation, `list()`'s counts) on top of the existing ones rather
  than unifying them, since that unification was explicitly out of scope for this pass.

**Frontend — `getOverview()` vs `getSummary()`, clarified:** these two endpoints are used for
different things, not as alternate sources of the same answer. `getOverview()`'s flat
`requirements[]` (11 items, `complete`/`incomplete`/`blocked`/`waived`) backs the Readiness Checklist
panel. `getSummary()`'s richer, categorized `blockers[]`/`warnings[]` (sourced from Banking/Document
Vault/Contracts/Modules & Required Setup/Corrections/Validation) backs the Blockers panel and the
"Open Blocking Section" route-resolution logic. Both are real reads of the same underlying data,
just at different granularity — using both is not the "mixing inconsistent sources" problem this
doc originally warned against (that referred to the 4 legacy readiness *computations*, not these 2
DTOs).

**New `features/golive/` layer** mirrors the Validation Center/Modules Pricing pattern: hand-authored
types/mapper (no backend DTO-generation for the 2 new endpoints), 4 query hooks
(`useGoLiveList`/`useGoLiveOverview`/`useGoLiveSummary`/`useGoLiveHistory`) + 5 mutation hooks
(validate/block/unblock/remind/send-via-EcoLoop — `unblock` isn't in the client's action list but is
a real, already-built backend capability, exposed as the Block button's own toggle rather than
building a second inert "Unblock" button).

**"Open Blocking Section"** resolves via the real `owningModule`/`source` fields on each blocker —
for the base 11 requirements (`owningModule: 'golive'`), `source` holds the actual requirement key,
mapped to whichever admin page owns fixing it (e.g. `documents_approved` → Document Vault). Banking,
Corrections, and (the base-requirement) Validation gates have no dedicated standalone admin page of
their own in this app, so they route to Caterers/Validation Center as the closest real page rather
than a nonexistent target.

**New caterer → Go-Live Monitor entry point** — `AdminCaterersPage.tsx`'s "Open Go-Live Blockers" row
action and workspace-section button were previously disabled (mock target); both now navigate with
`?catererId=`, and the target page reads/consumes that param on mount.

**Verification:** `tsc --noEmit`/`eslint` (backend) and `tsc -b --noEmit`/`eslint` (frontend) all
clean on every changed file.

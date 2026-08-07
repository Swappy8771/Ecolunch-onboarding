# Validation Center — API Integration

**Status:** ✅ Integrated — 2026-07-31 · **Backend:** `/api/admin/validations/*` (existing, 10 endpoints, unchanged) · **Frontend:** `src/admin/validation-center/` (real, live-routed) — the two orphaned duplicates are deleted

### What are we building?
Wiring the live-routed Validation Center page to the real backend.

### Why is it needed?
Validation Center is the sole gateway that creates Corrections and drives
4 of the 9 real Go-Live gates (profile/banking/establishments/menus) via
its generic approve/reject/request-correction flow — nothing else in the
system writes those 4 gates directly.

### Current state
**Three** frontend implementations exist with **three different** status
vocabularies: the live mock (`pending/approved/rejected/correction`, 4
values, no `in_review`/`closed`), the French `CentreDeValidation.tsx`
(`en-attente/rejete/approuve/manquant/correction`, 5 values, including a
`manquant` "missing" status found nowhere else in the entire codebase),
and the real backend (`pending_review/in_review/approved/rejected/
correction_requested/closed`, 6 values). None of the three mocks match.

### Problems identified
- Three-way status mismatch (above) — adopt the real 6-value enum.
- The live mock's "Reviewer" concept (a pre-assignment filter/dropdown,
  with mock history showing "Assigned to X") **has no backend
  counterpart at all** — `ValidationItem` has no assignee field, only
  `reviewedBy`, populated only *after* a decision. Do not build UI implying
  pre-assignment exists.
- The live mock's internal-notes textarea is present but has no submit
  handler wired even to mock state — confirm real wiring, not just visual
  parity, during integration.
- `type: 'smart_import'` exists in the real backend enum but has no
  `TYPE_TO_SECTION` mapping (inert) — don't build a UI path implying it
  does anything yet.

### Proposed solution
Reconcile the three implementations to one (recommend keeping the live
`src/admin/validation-center/` tree, deleting the other two — a decision
for Phase 1's dead-code cleanup, not this module's own work) before
wiring the real 6-value status enum and the real endpoint set (list, get,
create, open, approve, reject, request-correction, add-note, send-via-
ecoloop, history).

### Expected architecture
Standard pattern; `types/` hand-mirrored from
`backend/src/modules/validation/validation.model.ts`.

### Risks
Highest duplicate-implementation risk of any module (3 versions, not 2).

### Dependencies
Phase 1 complete, including reconciling all three implementations.

### Open Questions
- Which of the 3 implementations is intended to be the long-term base?
  (Recommended: the live-routed one, since it's already wired into
  `App.tsx` — not decided/confirmed here.)

### Acceptance Criteria
- [x] Exactly one Validation Center implementation remains.
- [x] Status enum matches the real 6 values.
- [x] No UI implies pre-assignment or working Smart Import review.

### Audit Notes — 2026-07-31

**Reconciliation:** kept `src/admin/validation-center/` (the live-routed tree), deleted `src/features/onboarding/validation-center/index.tsx` and `src/routes/admin/CentreDeValidation.tsx` after confirming zero remaining references to either (grepped the whole `src/` tree first).

**New layer:** `src/features/validation/{types,mappers,hooks}/` mirrors the Caterers/Document Vault pattern exactly — hand-authored `ValidationItemDto` (no backend DTO layer exists for this module, unlike Caterers/Documents; `validation.service.ts` returns raw Mongoose `.lean()`/`.toObject()` results), `useValidationItems` (list), `useValidationHistory` (lazy, drawer-only), and 5 decision mutations (`useApproveValidation`/`useRejectValidation`/`useRequestCorrectionValidation`/`useAddValidationNote`/`useSendValidationEcoLoop`).

**Two real bugs found and fixed in `src/api/modules/validation.api.ts`** before wiring anything to it: `reject()` and `sendToEcoLoop()` sent no request body at all, against a backend that requires `reason`/`message` respectively (`rejectSchema`/`sendEcoLoopSchema`) — every call would have 400'd. Fixed to accept and send the required body.

**Status enum:** adopted the real 6-value enum (`pending_review`/`in_review`/`approved`/`rejected`/`correction_requested`/`closed`) in `VStatusPill.tsx` — no collapsing, unlike the old mock's 4-value bucket.

**Reviewer/pre-assignment concept dropped entirely** — confirmed (per this doc's own earlier finding) that `ValidationItem` has no assignee field, only `reviewedBy` (populated only after a decision). The old mock's "All Reviewers" filter and "Assigned to X" mock-history line are not reproduced anywhere.

**Smart Import:** the drawer shows an honest banner ("Smart Import isn't implemented yet on the backend — no source document/target field/confidence data exists to show here") instead of the old mock's vaguer "view mapping in Import Center" line, which implied a real destination that doesn't exist.

**All 7 required actions wired**, including the row-level dropdown and the drawer footer: View Detail, Approve (no confirmation needed, single click), Reject/Request Correction/Add Internal Note/Send via EcoLoop (share one parameterized `ValidationActionModal` — each posts a required text field, Request Correction additionally has an optional priority selector), View History (lazy-fetched only while the drawer is open).

**Caterer name resolution:** `catererId` → display name resolved client-side via `useCaterers({ limit: 100 })` and a `Map`, same pattern already used in Contract Management — no backend enrichment needed since this module has no DTO layer to add name-resolution to (would require adding one, out of scope for a frontend-only integration pass).

**Not fixed (explicitly out of scope for this pass — this was a frontend integration task, not a producer-wiring task):** none of the 10 review-subject categories (field changes/documents/smart import/contracts/banking/menus/establishments/module config/pricing config/go-live blockers) have a real backend code path that automatically creates a `ValidationItem` — the queue will be empty in practice until at least one other module (banking/menus/establishments/etc.) is wired to call `POST /admin/validations` at its own submission point. This is the single biggest remaining gap and was flagged, not addressed, per the user's explicit ask ("integrate the API with the frontend... as we done for Caterer").

**Export button** intentionally left disabled (with a tooltip) rather than built — no export endpoint exists for this module on the backend, unlike Caterers/Contracts which already had one.

**Verification:** `tsc -b --noEmit` and `eslint` both clean on every new/changed file (2 pre-existing `react-refresh/only-export-components` warnings on sibling badge components, same pattern the codebase already accepted elsewhere — not a regression).

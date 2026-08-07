# Document Vault — API Integration

**Status:** ⏳ Not started · **Backend:** `/api/admin/documents/*` (existing, 14 endpoints) + `/api/admin/document-vault/*` (new orchestration layer, built/audited this session) · **Frontend:** `src/admin/document-vault/` (mock) + a caterer-facing mock + an orphaned duplicate under `src/features/onboarding/`

### What are we building?
Wiring the existing Document Vault admin page to two real backend
surfaces: the original Documents module (upload/version/review/audit) and
the new Document Vault orchestration layer (requirement catalogue,
grouped progress, module gating).

### Why is it needed?
This module has the most mock/real status-vocabulary drift found this
session: the real backend uses a 6-value `Document.status` enum
(`uploaded/under_review/approved/rejected/correction_requested/archived`);
the client-portal mock uses a *different* 4-value enum
(`approved/under-review/missing/rejected`); the admin-portal mock uses yet
a *third*, different 4-value enum (`approved/pending/rejected/correction`).
None of the three match.

### Current state
Frontend page exists (`src/admin/document-vault/`, mock), plus an
orphaned duplicate (`src/features/onboarding/document-vault/index.tsx`,
836 lines vs. 208 live) that must be resolved (per Phase 1) before this
module's own integration starts, not during it.

### Problems identified
- Three incompatible status vocabularies (see above) — the frontend must
  adopt the real 6-value enum as the source of truth and stop inventing a
  simplified one, even though that means richer UI states than the mocks
  currently render.
- The requirement catalogue (`document-vault`'s `getRequirements()`)
  currently has real content for only some categories (Profile fully
  populated from the real UI; Legal/Banking/Compliance/Insurance/
  Contracts/Go-live/School/Daycare/Camp/Accounting/ReportIQ populated from
  the same source this session) — verify the frontend renders exactly
  this catalogue, not a re-invented one.

### Proposed solution
Standard pattern, built against the real 6-value status enum end to end.
Use `document-vault`'s `getRequirements()`/`getGroups()`/`getProgress()`
endpoints for the requirement-checklist view (Base Documents / Module
Documents tabs), and the original Documents endpoints for
upload/replace/review/history actions.

### Expected architecture
Standard pattern; `types/` hand-mirrored from both
`backend/src/modules/documents/documents.model.ts`'s status enum and
`backend/src/modules/document-vault/document-vault.dto.ts`.

### Risks
Highest drift risk of any module in this list — three wrong mock
vocabularies existed before any real one was checked; budget extra review
time specifically for status-value mapping.

### Dependencies
Phase 1 complete, including resolution of the orphaned duplicate tree.

### Open Questions
Multiple already documented in `backend/development/admin/models/
document-vault/NOTES.md` (the 15-way dynamic sub-category spec vs. the
flat category enum, no expiry metadata, unenforced caterer-visibility
filtering) — none resolved from the frontend side.

### Acceptance Criteria
- [ ] Duplicate frontend tree resolved before this module's work begins.
- [ ] UI renders the real 6-value status enum, not a simplified one.
- [ ] Requirement catalogue view matches the real backend catalogue
      exactly (no invented items).

### Audit Notes
_(populate after implementation)_

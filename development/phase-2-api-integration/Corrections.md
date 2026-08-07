# Corrections & Follow-up — API Integration

**Status (admin page):** ⏳ Not started — no admin frontend page exists yet · **Status (Caterer Portal page):** ✅ Done — see below · **Backend:** `/api/admin/corrections/*` (existing) + `/api/caterer/corrections/*` (6 new endpoints, built this pass) · **Frontend:** `src/client/corrections/` — Caterer Portal side, now wired to real data; no admin page exists

### What are we building?
A new **admin-side** Corrections page — only a client-portal mock exists
today, and per the pattern established for every other module this
session, the admin-viewable surface is what integrates first (caterer
portal paused).

### Why is it needed?
Feeds `corrections_closed` (Go-Live) and is read by Modules & Required
Setup's Linked Corrections panels.

### Current state
No admin page exists. The one existing frontend (`ClientCorrectionsPage.tsx`)
uses a 3-value status enum (`open/resubmitted/closed`) and a 4-value
priority enum including `critical` — **neither matches the real backend**
(4-value status `open/in_progress/resolved/closed`; 3-value priority
`high/medium/low`, no `critical`). Do not port either vocabulary.

### Problems identified
- Status/priority enum mismatches (above).
- The client mock's "resubmit" flow is entirely simulated client-side
  state toggling with no real upload — the real backend's `resubmit()`
  expects real `linkedDocumentIds` from an actual Documents `replace()`
  call, not a fake local flag.

### Proposed solution
Build a new admin page against the real 6 endpoints (`list`, `getById`,
`close`, `reopen`, plus the new `resubmit`/`resolve`/`comment`/`history`/
`summary`). Model status/priority exactly as the real 4-value/3-value
enums.

### Expected architecture
Standard pattern; `types/` hand-mirrored from
`backend/src/modules/corrections/corrections.dto.ts`.

### Risks
Same class of risk as Document Vault/Contracts — an existing mock exists
but must not be trusted as ground truth for enum values.

### Dependencies
Phase 1 complete. Benefits from Validation Center being integrated first
(corrections are created by Validation Center's `requestCorrection()`,
not directly).

### Open Questions
19 already documented in `backend/development/admin/models/corrections/
NOTES.md` (most importantly: the spec says only `priority=high`
corrections block Go-live, but the real gate blocks on *any* open
correction regardless of priority — the frontend should reflect the real
gate behavior, not the spec's claim, since that's what actually happens
server-side).

### Acceptance Criteria
- [ ] New admin page built and routed.
- [ ] Status/priority rendered using the real enums, not the client
      mock's invented ones.
- [ ] Resubmit flow calls the real endpoint with real linked-document ids.

### Audit Notes
_(populate after implementation — admin page still doesn't exist)_

---

## Caterer Portal — Corrections & Follow-up (`src/client/corrections/pages/ClientCorrectionsPage.tsx`)

**Status:** ✅ Done · **Backend:** `/api/caterer/corrections/*` (6 new endpoints, built this pass — didn't exist before)

### What was there before
100%-hardcoded mock using a fictional 3-value status enum (`open/resubmitted/closed`) and 4-value priority enum including `critical` (matching neither the real backend's 4-value status `open/in_progress/resolved/closed` nor its 3-value priority `high/medium/low`). "Resubmit" was a two-step, entirely local flow — a fake "mark as fixed" toggle followed by a fake "resubmit" that just flipped local state — no network call, no real document reference of any kind.

### What was built
- **Backend** (didn't exist before): `corrections.service.caterer.ts` / `.controller.caterer.ts` / `.routes.caterer.ts`, mounted at `/caterer/corrections` — `list`, `getSummary`, `getById`, `getHistory`, `resubmit`, `addComment`, each ownership-checked via `assertOwnCorrection()`. Deliberately excludes `close`/`reopen`/`resolve` — those stay exclusively admin decisions. Full detail: `backend/development/admin/models/corrections/NOTES.md` (Reconciliation Note, 2026-08-01).
- **Real bug fixed in the same pass** (pre-existing, unrelated to the caterer build): `Correction.ecoloopTicketId` was never actually persisted despite a real EcoLoop conversation being created on every correction request — fixed so the field is genuinely populated now.
- **Frontend:** `src/api/modules/caterer-corrections.api.ts`, `src/features/catererCorrections/{types,mappers,hooks}/` (query hooks + `useResubmitCatererCorrection`/`useAddCatererCorrectionComment` mutations), full rewrite of `ClientCorrectionsPage.tsx` using the real enums, a real per-correction comment thread, and a single real "Resubmit to EcoLunch" action (the mock's fake "Fix, then Resubmit" two-step is gone — there's no "mark as fixed" concept on the real backend, resubmission is the one real transition).

### Scope decision, disclosed — no document attachment on resubmit yet
The real `resubmit()` endpoint accepts optional `linkedDocumentIds`, sourced from an actual Documents `replace()` call. Since the caterer-facing Document Vault (`ClientDocumentVaultPage.tsx`) is still mock and has no real upload/replace flow to attach here, resubmit is wired without document ids for now — a caterer resubmits the correction itself (plus any comment), but there's no "attach the replacement file" step yet. This will need revisiting once Document Vault's own caterer-side integration happens.

### Resolved: the go-live-blocking priority question
Per Open Questions #2 (this doc) and the backend blueprint's own Open Question #2: the client's own Admin/Caterer Portal alignment documents (`client document/*.md`) list "corrections closed" as a flat required category with no priority qualifier — confirming the real gate's actual behavior (any open/in_progress/resolved correction blocks, regardless of priority) is correct as specified, not a bug. The frontend reflects this honestly: a "Medium"-priority open correction shows as a go-live blocker exactly like a "High" one.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file. OpenAPI spec regenerated; all 6 new `/caterer/corrections*` paths confirmed present.

### Acceptance Criteria
- [x] Caterer-scoped backend API built (didn't exist before this pass).
- [x] `/client/corrections` wired to real data using the real 4-value status / 3-value priority enums, not the mock's invented ones.
- [x] Real comment thread (view + add) per correction.
- [x] Resubmit flow calls the real endpoint.
- [ ] Resubmit with real linked-document ids — blocked on Document Vault's own caterer-side integration (still mock).
- [ ] Admin page — still doesn't exist; unrelated to this pass.

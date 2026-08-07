# Banking — API Integration

**Status (admin page):** ⏳ Not started — no admin frontend page exists yet · **Status (Caterer Portal page):** ✅ Done — see below · **Backend:** `/api/admin/banking/*` (existing) + `/api/caterer/banking/*` (3 new masked-only endpoints, built this pass) · **Frontend:** admin — none; Caterer Portal — `src/client/banques/`, now wired to real data

### What are we building?
An entirely new admin page for Banking (no mock, no existing folder) *and*
its real API integration in the same pass — there is no "swap mock for
fetch" step here.

### Why is it needed?
Banking is one of the 11 Go-Live gate requirements
(`banking_validated`) and currently has zero admin-facing frontend
surface at all, despite a complete backend module.

### Current state
No `src/admin/banking/` folder exists. Backend exposes: get-by-caterer,
overview (completion %, missing documents), create/update (encrypted
IBAN/account number, masked by default), and a separately-audited reveal
action.

### Problems identified
Building a page from scratch means the DTO shapes must be taken directly
from the backend's real `banking.dto.ts`/`BankingOverviewDTO` — there is
no mock to (incorrectly) copy from, which is actually the *safer* starting
position compared to modules with a pre-existing, possibly-wrong mock.

### Proposed solution
Build `src/admin/banking/{pages,components,services,hooks,types}`
following the exact shape every other module uses. The "reveal masked
values" action needs explicit, visible UI treatment (a confirm step) given
it's a separately-audited sensitive action on the backend.

### Expected architecture
Standard pattern. `types/` should be hand-mirrored directly from
`backend/src/modules/banking/banking.dto.ts`, cited by file path in a
comment per `STANDARDS.md`.

### Risks
Handling encrypted/masked banking fields in the UI needs care — never log
or persist a revealed value client-side beyond what's needed to render it
once.

### Dependencies
Phase 1 complete. Benefits from Caterers being integrated first (needs a
real `catererId`).

### Open Questions
- Should the "reveal" action require a re-confirmation step in the UI
  beyond a single click, given it's audited server-side as a sensitive
  action? Not decided.

### Acceptance Criteria
- [ ] New admin page built and routed.
- [ ] Overview/completion %, missing-documents list, create/update, and
      reveal (with an explicit confirm step) all call the real backend.

### Audit Notes
_(populate after implementation — admin page still doesn't exist)_

---

## Caterer Portal — Banks & Banking Information (`src/client/banques/pages/ClientBanquesPage.tsx`)

**Status:** ✅ Done · **Backend:** `/api/caterer/banking/*` (3 new endpoints, built this pass — didn't exist before; this was explicitly the one item the backend blueprint deferred as "Future Phase")

### What was there before
100%-hardcoded mock, zero API calls, zero working buttons. Worse than decorative: it displayed a full plaintext mock IBAN directly beneath a hardcoded disclaimer claiming the data was encrypted and access-restricted — a real, visible contradiction, not just a missing-wiring gap.

### What was built
- **Backend** (didn't exist before): `banking.service.caterer.ts` / `.controller.caterer.ts` / `.routes.caterer.ts`, mounted at `/caterer/banking` — `get` (masked record), `getOverview` (completion + missing docs), `createOrUpdate` (one combined submission). No `reveal` — a caterer must only ever see masked `*Last4` values, per the caterer-onboarding spec; this required no stripping logic since the underlying service methods already only return masked DTOs. Full detail: `backend/development/admin/models/banking/NOTES.md` (Reconciliation Note, 2026-08-01).
- **Frontend:** `src/api/modules/caterer-banking.api.ts`, `src/features/catererBanking/{types,mappers,hooks}/` (query hooks + one `useSaveCatererBanking` mutation), full rewrite of `ClientBanquesPage.tsx` — real completion chart, real masked display (`•••• 6722`, never the full value), one combined save form (institution + account + region-toggle transit fields, matching the real "one POST, not per-section PATCH" backend design), and a real documents-required checklist driven by `getOverview()`'s `missingDocuments`.

### Scope decisions, disclosed
- The mock's fake per-document upload cards and its fabricated "Linked Documents" table are both removed — neither has a real backend counterpart in the Banking module (that data actually belongs to Document Vault, which is still mock on the caterer side). Document references (`ribDocumentId`/etc.) are optional advanced text fields in the save form instead — same disclosed-limitation pattern as Corrections' resubmit.
- The backend's outbox-worker gap (a submission doesn't yet auto-create a Validation Center item) is a pre-existing, unrelated backend limitation, not something this frontend pass could or should paper over — noted, not fixed here.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file. OpenAPI spec regenerated; all 3 new `/caterer/banking*` paths confirmed present.

### Acceptance Criteria
- [x] Caterer-scoped backend API built (didn't exist before this pass — explicitly deferred by the original blueprint).
- [x] `/client/banques` wired to real data — completion, masked institution/account/transit fields, missing-documents checklist.
- [x] Masked values only — no full IBAN/account number ever reaches this page, closing the mock's real plaintext-vs-disclaimer contradiction.
- [x] Single combined save form, matching the real backend's "one POST" design (not per-section edits).
- [ ] Real document upload/reference picker — blocked on Document Vault's own caterer-side integration (still mock).
- [ ] Admin page — still doesn't exist; unrelated to this pass.

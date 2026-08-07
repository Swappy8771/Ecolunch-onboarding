# Contracts & Signatures — API Integration

**Status (admin page):** ⏳ Not started · **Status (Caterer Portal page):** ✅ Done — see below ·
**Backend:** `/api/admin/contracts/*` (existing 9 endpoints + 3 new Progress/document endpoints,
built/audited this session) + `/api/caterer/contracts/*` (5 new read-only endpoints, built this pass) ·
**Frontend:** `src/admin/contract-management/` (mock) + an orphaned duplicate under
`src/features/onboarding/` — admin side; `src/client/contrats/` — Caterer Portal side, now wired to
real data

### What are we building?
Wiring the existing Contract Management admin page to the real backend,
including the new `getSummary()`/document view/download endpoints built
this session.

### Why is it needed?
Feeds `contracts_signed` (Go-Live) directly, and is one of the cleanest
backend contracts of any module in this list — fully audited this session
with only one real bug found and fixed (a missing gate-recompute in
`send()`).

### Current state
Frontend page exists (mock), plus an orphaned duplicate
(`src/features/onboarding/index.tsx`, 767 lines vs. 288 live). The admin
mock's contract-type list (`MSA/DPA/Subscription/SLA/Module Agreement/
Go-live`) does **not** match the real backend's 7-type enum
(`msa/nda/dpa/platform_terms/food_safety/module_annex/fee_schedule`) —
invents 3 types that don't exist (Subscription, SLA, Go-live) and omits 3
real ones (nda, platform_terms, food_safety).

### Problems identified
- Contract-type mismatch (above) — must be corrected against the real
  7-value enum, not the mock's invented 6.
- Status enum near-match but not exact: mock uses `ready`/`cancelled`,
  real backend uses `ready_to_send`/`canceled` — a spelling/naming
  mismatch on 2 of 10 values.
- No "sign" action should be built — signing happens at Dropbox Sign's
  hosted page per the real backend design; the closest real action is
  "Send for Signature" (`POST /:cid/send`).

### Proposed solution
Standard pattern. Use the new `GET /:cid/document` / `GET /:cid/document/
download` endpoints for "View"/"Download" actions rather than reaching
into the Documents module directly. Use `GET /caterers/:catererId/summary`
for the progress/blockers view.

### Expected architecture
Standard pattern; `types/` hand-mirrored from
`backend/src/modules/contracts/contracts.dto.ts`.

### Risks
Contract-type and status-enum corrections are exactly the kind of
find-during-integration issue this documentation structure exists to
catch — budget explicit review time for it rather than assuming the mock
is close enough.

### Dependencies
Phase 1 complete, including resolution of the orphaned duplicate tree.

### Open Questions
11 already documented in `backend/development/admin/models/contracts/
NOTES.md` (required-vs-optional contract types, signer-status enum
disagreements, no expiry/versioning rules) — none resolved from the
frontend side.

### Acceptance Criteria
- [ ] Duplicate frontend tree resolved before this module's work begins.
- [ ] Contract-type list corrected to the real 7 values.
- [ ] Status enum corrected to the real 10 values/spellings.
- [ ] View/Download use the new document endpoints, not a reimplemented
      file-access path.

### Audit Notes
_(populate after implementation — admin-side page, `src/admin/contract-management/`)_

---

## Caterer Portal — Contracts & Signatures (`src/client/contrats/pages/ClientContratsPage.tsx`)

**Status:** ✅ Done · **Backend:** `/api/caterer/contracts/*` (5 new endpoints, built this pass — didn't
exist before)

### What was there before
100%-hardcoded mock: a fixed `INITIAL_CONTRACTS` array of 6 contracts with a `Contract` type
(`id, title, subtitle, description, version, pages, required, goLiveBlocker, status('pending'|'signed'),
signedDate, signedBy, summaryPoints[]`) that doesn't match the real DTO shape except loosely
`id`/`status`. `handleSign()` just mutated local React state — no network call, no Dropbox Sign
redirect at all. Included an in-app `SigningModal` that let the caterer type a name, check a box, and
click "Sign Contract," faking a real e-signature flow the backend has no way to actually perform.

### Why read-only, not full CRUD like Establishments/Menus
A caterer never creates, sends, retries, resends, or cancels a contract — that's exclusively an admin
action dispatched through Dropbox Sign. And there is no "sign" action to build either: the backend's
`dropboxSignAdapter.sendWithTemplate()` returns only `{signatureRequestId, templateId}` — never a
signing URL — because Dropbox Sign emails the signatory a link straight to its own hosted signing page;
this app never generates or stores that link. So the real, correct caterer-side scope is: list
contracts, view signing progress/blockers, and download the signed document once available — nothing
more.

### What was built
- **Backend** (didn't exist before): `contracts.service.caterer.ts` / `.controller.caterer.ts` /
  `.routes.caterer.ts`, mounted at `/caterer/contracts` — `list()`, `getProgress()`, `getById()`
  (ownership-checked, admin-only fields stripped: template id, merge fields, creator, audit trail),
  `getSignedDocument()`, `getSignedDocumentDownload()`. Full detail in
  `backend/development/admin/models/contracts/NOTES.md` §6.
- **Frontend:** `src/api/modules/caterer-contracts.api.ts` (separate-token pattern, `authDomain:
  'caterer'`, read-only — no create/update/sign functions), `src/features/catererContracts/
  {types,mappers,hooks}/` (hand-mirrored from `contracts.dto.ts`'s real shapes — query hooks only, no
  mutations module, since there's nothing to mutate).
- **`ClientContratsPage.tsx` rewritten**: real contract list grouped by status (pending / signed /
  other), a real signature-progress summary and go-live-blockers banner both driven by
  `GET /caterer/contracts/progress`, and a real "Download" action wired to
  `getSignedDocumentDownload()` for signed contracts.

### Scope decision, disclosed — the fake in-app signing flow was removed, not rebuilt
The mock's `SigningModal`/`handleSign()` had no real backend counterpart to wire it to (see "why
read-only" above) — rebuilding it would mean fabricating a UI for a capability the backend
deliberately doesn't expose. Removed entirely. In its place, contracts in `sent`/`viewed`/
`partially_signed` status show a "Check your email to sign" note, since that's the real, accurate
statement of what happens next (Dropbox Sign emails the signatory directly). This mirrors the same
disclosed-scope approach already used for Menus' Smart Import gap and Establishments' closure-upload
gap — a real limitation stated plainly rather than a decorative fake action.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed
file. OpenAPI spec regenerated; all 5 new `/caterer/contracts*` paths confirmed present.

### Acceptance Criteria
- [x] Caterer-scoped backend API built (didn't exist before this pass).
- [x] `/client/contrats` wired to real data — list, progress, blockers.
- [x] Fake in-app signing modal removed; replaced with an accurate "check your email" note, not a
      fabricated sign action.
- [x] Signed-document download wired to the real endpoint.
- [ ] Signed-document *view* (`GET /:cid/document`, distinct from download) — the query hook
      (`useCatererContractDocument`) exists but isn't consumed by the page yet; only download is wired.

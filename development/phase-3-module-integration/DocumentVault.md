# Document Vault — Module Integration

**Status:** ✅ Integrated · **Backend:** `/api/admin/document-vault/*` (requirements/groups/progress) + `/api/admin/documents/*` (upload/version/review) · **Frontend:** `src/admin/document-vault/pages/AdminDocumentVaultPage.tsx` + `src/features/documentVault/`

---

### What was built

Unlike Caterers, this module's own backend orchestration layer
(`document-vault.service.ts`) was already well-architected — real DTOs, a
batch-only repository, module-gated requirement matching. The actual
gaps were: (1) its 3 endpoints had no Swagger response schemas, and (2)
the underlying Documents module it sits on top of had no DTO layer at
all and no uploader-name resolution — both fixed on the backend before
any frontend work started (see `backend/development/admin/models/
{document-vault,documents}/NOTES.md`). The 3-level drill-down admin page
(caterer grid → category tiles → document table) now calls the real
backend at every level; the mock (`documentVaultMock.tsx`) is deleted.

### Files

- `src/features/documentVault/types/documentVault.types.ts` —
  `CatererVaultSummaryViewModel`, `DocumentCategoryTileViewModel`,
  `DocumentViewModel`, `DocStatusDisplay`.
- `src/features/documentVault/mappers/documentVault.mapper.ts` —
  hand-authored `VaultSummaryDto`/`DocumentGroupDto`/`DocumentDto` (backend
  response schemas exist now, but the generated types are deeply nested;
  hand-authoring here matches the convention already established for
  Caterers/Banking), `mapVaultSummaryToViewModel`, `mapGroupsToTiles`,
  `mapDocumentToViewModel`, `toStatusDisplay`.
- `src/features/documentVault/hooks/{useDocumentVaultSummary,useDocumentCategoryTiles,useCatererDocuments,useReviewDocument}.ts`.
- `src/admin/document-vault/pages/AdminDocumentVaultPage.tsx` and
  `components/{CategoryGrid,DocumentTable,CatererVaultGrid,CatererSidePanel}.tsx`
  rewired to the hooks above.
- `backend/src/modules/documents/documents.dto.ts` (new),
  `documents.service.ts` (DTO mapping + `uploadedByName`/`reviewedByName`
  batch enrichment), `documents.routes.ts` (Swagger response schemas for
  the 6 endpoints this page calls).
- `backend/src/modules/document-vault/document-vault.routes.ts` (Swagger
  response schemas for all 3 endpoints).
- `src/api/generated/{openapi.json,types.ts}` regenerated against the
  enhanced backend spec.

### Findings (backend audit, done before any frontend work)

1. **Document Vault's own layer was already correct** — matches its own
   pre-implementation blueprint (`backend/development/admin/models/
   document-vault/NOTES.md`) line-for-line. The blueprint's status line
   had simply never been updated after the code shipped (said "not yet
   implemented" while fully-working code existed) — a documentation-drift
   finding, not a code finding.
2. **Documents (the module Document Vault sits on top of) had the exact
   same three gaps Caterers had before its own Phase A**: no DTO layer
   (raw Mongoose `.lean()`/`.toObject()` returned directly), no Swagger
   response schemas, no name resolution for `uploadedBy`/`reviewedBy`.
   Fixed using the identical seams already built for Caterers
   (`usersService.findByIds()` for the batch name lookup) — no new
   architecture invented.
3. **Two frontend components looked wired but weren't.** `CategoryGrid`
   rendered the same static 11 category tiles with hardcoded counts
   regardless of which caterer was open — it never even accepted a
   `catererId` prop. `DocumentTable` always rendered the same 8 hardcoded
   `INSURANCE_DOCS`, relabeling `category` to whatever was clicked rather
   than actually filtering. Both are now genuinely scoped to the selected
   caterer/category via real hooks.
4. **Category key mismatch**: the old mock used `clients`; the real
   backend's 11-value enum uses `establishments`. Fixed in the new
   `CategoryGrid`'s icon/color map.
5. **Category tiles now show requirement-based progress**
   (`X/Y requirements approved`), not raw document-upload counts — a
   deliberate shift, since the backend's Document Vault layer computes
   checklist-style requirement matching (a fixed catalogue of expected
   documents per category), not an arbitrary count of whatever's been
   uploaded. The two aren't the same number and conflating them would
   misrepresent what "in progress" means for a category.
6. **Status vocabulary**: real 6-value `Document.status` enum vs. the
   existing `DocStatusPill` component's 4-value display bucket (already
   flagged as Open Question #5 in the backend blueprint). Resolved by
   collapsing `uploaded`/`under_review` into the existing `pending` pill
   (no 5th pill slot invented) and excluding `archived` (superseded
   versions) from the main table entirely.
7. **No archive/delete endpoint exists for documents** — `replace()` is
   the only "archive" mechanism (supersedes + archives the old version).
   Confirmed during the audit, not assumed; consistent with the project's
   "nothing is truly deleted" convention.
8. **`uploadedBy` has no resolved name** — same category of gap as
   Caterers' `assignedAdminId`. Fixed this time (unlike Caterers, where it
   was deferred to Phase B) since the Users seam already existed from that
   earlier work — `uploadedByName`/`reviewedByName` are live from day one.

### Hooks

- `useDocumentVaultSummary()` — Level 1 (caterer grid). No args; wraps
  `GET /admin/documents/vault`.
- `useDocumentCategoryTiles(catererId)` — Level 2 (category tiles); wraps
  `GET /admin/document-vault/caterers/:catererId/groups`.
- `useCatererDocuments({catererId, category})` — Level 3 (document
  table); wraps `GET /admin/documents/caterers/:catererId?category=`.
- `useReviewDocument()` — wired to the existing Approve/Reject/Request
  Correction row actions. Invalidates the whole `documentVault` query
  namespace (not a bare `invalidateQueries()`) since a review changes the
  document list, the category tiles' requirement-match status, *and* the
  global vault summary counts all at once — genuinely broad, not an
  arbitrary widening.

### Mapping strategy

Hand-authored DTOs in the mapper file, kept in sync by hand with the real
backend DTOs (`documents.dto.ts`, `document-vault.dto.ts`) — same
convention as Caterers, even though real response schemas now exist for
these endpoints (the generated types are deeply nested and impractical to
consume directly).

### Cache strategy

`queryKeys.documentVault.{vaultSummary, groups, listForCaterer}` (already
defined in Phase 2's `queryKeys.ts`, unchanged). `useReviewDocument`
invalidates `queryKeys.documentVault.all`.

### Remaining Work

- The other 9 row actions (Smart Import, Classify, Reclassify, view-only
  actions, Send via EcoLoop, version/audit history) remain inert
  placeholders — their backend endpoints exist (`documents.routes.ts`)
  but weren't part of this integration's confirmed scope.
- Upload UI: no upload button exists anywhere in the current page — not
  added, since inventing a new UI flow wasn't part of "integrate the
  existing page," matching the discipline applied throughout Phase 3.
- `classify`/`visibility`/`history`/`extracted-fields`/`validation-status`/
  `open-dropbox`/`download` still lack Swagger response schemas (left
  description-only — not wired to any current frontend UI).
- 12 remaining modules to integrate using this same pattern.

### Audit Notes

Backend audit performed and documented in
`backend/development/admin/models/{document-vault,documents}/NOTES.md`
**before** any frontend code was written, per this task's explicit
"audit first, implement only confirmed gaps" instruction.

---

## Post-implementation fixes — 2026-07-31

A follow-up adversarial audit found the "Remaining Work" list above understated the gaps (a progress-calculation bug wasn't mentioned at all, and the row-action count was off by one). Fixed — see
`backend/development/admin/models/document-vault/NOTES.md` for the backend-side detail:

- **Critical bug fixed:** `document-vault.service.ts`'s `getProgress()` built its `computeCompletion()` input as flat, dotted-string keys (`data['profile.company_registration'] = true`), but the shared `getByPath()` utility treats dots as real nested-object traversal — so `completionPercentage` silently read 0% regardless of real approval state. Fixed via a new shared `setByPath()` helper in `profile-overview.util.ts`. The same bug was found and fixed in `modules-required-setup.service.ts`'s `toCompletionData()`, which had the identical pattern.
- **Upload UI added** — a real gap the "Remaining Work" list above called out correctly. New `UploadDocumentModal` + `useUploadDocument()` hook in `DocumentTable.tsx`, wired to `POST /admin/documents/caterers/:catererId`.
- **Row actions**: was 3 wired / 10 dead (not 9 — a standalone "View" button had no handler either, missed by the original count). Now 10 wired / 2 explicitly disabled:
  - Classify/Reclassify → new `ClassifyDocumentModal` + `useClassifyDocument()` (also the mechanism that lets `linkedSection` actually get set, which the category-tile/progress counts depend on).
  - View / View Extracted Fields / View Linked Section / View Validation Status / View Version History / View Audit Trail → consolidated into one `DocumentDetailsModal`, each backed by a real endpoint (`getHistory`/`getById`/`getExtractedFields`/`getValidationStatus`/`getOpenDropbox`) via new hooks in `useDocumentDetails.ts`.
  - Reject / Request Correction now collect a note first (`ReviewNoteModal`) — previously sent with `note: undefined` always, since no UI ever prompted for one.
  - Smart Import / Send via EcoLoop stay disabled with a tooltip (no real backend feature to wire to — Smart Import's module is a genuine 501 stub; "send via EcoLoop" has no defined target conversation to create).
- **New deep-link support:** `AdminDocumentVaultPage.tsx` now reads `?catererId=` on mount and auto-selects that caterer once the summary list loads (consuming the param afterward) — the receiving end of Caterers' and Contract Management's "Open Document Vault"/"View in Document Vault" cross-links (see `phase-3-module-integration/Caterers.md`'s own post-implementation section).

**Verification:** `tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) all clean.

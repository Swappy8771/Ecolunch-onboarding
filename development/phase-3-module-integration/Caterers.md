# Caterers — Module Integration (Reference Implementation)

**Status:** ✅ Integrated · ✅ Production modal UI parity achieved (2026-07-29) · **Backend:** `/api/admin/caterers/*` · **Frontend:** `src/admin/caterers/pages/AdminCaterersPage.tsx` + `src/features/caterers/`

---

### What was built

The existing Caterers admin page (list/filter/search/paginate/create/
archive) now calls the real backend instead of the local mock array
(`src/admin/caterers/services/mock/caterersMock.ts`, deleted — zero other
call sites). Layout, table structure, filters, and actions are unchanged;
only the data source and status/vertical vocabulary changed (see
"Findings" below for why the vocabulary had to change).

### Files

- `src/features/caterers/types/caterer.types.ts` — `CatererViewModel`,
  `CatererDisplayStatus`, `CatererVertical`, `CatererListFilters`,
  `CatererListResult`, `CreateCatererInput`.
- `src/features/caterers/mappers/caterer.mapper.ts` — `CatererDto` (hand-
  authored, see below), `mapCatererToViewModel`, vertical
  casing/enum conversion both directions.
- `src/features/caterers/hooks/{useCaterers,useCaterer,useCreateCaterer,useUpdateCaterer,useArchiveCaterer}.ts`.
- `src/api/modules/caterers.api.ts` — `ListQuery`'s `status` field widened
  from the generated literal union to `string` (see Finding 1).
- `src/admin/caterers/pages/AdminCaterersPage.tsx` — rewired to the hooks
  above; status/vertical style maps updated to the real vocabulary; row
  actions gained an "Archive Caterer" entry; create modal's business
  name/legal name/city/verticals fields are now controlled and submit for
  real.

### Findings (mock vs. real DTO diff — done for the first time this module)

1. **Status vocabulary had no overlap at all.** The mock used French
   onboarding-stage labels (`pre-onboarding`/`en-cours`/`soumis`/
   `corrections`/`approuves`/`go-live`) invented for the UI mockup. The
   real backend computes a `displayStatus` via `computeDisplayStatus()` in
   `caterers.service.ts`: `pre-onboarding`/`in-progress`/`needs-review`/
   `approved`/`ready-for-golive`/`completed`/`paused`/`archived`. These
   are structurally different (8 values vs. 6, different meanings) — not
   a renaming, a genuine vocabulary replacement. `STATUS_META` in the page
   was rebuilt around the real 8 values; this is a labeling change, not a
   layout/business-rule change.
2. **A second, narrower drift inside the backend itself**: the `@openapi`
   JSDoc on `GET /admin/caterers`'s `status` query param only documents
   the 4 raw storage statuses (`onboarding`/`active`/`paused`/`archived`),
   but the real Zod schema (`statusFilterEnum` in `caterers.schema.ts`)
   also accepts the 8 display statuses the UI actually filters by. The
   generated TS type for that field is therefore too narrow. Fixed at the
   frontend boundary only — `ListQuery` in `caterers.api.ts` widens
   `status` to `string` with a comment pointing at this exact finding.
   The real fix is a backend JSDoc update (out of this frontend-only
   phase's scope).
3. **Vertical casing**: mock capitalized (`Schools`/`Daycares`/`Camps`/
   `CSS`), backend lowercase (`schools`/`daycares`/`css`/`camps`). Handled
   by `caterer.mapper.ts`'s two-way conversion; UI keeps the capitalized
   labels it already had.
4. ~~**`admin` (mock: a resolved name) has no backend equivalent.**~~
   **Resolved** — the backend's Phase B enrichment
   (`assignedAdminName`/`assignedAdminEmail`, batch-resolved via
   `usersService.findByIds()`) closed this; the table/filters/detail modal
   now show the resolved name, falling back to a shortened raw id only
   when unresolved. See "Production Modal UI Parity" below.
5. ~~**`validations`/`tickets` (mock: counts) don't exist on the Caterer
   DTO at all.**~~ **Resolved** — Phase B added `validationCount`/
   `ticketCount` (real batch aggregation against Validation Center/EcoLoop,
   read-only). The mapper now reads these real fields instead of
   hardcoding `0`.
6. **Pagination**: the mock filtered/paginated a fixed 8-row array
   client-side. The real `GET /admin/caterers` is server-paginated
   (`page`/`limit`/`total`). The page's filter/search/page/pageSize state
   now drives `useCaterers`' arguments directly instead of filtering a
   local array.
7. **Stat cards and the "Assigned Admin" filter's option list** need a
   system-wide view the paginated/filtered table query can't provide.
   Solved with a second, unfiltered `useCaterers({ page: 1, limit: 100 })`
   query (the backend's list `limit` caps at 100) — correct up to 100
   caterers; beyond that, counts would under-count with no error surfaced.
   A dedicated aggregate/count endpoint would remove this cap; not built
   here (would touch the backend, out of scope for this phase).

### Hooks

- `useCaterers(filters)` — the list query (search/status/vertical/admin/
  page/limit → real backend query params). Also reused unfiltered for
  stats/admin-filter-options (see Finding 7).
- `useCaterer(id)` — detail query. **Not wired into any page** — the list
  ViewModel already carries every field the current detail modal renders,
  so calling this would be a redundant fetch. Kept as infrastructure per
  this phase's required hook list, for a future richer detail view.
- `useCreateCaterer()` — wired to the Create Caterer modal. Sends the full
  profile (business info, location, verticals, assigned admin, contacts,
  address, tax) — see "Production Modal UI Parity" below.
- `useUpdateCaterer()` — wired to the Edit Caterer modal (added in
  "Production Modal UI Parity" below).
- `useRestoreCaterer()` — wired to a "Restore Caterer" row action, shown
  only for archived caterers (added in "Production Modal UI Parity").
- `useArchiveCaterer()` — wired to a new "Archive Caterer" row action
  (additive — the mock's row-action list had no archive/delete action at
  all; the other 7 pre-existing "Open X" actions are still non-functional
  placeholders, unchanged, since their target modules aren't integrated
  yet). Confirms via `window.confirm()` before mutating. Invalidates both
  the list (`caterers.all`) and that caterer's own detail key.

### Mapping strategy

`caterer.mapper.ts` hand-authors `CatererDto` rather than importing a
generated response type, because `GET /admin/caterers` (like nearly every
operation) has no response schema in the OpenAPI spec — see
`src/api/generated/helpers.ts`'s header. `CatererDto` is derived directly
from `caterers.model.ts` + `caterers.service.ts`'s enrichment step and
must be kept in sync by hand if the backend shape changes; there is no
compiler check tying the two together (a real limitation, not unique to
Caterers — every module will have this until the backend adds response
schemas).

### Cache strategy

`queryKeys.caterers.list(filters)`/`.detail(id)`/`.all` (from Phase 2's
`src/api/queryKeys.ts`, unchanged). Every mutation invalidates only
`caterers.all` (matches every list-variant key by prefix) plus, where
applicable, that caterer's own `caterers.detail(id)` — never a bare
`invalidateQueries()`, per `REACT_QUERY.md`.

### Remaining Work

- Stat-card exactness beyond 100 caterers (Finding 7) — needs a backend
  aggregate/count endpoint.
- Zod's `.flatten()` nested-object granularity limit (see "Validation
  strategy" below) — a real constraint, not something the frontend can
  fix without the backend adopting per-field nested error paths.
- The `companyName`/`tradingName` open product question (from the earlier
  Gap Analysis) is still open — not a blocker for this task, but still
  unresolved.
- 13 remaining modules to integrate using this same pattern.

### Audit Notes

See `AUDIT.md`.

---

## Production Modal UI Parity (2026-07-29)

The Create/Edit Caterer modal previously only captured
`companyName`/`legalName`/`city`/`verticals` (Findings 4/5 above were
still open). This work closes that gap using the backend enhancements
already shipped in the two prior Caterers tasks (Phase A's DTO layer,
Phase B's `assignedAdminName`/`validationCount`/`ticketCount`
enrichment and the `/restore` endpoint).

### Field Comparison (Production spec vs. what existed before this task)

| Field | Production spec | Before this task | After |
|---|---|---|---|
| Company / Legal Name | required | ✅ | ✅ unchanged |
| Trading Name, Organization Type, Website, Founded Year | ✅ | ❌ missing from form/ViewModel | ✅ added |
| City | ✅ | ✅ | ✅ unchanged |
| Province/State, Country | ✅ | ❌ | ✅ bound to `address.region`/`address.country` (no new backend fields — see the earlier Gap Analysis' resolved open question) |
| Served Verticals | ✅ multi-select | ✅ | ✅ unchanged |
| Assigned Admin | ✅ dropdown, `GET /admin/users`, display name+email, store id only | ❌ not sent at all (Finding 4) | ✅ searchable dropdown, `useUsersList`, stores `assignedAdminId` only |
| Primary Contact | ✅ name/title/email/phone | ❌ | ✅ bound to `primaryContact` |
| Secondary Contact | ✅ (if supported) | ❌ | ✅ bound to `secondaryContact` |
| Address (street/postal) | ✅ | ❌ | ✅ bound to `address.line1`/`address.postalCode` |
| Tax (NEQ/SIREN/VAT) | ✅ | ❌ | ✅ bound to `tax.{neqNumber,sirenNumber,vatNumber}` |
| Edit modal | implied (task title: "Create/Edit") | ❌ **did not exist** — only a read-only detail view | ✅ new, shares `CatererFormModal` with create |
| Restore action | backend has had `/restore` since Phase A | ❌ never wired to any UI | ✅ row action for archived caterers |
| React Hook Form | assumed to exist per this task's "existing schema" instruction | **does not exist in this project** — no `react-hook-form`/`zod` dependency anywhere in `package.json` | Not introduced — continued the codebase's existing controlled-input pattern rather than adding a new form library as an unrequested architectural change |
| "Production Caterer modal" spec | assumed to be a separate design doc | No such doc exists anywhere in the repo (`docs/`, Figma refs, etc.) | Treated this task's own field list as the authoritative production spec, same approach as the original Gap Analysis task |

### Backend changes (documentation only — no contract change)

`caterers.routes.ts`'s `POST /` and `PATCH /:id` Swagger request-body
blocks previously documented only a subset of what `createCatererSchema`/
`updateCatererSchema` (`caterers.schema.ts`) actually accept —
`organizationType`/`website`/`foundedYear`/`region`/`primaryContact`/
`secondaryContact`/`address`/`tax` were already validated and persisted
server-side, just never documented in Swagger. Corrected both blocks to
match the real Zod schemas exactly (same category of drift as the
`status`-filter finding from Phase A — the JSDoc undersold what the
already-shipped, already-enforced contract could do). This is a
documentation fix, not a contract change: no new field was added, no
validation rule changed, no endpoint path changed. `src/api/generated/
{openapi.json,types.ts}` regenerated to pick up the corrected request-body
types.

### Files

- `src/features/caterers/types/caterer.types.ts` — expanded
  `CatererViewModel`/added `CatererFormInput`,
  `CatererPrimaryContact`/`CatererSecondaryContact`/`CatererAddress`/
  `CatererTax`, `CatererOrganizationType`, `CatererRegion`.
- `src/features/caterers/mappers/caterer.mapper.ts` — `CatererDto` expanded
  to the full `CatererResponseDTO`/`CatererListItemDTO` shape (Phase A/B);
  `mapFormInputToRequestBody()` (shared by create/update — both backend
  schemas accept the identical field set) and `mapViewModelToFormInput()`
  (edit-form pre-fill) added.
- `src/features/caterers/hooks/{useCreateCaterer,useUpdateCaterer}.ts` —
  rewritten to send the full profile.
- `src/features/caterers/hooks/useRestoreCaterer.ts` — new.
- `src/features/users/{types,mappers,hooks}/*` — new feature, built solely
  to power the Assigned Admin picker (`useUsersList`).
- `src/api/modules/caterers.api.ts` — added `restore()`.
- `src/admin/caterers/components/CatererFormModal.tsx` — new, replaces the
  old inline `NewCatererModal`; shared by create and edit.
- `src/admin/caterers/pages/AdminCaterersPage.tsx` — wired to the above;
  `CatererDetailModal` gained an Edit button and a profile-details section
  (trading name, org type, website, founded year, admin email, primary
  contact, address, tax); row actions gained "Edit Caterer" and, for
  archived caterers, "Restore Caterer" (replacing "Archive Caterer").
- `backend/src/modules/caterers/caterers.routes.ts` — Swagger request-body
  blocks corrected (documentation only, see above).
- `src/api/generated/{openapi.json,types.ts}` — regenerated.

### Validation strategy

No client-side validation logic duplicates the backend's Zod rules. The
form only disables submit for the two Zod-required fields (`companyName`/
`legalName` non-empty) for basic UX; every other rule (email format,
phone format, NEQ/SIREN digit counts, URL format, enum membership) is
enforced authoritatively by the backend and surfaced back via the
existing `ApiError`/`isValidationError`/`error.details` infrastructure
(built in Phase 2). One real constraint documented rather than papered
over: Zod's `.flatten()` (what `error.details` contains) only separates
errors by top-level schema key, not by nested path — so a `primaryContact`
validation failure surfaces as one message for the whole object, not
pinpointed to the exact nested input. The error banner shows these
messages plainly above the form rather than inventing finer-grained
attribution the backend doesn't provide.

### Mock Removed

None — the create modal was already real (Phase 3's original Caterers
work); this task only added the missing fields/edit-mode/actions on top
of already-real data. No new mock was introduced anywhere in this pass.

### Documentation Updated

This section, plus `Ecolunch/development/CHANGELOG.md`.

---

## Post-implementation fixes — 2026-07-31

An end-to-end adversarial audit (backend + frontend) found the Export button and Invite flow genuinely dead, and confirmed which of the 7 "Open X" placeholders (noted above under "Hooks") could actually be wired vs. should stay disabled. See `backend/development/admin/models/caterer/NOTES.md` §6 for the backend-side half (export filter schema widening, invite endpoint).

- **Export** — previously no `onClick` at all, and `caterersApi.export()` took no parameters. Now: `httpClient.getBlob()`/`downloadBlob()` added to the shared HTTP client (parses `Content-Disposition`, triggers a real browser download), `caterersApi.export(query)` sends the page's currently-applied filters, new `useExportCaterers()` hook wired to the button.
- **Invite** — was entirely unbuilt (no UI anywhere, and the old API call sent no body against a backend requiring `email`). New `InviteCatererUserModal` + `useInviteCatererUser()` hook, wired to a new "Invite Portal User" row action. Honestly labeled: email delivery itself isn't wired up backend-side yet (`src/integrations/email` is a stub), so the invite link currently has to be shared manually.
- **"Open X" resolution** — of the 7 placeholders, only 2 point at admin pages that are themselves real/integrated:
  - **Open Document Vault** / **Open Contract Management** now navigate with `?catererId=`, and both target pages (`AdminDocumentVaultPage.tsx`/`AdminContractManagementPage.tsx`) were updated to read that param on mount and auto-select/filter to that caterer.
  - **Open Validation Items / Open EcoLoop Thread / Open Go-Live Blockers** stay disabled (now with a visible tooltip instead of silently doing nothing) — Validation Center, EcoLoop Onboarding, and Go-Live Monitor are still on static mock data (`ALL_ITEMS`/`TICKETS`/`CATERERS_READINESS` arrays) with no real per-caterer id to filter by. Wiring navigation to them today would silently land on an unrelated page. Revisit once each of those 3 modules gets its own integration pass.
  - **Open Onboarding / Open Support Access** stay disabled — no dedicated onboarding page exists (this caterer detail modal already is that overview), and no support-access/impersonation feature exists anywhere in the app.
- Reuses the `disabled`/`title` support added to `DropdownMenu`/`DropdownAction` (`shared/components/DropdownMenu.tsx`) during the Document Vault fix pass earlier this session — every disabled action above renders greyed-out with a hover tooltip explaining why, rather than a plain button that silently closes the menu.

**Verification:** `tsc -b --noEmit` and `eslint` both clean on every changed file (frontend + backend).

---

## Further update — 2026-07-31 (later same day): 2 more "Open X" links turned real

Validation Center and Modules & Pricing were each integrated to real backend data in separate,
later passes the same day (see `phase-2-api-integration/ValidationCenter.md` and
`phase-2-api-integration/ModulesPricing.md`). As a direct consequence:

- **Open Validation Items** — no longer disabled. Now navigates with `?catererId=`;
  `AdminValidationCenterPage.tsx` reads and consumes that param on mount, presetting its caterer filter.
- **Open Modules & Pricing** — new row action + workspace-section button (didn't exist before at
  all — this was the client spec's own flagged gap: "Admin clicks caterer → opens Modules, Pricing &
  Configurations" had no UI path). Navigates with `?catererId=`; `AdminModulesPricingPage.tsx` reads it
  and defaults its caterer selector accordingly.

Still disabled at that point: Open EcoLoop Thread, Open Go-Live Blockers, Open Onboarding, Open
Support Access.

## Further update — 2026-07-31 (later still): Open Go-Live Blockers turned real

Go-Live Monitor was integrated to real backend data in a later pass the same day (see
`phase-2-api-integration/GoLive.md`), which also fixed several real backend gaps found in an
adversarial audit first. As a result:

- **Open Go-Live Blockers** — no longer disabled. Now navigates with `?catererId=`;
  `AdminGolivePage.tsx` reads and consumes that param on mount, preselecting that caterer in the
  readiness table/detail panel.

Still disabled, unchanged: Open EcoLoop Thread, Open Onboarding, Open Support Access — EcoLoop
Onboarding is still mock-only; the latter two concepts remain nonexistent in this app.

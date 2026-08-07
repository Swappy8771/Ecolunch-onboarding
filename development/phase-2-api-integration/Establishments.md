# Establishments ("My Clients / Establishments") — API Integration

**Status:** ✅ Integrated — 2026-08-01 (caterer side) · **Backend:** `/api/admin/establishments/*`
(existing, still zero UI consumer) + `/api/caterer/establishments/*` (new) · **Frontend:**
`src/client/mes-clients/pages/ClientMesClientsPage.tsx` (real)

### Correction — this doc was stale and wrong about the framing
The original version of this doc (written before this integration pass) claimed "no frontend admin
page exists yet" and framed the work as building a **new admin page**. That was based on an incomplete
picture: a frontend page for this data *did* already exist — the caterer-facing `/client/mes-clients`
mock page — it just wasn't wired to anything, and the backend it should have called was mounted
admin-only. Investigating further (prompted by the user questioning why no admin Establishments menu
existed) confirmed: **no admin Establishments page, route, or sidebar entry has ever existed**, and the
frontend's own admin-scoped `establishmentsApi` client (`src/api/modules/establishments.api.ts`) was
fully typed but never imported anywhere — genuinely orphaned code. So the real gap wasn't "build an
admin page," it was "the only real UI for this data (caterer-facing) has no caterer-scoped backend to
call, and the actual backend that does exist has no UI on either side."

### What are we building?
A caterer-scoped backend API (new — didn't exist), and wiring the existing caterer-facing
`/client/mes-clients` mock page to it, replacing all 7 hardcoded mock arrays and the hardcoded
`ACTIVE_MODULES` flags with real data and working CRUD.

### Why is it needed?
Establishments (schools/daycares/camps/CSS districts, contacts, closure calendars) feeds the
`establishments_confirmed`-equivalent Go-Live gate and is a dependency of Menus and Modules & Required
Setup's School/Daycare/Camp checklist sections. Per the caterer-onboarding spec
(`Ecolunch/docs/caterer-onboarding/05-my-clients.md`), the caterer is meant to enter this data
themselves — this is genuinely caterer self-service, not admin data entry.

### What was built (backend — see `backend/development/admin/models/establishments/NOTES.md` §10)
New tenant-scoped layer mirroring the `/caterer/profile` pattern: `establishments.service.caterer.ts`
(ownership-checked orchestration over the existing, unmodified `establishmentsService`),
`establishments.controller.caterer.ts`, `establishments.routes.caterer.ts` — mounted at
`/api/caterer/establishments`. Unlike Profile (a singleton, so `tenantScope` alone sufficed),
Establishments has per-entity ids the admin routes never had to guard (only admins called them) — every
entity-scoped operation now re-verifies the record belongs to the caller's own caterer before touching
it, reporting 404 on a mismatch rather than leaking existence. Also fixed: `config/swagger.ts` had no
`Establishments` tag at all despite the admin routes referencing it, and the create/update request
bodies were minimally documented (`{type, name}` only) — both completed as part of this pass.

### What was integrated (frontend)
- New `src/api/modules/caterer-establishments.api.ts` — separate caterer-token pattern, same as
  `caterer-profile.api.ts`/`caterer-auth.api.ts` (`authDomain: 'caterer'`, manual bearer header).
- New `src/features/catererEstablishments/{types,mappers,hooks}/` — hand-mirrored from
  `establishments.dto.ts`'s real discriminated union (`SchoolViewModel | DaycareViewModel |
  CampViewModel | CssDistrictViewModel`), not flattened into one loose optional-everything shape, per
  this doc's own original guidance. 5 query hooks + 8 mutation hooks (create/update/delete
  establishment, add/remove contact, add/remove closure).
- `ClientMesClientsPage.tsx` rewritten against a single `GET /caterer/establishments/dashboard` call
  (already returns schools/daycares/camps/cssDistricts/counts/activeModules in one payload — exactly
  what the page needs, no extra round trips), with real loading/error states.
- 3 new modals: `EstablishmentFormModal` (shared create/edit, fields conditional on
  school/daycare/camp/css), `ContactFormModal`, `ClosureFormModal`.
- All row actions now call real mutations: Edit/Delete on every establishment type, Delete on
  contacts/closures, Add on every section. Delete confirmations use `window.confirm`, matching this
  codebase's existing convention (`AdminCaterersPage.tsx`/`AdminContractManagementPage.tsx` do the same).

### Known, disclosed limitations (not fixed, explicitly out of scope)
- **Closure calendar file upload is not wired.** The backend already accepts an optional `documentId`
  linking a closure to a Document Vault upload, but no upload flow exists in this pass — closures are
  added as structured date/label/year rows only. The mock's "Upload"/"Replace"/"View" row actions are
  now disabled (with a tooltip explaining why) rather than silently doing nothing, matching this
  session's established convention for not-yet-implemented actions.
- **Smart Import auto-fill** (school/daycare list PDF/CSV upload) — still blocked on the Smart Import
  module itself, unchanged from the original backend blueprint.
- **No admin Establishments page exists** — confirmed via direct investigation (no route, no sidebar
  entry, no `src/admin/establishments/` folder), and still true after this pass; building one was never
  the goal here. The admin-scoped `establishmentsApi` client remains orphaned/unused.
- The two originally-open backend product questions (contact multiplicity, closure file-vs-structured)
  were resolved during the original backend build (contacts: many, embedded array with real per-contact
  ids; closures: both structured and document fields coexist) — see the backend NOTES.md's
  Reconciliation note for detail.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file.

### Acceptance Criteria
- [x] Caterer-scoped backend API built (didn't exist before this pass).
- [x] `/client/mes-clients` wired to real data, covering all 4 establishment types.
- [x] Contacts and closure calendars wired (add/remove; upload explicitly out of scope, disabled not faked).
- [x] Module-gating (`activeModules`) driven by real data, not a hardcoded flag object.
- [ ] Overview/completion % — the query hook (`useCatererEstablishmentsOverview`) exists but isn't
      consumed by the page yet (the dashboard payload already covers everything the page currently
      shows); wiring a completion indicator into the page header is a small follow-up, not done here.

# Caterer Profile — API Integration

**Status:** ✅ Integrated — 2026-08-01 · **Backend:** `/api/caterer/profile/*` (7 endpoints, model extended
this pass) · **Frontend:** `src/client/profil/pages/ClientProfilePage.tsx` (real)

### What are we building?
The Caterer Portal's own self-service profile page (`/client/profil` — also linked from the Caterer
Portal sidebar under the "Caterer" label; both point at the same page). Company/Business/Contact/
Address/Tax, each independently viewable and editable, with a live completion percentage.

### Why is it needed?
This is the caterer-facing counterpart to the Admin panel's Caterer record — the caterer's own view
into (and edit surface for) the same `Caterer` document the admin side manages, scoped to a narrower,
self-service field set.

### Audit findings — 2026-08-01
The backend (`backend/development/caterer/models/profile/NOTES.md`) was real, audited, and marked PASS
— but the frontend was **100% hardcoded mock**: a literal `SECTIONS` array with fake company data, zero
API calls, zero API module, "Edit" buttons with no `onClick`. Separately, the client has no product spec
for this module at all — the frontend's own mock was the only field source of truth available, and it
described 12 fields (Company Logo, 5 Business Details fields, Operating Address, SIRET, APE/NAF, RCS)
that didn't exist anywhere on the backend model.

### What was fixed (backend — model extended per explicit instruction, not deferred this time)
- `caterers.model.ts`: `logoUrl`, `businessDetails{industrySector, employeeCount, annualCapacityMeals,
  kitchenLocations, deliveryZones[]}`, `address.operatingAddress`, `tax.{siretNumber, apeNafCode,
  rcsRegistration}` — all 12 previously-mock-only fields now real.
- Every layer updated in lockstep: `caterers.dto.ts`, `caterers.service.ts`'s `toResponseDTO()`,
  `caterers.schema.ts`, `caterers.schema.caterer.ts`'s 5 section schemas, `caterers.service.caterer.ts`'s
  `toPublicProfile()`/`buildProfileSections()` (required flags copied exactly from the frontend mock),
  and `updateBusiness()` gained the same nested-merge treatment as contact/address/tax.
- **Found and fixed a real, pre-existing bug**: `config/swagger.ts`'s `apis` glob never matched
  `caterers.routes.caterer.ts` (its `.routes.caterer.ts` suffix doesn't match `*.routes.ts`) — this
  module's 7 endpoints have **never appeared in the generated OpenAPI spec**, since the module was first
  built. Only surfaced now because the frontend integration needed generated request-body types. Fixed
  with a second glob pattern; full detail in the backend NOTES.md §7.

### What was integrated (frontend)
- New `src/api/modules/caterer-profile.api.ts` — deliberately does **not** use the shared admin
  `getAuthHeader()`; every call attaches a separate caterer token instead (see below).
- New `src/features/catererProfile/{types,mappers,hooks}/` — 2 query hooks
  (`useCatererProfile`/`useCatererProfileOverview`) + 5 mutation hooks (one per PATCH section).
- New `src/client/profil/profileFieldConfig.ts` — the single source of truth mapping each displayed
  field to both its path in the profile response (`company.legalName`) and its path in the overview
  response (`legalName`) — the two intentionally differ, since `/overview` computes completion against
  the raw `Caterer` model's own layout while `/` returns fields nested by UI section. A field only
  counts as "required" if the backend's `computeCompletion()` recorded it in `completedFields` or
  `missingFields` — optional fields never appear in either array.
- `ClientProfilePage.tsx` rewritten to consume real data with real loading/error states (skeleton +
  retry, matching the admin pages' pattern) and a real missing-fields alert driven by the live overview
  endpoint, not a client-fabricated one.
- 5 new edit modals (`CompanyEditModal`, `BusinessEditModal`, `ContactEditModal`, `AddressEditModal`,
  `TaxEditModal`), each calling its own mutation hook with inline error display.
- **Dedicated Redux slice, in its own feature folder** (`src/features/catererProfile/redux/
  catererProfileSlice.ts`) rather than the flat `src/redux/slices/` directory every other slice lives
  in — per explicit instruction for "separate structure." Scope is deliberately narrow: which section is
  currently in edit mode. That's genuine client-only UI state; the profile data itself lives in the
  TanStack Query cache (`useCatererProfile`/`useCatererProfileOverview`), matching this app's established
  Redux-for-client-state/Query-for-server-state split (see `AUTHENTICATION.md`) rather than duplicating
  server data into Redux the way the pre-existing `dashboardSlice` does.

### Resolved — Caterer Portal login (2026-08-01, see `CatererAuth.md`)
At the time this doc was first written, no Caterer Portal login existed, so this page would 401 on
every request. That's since been built — see `CatererAuth.md` for the full login/set-password/
forgot-password integration. `caterer-profile.api.ts`'s separate-token design (below) was written in
anticipation of that flow and needed no changes once it landed.
- `src/shared/utils/catererStorage.ts` — a distinct `catererAuthToken` localStorage key, parallel
  to (not shared with) `storage.ts`'s admin `authToken`.
- `caterer-profile.api.ts` reads from this storage directly (`skipAuth: true` + a manual bearer
  header) rather than going through the shared admin `getAuthHeader()`.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file.

### Acceptance Criteria
- [x] All 5 sections read/edit real data, not mock.
- [x] All 12 frontend-only fields now exist on the backend and round-trip correctly.
- [x] Real loading/error states; real missing-fields alert from the live overview endpoint.
- [x] Error handling on every mutation (inline `ApiError.message` display in each edit modal).
- [x] Caterer Profile UI state (which section is being edited) lives in its own, separately-structured
      Redux slice, not mixed into the flat `redux/slices/` directory.
- [x] Caterer Portal login — built 2026-08-01, see `CatererAuth.md`; this page is now usable end to end.

# Menus & Packages — API Integration

**Status:** ✅ Integrated — 2026-08-01 (caterer side) · **Backend:** `/api/admin/menus/*` (existing,
zero UI consumer) + `/api/caterer/menus/*` (new) · **Frontend:** `src/client/menus/pages/ClientMenusPage.tsx` (real)

### Correction — this doc was stale about the framing
The original version claimed "no frontend admin page exists yet" and framed the work as a new **admin**
page build. Same correction as `Establishments.md`: a frontend page for this data already existed — the
caterer-facing `/client/menus` mock — it just called nothing. No admin Menus page, route, or sidebar
entry has ever existed either, and the frontend's admin-scoped `menus.api.ts` client was fully typed but
completely unused anywhere in the app (not even by the admin portal, unlike `documentVault.api.ts`
which at least has a real admin consumer).

### What are we building?
A caterer-scoped backend API (new — didn't exist), and a rebuild of `/client/menus` against it. This
pass was also driven directly by the client's own spec for module-driven tab visibility — checking the
mock against it found the Camp Meals tab had **no content at all** for the active case (it unconditionally
rendered the inactive placeholder, with no Camp Menus/Packages implementation even hypothetically),
alongside the already-known "whole page is mock" problem.

### What was built (backend — see `backend/development/admin/models/menus/NOTES.md` §13)
`menus.service.caterer.ts` / `.controller.caterer.ts` / `.routes.caterer.ts`, mounted at
`/api/caterer/menus`, mirroring the Establishments caterer layer exactly — same ownership-check
pattern for entity-scoped operations (`getById`/`update`/`remove`/`deleteDish`/`addDishToMenu`/
`removeDishFromMenu`), same 404-not-403 response on a caterer/entity mismatch. Also fixed: no `Menus`
Swagger tag existed at all despite the admin routes referencing one.

### What was integrated (frontend)
- New `src/api/modules/caterer-menus.api.ts`, `src/features/catererMenus/{types,mappers,hooks}/` —
  hand-mirrored from `menus.dto.ts`'s real shape (one `Menu` type parameterized by `type`, matching the
  backend's own "one workflow, seven document types" design — not 7 separate frontend shapes).
- `ClientMenusPage.tsx` rewritten with real loading/error states, grouping the real `Menu` list into the
  7 document-type buckets (School Menus / Common Meals / Rotating Cycle / Daycare Menus / Daycare
  Packages / Camp Menus / Camp Packages — packages are the same `type` as their parent, distinguished by
  whether `packageName` is populated, exactly as the backend models them) plus a shared Dish Library
  section.
- **Camp Meals tab now has real content** when active — `Camp Menus` and `Camp Packages` sections with
  full create/edit/delete, closing the compliance gap the client's spec check found.
- 3 new modals: `MenuFormModal` (shared create/edit, fields conditional on type — schedule row editor
  for School/Daycare/Camp Menus and Rotating Cycle, session-date rows for Camp, package fields for
  Daycare/Camp package variants), `DishFormModal`, `ManageDishesModal` (attach/detach existing dishes to
  a Common Meals menu).

### Scope decision, disclosed — the mock's "Smart Import review" workflow was not rebuilt
The mock modeled every section as upload → Smart Import extraction → human review → approve/reject →
submit. That workflow has **no real backend counterpart**: Smart Import isn't built (still blocked,
per the backend blueprint's own Phase 4F), and there is no "submit"/status-transition endpoint at all
(`updateMenuSchema` deliberately excludes `status` — the backend blueprint's own Open Question #3
reasoning: introducing one would require picking a terminal status value two backend docs disagree on).
Rebuilding that exact mock flow against the real backend would mean fabricating UI for capabilities
that don't exist. Instead, per the same approach already used for Establishments' Closure Calendars,
the page was rebuilt as direct structured CRUD over the real `Menu`/`Dish` entities. This is a
deliberate, disclosed trade — not a silent regression — since the alternative was decorative-only UI.

### Verification
`tsc -b --noEmit`/`eslint` (frontend) and `tsc --noEmit`/`eslint` (backend) clean on every changed file.

### Acceptance Criteria
- [x] Caterer-scoped backend API built (didn't exist before this pass).
- [x] `/client/menus` wired to real data, covering all 7 document/workflow types via one parameterized
      component set (not 7 near-duplicate components).
- [x] Camp Meals section built for real — client-spec compliance gap closed.
- [x] Dish management (caterer-scoped, reused across menus) wired — library CRUD + per-menu attach/detach.
- [x] Module-gating (`activeModules`) driven by real data, not a hardcoded flag object.
- [ ] Overview/completion % — the query hook (`useCatererMenusOverview`) exists but isn't consumed by
      the page yet, same scope note as Establishments' equivalent follow-up.
- [ ] Smart Import review workflow — explicitly not rebuilt (see above); the mock's upload/review UI is
      gone, replaced with direct entity CRUD, since nothing on the backend exists for it to call.

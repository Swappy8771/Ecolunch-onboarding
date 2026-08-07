# Caterers — API Integration

**Status:** ⏳ Not started · **Backend:** `/api/admin/caterers/*` (existing) · **Frontend:** `src/admin/caterers/` (mock)

### What are we building?
Wiring the existing Caterers admin page (list/detail/create/invite) to the
real `caterers` backend module.

### Why is it needed?
This is the hub entity every other module's caterer-scoped pages depend
on (`catererId` is a path param across nearly every other backend module
audited this session).

### Current state
Frontend page exists, mock data only. Backend module pre-dates this
session's work and is stable/unaudited-by-us but not flagged as
problematic in any research this session touched.

### Problems identified
Not yet assessed in detail — this module's mock data hasn't been diffed
against the real `Caterer`/profile DTOs yet.

### Proposed solution
Standard pattern per `ARCHITECTURE.md`. Good candidate for the *first*
module integrated in Phase 2, since almost every other module's
integration needs a real `catererId` to test against.

### Expected architecture
`src/admin/caterers/services/api.ts` + `hooks/` per `API_LAYER.md`/
`REACT_QUERY.md`.

### Risks
None specific identified yet.

### Dependencies
Phase 1 complete.

### Open Questions
- Exact endpoint list/DTO shapes not yet re-verified against current
  backend code as part of this documentation pass — do so before
  implementation.

### Acceptance Criteria
- [ ] List/detail/create/invite all call the real backend.
- [ ] Types verified against real backend DTOs, not assumed from mock.

### Audit Notes
_(populate after implementation)_

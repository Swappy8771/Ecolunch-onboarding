# Audit (Log Viewer) — API Integration

**Status:** ⏳ Not started — **not currently its own frontend surface** · **Backend:** `/api/admin/audit/*` (existing) · **Frontend:** a sub-tab inside `src/admin/modules-pricing/` only

### What are we building?
Deciding whether Audit becomes its own `src/admin/audit/` module page or
stays a sub-tab, then wiring whichever is decided to the real
`writeAudit()`-backed `AuditLog` collection every other backend module
already writes to.

### Why is it needed?
Every module's own `getHistory()`-style endpoint (Documents, Contracts,
Menus, Corrections, Go-Live, Validation Center, Modules & Pricing) already
reads from the same shared `AuditLog` collection — a standalone Audit
viewer would be a genuinely cross-cutting view over all of them, distinct
from each module's own per-entity history endpoint.

### Current state
Only reachable today as a sub-tab inside the Modules & Pricing admin page
(`AdminModulesPricingPage.tsx`) — not a first-class module in its own
right, unlike every other item on this list.

### Problems identified
Not yet assessed — needs a decision on scope (global cross-module log
viewer vs. staying as a Modules & Pricing sub-feature) before any API
shape can be designed.

### Proposed solution
Not decided. Two real options: (1) promote to `src/admin/audit/` as a
first-class module with its own page, filterable across `entityType`
across all modules; (2) leave it as a sub-tab, but wire it to the real
backend as-is. Recommendation: option 1, since a cross-module audit view
is more useful than one scoped only to Modules & Pricing, but not decided.

### Expected architecture
Depends on the option chosen above — not designed yet.

### Risks
Low technical risk either way; the open question is product scope, not
implementation difficulty.

### Dependencies
Benefits from most other modules being integrated first, since a
cross-module audit viewer is most useful once there's real activity across
multiple modules to show.

### Open Questions
- Promote to its own module, or wire in place? Not decided.

### Acceptance Criteria
- [ ] Scope decision made and documented here before implementation.
- [ ] Real `AuditLog` data wired, filterable by entity type/caterer.

### Audit Notes
_(populate after implementation)_

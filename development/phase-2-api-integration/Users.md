# Users — API Integration

**Status:** ⏳ Not started — **no frontend admin page exists yet** · **Backend:** `/api/admin/users/*` (existing) · **Frontend:** none

### What are we building?
A new admin page for managing admin users — no mock, no existing folder.

### Why is it needed?
Basic admin account management; also the natural home for whatever the
login flow (`AUTHENTICATION.md`) needs on the "who is this admin" side
once auth is wired.

### Current state
No frontend folder exists. Backend module not deeply re-audited this
session — treat its DTO shapes as needing verification at implementation
time, not assumed from this doc.

### Problems identified
Not yet assessed.

### Proposed solution
Standard pattern, built from scratch against the real backend contract.

### Expected architecture
Standard pattern.

### Risks
Low — small, self-contained module, no known cross-module dependencies
beyond auth.

### Dependencies
Phase 1 complete, especially the Authentication work — this module and
login are closely related (both concern "who is this admin").

### Open Questions
- Should this page be built as part of Phase 1 (since it's adjacent to
  auth) or Phase 2 proper? Not decided — listed under Phase 2 per the
  original module list, but worth revisiting once Phase 1 auth work is
  underway.

### Acceptance Criteria
- [ ] New admin page built and routed.
- [ ] List/create/edit users wired to the real backend.

### Audit Notes
_(populate after implementation)_

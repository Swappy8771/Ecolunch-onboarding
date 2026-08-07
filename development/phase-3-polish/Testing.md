# Testing

**Status:** ⏳ Not started — blocked on Phase 2 · **Updated:** 2026-07-28

Placeholder — no test tooling currently exists in the frontend (not
verified as part of this documentation pass — an open item to confirm
during Phase 1). Candidate scope, not yet committed to:

- Unit tests for the shared HTTP client's error normalization
  (`API_LAYER.md`) — a good first-target given how central it is.
- Per-module integration tests once a module's real API wiring lands,
  matching the backend's own precedent of manual curl verification
  followed by (still-pending, per multiple backend `NOTES.md` files) an
  automated suite — the frontend should not repeat the backend's own
  documented gap of shipping without automated tests indefinitely.
- No end-to-end/E2E tooling decision has been made — not scoped until
  Phase 2 is further along.

No action items exist yet.

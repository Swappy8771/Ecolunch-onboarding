# Phase 3 — Polish — Working Blueprint

**Status:** ⏳ Not started — blocked on Phase 2 · **Updated:** 2026-07-28

---

### What are we building?
Cross-cutting quality work once every Phase 2 module is integrated:
performance, testing, and accessibility passes, followed by one final
audit of the whole frontend.

### Why is it needed?
Phase 2 integrates modules one at a time, each with its own acceptance
criteria and audit — but nothing in Phase 2 checks the *system* as a
whole (does every module actually share one loading pattern, one error
pattern, one query-key convention consistently; is there duplicate
fetching across pages; is the app usable via keyboard/screen reader).
Phase 3 exists so that check happens explicitly, once, rather than never.

### Current state
Not applicable — no Phase 2 work has started.

### Problems identified
None yet — this phase cannot be meaningfully scoped further until Phase 2
reveals what patterns actually emerged in practice versus what
`ARCHITECTURE.md`/`REACT_QUERY.md` proposed.

### Proposed solution
Three sibling documents (`Performance.md`, `Testing.md`,
`Accessibility.md`), each scoped once Phase 2 is far enough along to know
what needs polishing, plus `FinalAudit.md` as the last gate before calling
the whole effort done.

### Expected architecture
N/A — no new architecture, this phase audits/tunes what Phase 1/2 built.

### Risks
Scoping this phase too early (before Phase 2 reveals real patterns) risks
writing a plan for problems that don't end up existing, or missing ones
that do — deliberately left thin until Phase 2 is substantially complete.

### Dependencies
All of Phase 2.

### Open Questions
- Should Phase 3 run once, after all 14 Phase 2 modules are done, or
  incrementally (e.g. an accessibility pass after every 3-4 modules)? Not
  decided — leaning toward incremental for accessibility specifically
  (easier to fix as you go than retrofit 14 modules at once), but not
  locked in.

### Acceptance Criteria
- [ ] Performance, Testing, and Accessibility docs populated once Phase 2
      is far enough along to scope them concretely.
- [ ] `FinalAudit.md` completed with a PASS verdict before this effort is
      considered done.

### Audit Notes
See `FinalAudit.md` — not yet started.

# React Query (TanStack Query) Strategy

**Status:** 📝 Proposed — dependency not yet installed/approved, see
`ARCHITECTURE.md`'s "State Management" open question · **Updated:** 2026-07-28

This document assumes TanStack Query is approved. If Redux/RTK Query is
chosen instead, this document must be rewritten before Phase 2 begins —
it is not a fallback-compatible plan.

---

## Query Strategy

- One hook per query: `useEstablishmentsQuery(catererId)`,
  `useGoLiveSummaryQuery(catererId)`, etc. — never one giant hook fetching
  everything a page needs.
- Query keys are arrays, module-namespaced, most-specific-last:
  `['establishments', catererId]`, `['golive', 'summary', catererId]`,
  `['corrections', 'list', { catererId, status }]`.
- Keys are the mechanism for cache correctness — two components requesting
  the same key share one cached result and one in-flight request
  automatically; this is the concrete benefit over hand-rolled `useEffect`
  fetching, which every current mock page would otherwise need
  individually.

## Mutation Strategy

- One hook per mutation: `useCloseCorrectionMutation()`,
  `useActivateGoLiveMutation()`.
- Every mutation's `onSuccess` invalidates the **specific** query keys it
  affects — never a bare `invalidateQueries()` with no key filter (that
  would refetch the entire cache on every mutation, defeating the point of
  caching at all).
  - Example: closing a correction invalidates
    `['corrections', 'list', ...]` and `['golive', 'summary', catererId]`
    (since closing a correction can flip the `corrections_closed` gate),
    not every query in the app.

## Cache Policy

- Default `staleTime`: proposed 30s for most admin read queries (data that
  changes via explicit admin actions, not high-frequency). Per-query
  override where a page is known to need fresher data (e.g. right after a
  mutation navigates to a detail view).
- No global `cacheTime`/`gcTime` override proposed beyond the library
  default — revisit only if a real memory/staleness problem is observed,
  not preemptively.

## Invalidation

Handled per-mutation (see above), keyed to the specific backend
relationship the mutation touches — this requires whoever implements each
Phase 2 module to actually know which gates/sibling data a mutation
affects (e.g. per this session's backend audits: closing a Correction
recomputes the `corrections_closed` Go-Live gate, so a correction mutation
should invalidate the relevant Go-Live query too, not just the Corrections
list).

## Retry Strategy

- Default TanStack Query retry (3 attempts, exponential backoff) for GET
  queries.
- **Mutations do not retry by default** — a failed `POST`/`PATCH` should
  surface to the user, not silently retry an action that might not be
  idempotent (e.g. `POST /:id/resubmit` — retrying blindly could be
  surprising if the first attempt actually succeeded but the response was
  lost).

## Prefetching

Not adopted for Phase 1/early Phase 2 — no page today needs it, and
speculative prefetching without a measured need is exactly the kind of
premature optimization this documentation structure is meant to avoid
inventing ahead of time. Revisit per-module if a specific page's UX
clearly benefits (e.g. prefetching a detail view on row hover in a list
page).

## Optimistic Updates

**Not adopted for Phase 1.** Every mutation waits for the real response
before updating the UI. Optimistic updates are a real UX improvement but
add real complexity (rollback-on-error logic) — proposed as a Phase 3
polish item per-module, only where the round-trip latency is actually
noticeable in practice, not applied blanket from day one.

# Phase 1 — Foundation — Working Blueprint

**Status:** ✅ Phase 1.1 (API Foundation) implemented; login/route-guard wiring also now complete (see `AUTHENTICATION.md`, updated 2026-08-01 — this file's login/route-guard references below are a historical snapshot, not current state) · **Updated:** 2026-07-29

This is the pre-implementation blueprint for Phase 1. Per the workflow in
the top-level `README.md`, no implementation begins until this is reviewed
and approved. Six sibling documents go deeper on each piece:
`API_LAYER.md`, `AUTHENTICATION.md`, `REACT_QUERY.md`, `ENVIRONMENT.md`,
`PROJECT_STRUCTURE.md`, `AUDIT.md` (the baseline audit this blueprint is
scoped against).

---

### What are we building?

The infrastructure every Phase 2 module-integration depends on:
1. A real, typed HTTP client (extending the existing but unused
   `src/api/http.ts`).
2. Environment configuration (`VITE_API_BASE_URL`, a dev proxy) so that
   client actually has somewhere to send requests.
3. A working authentication flow (login page, token injection, route
   guarding, 401 handling) — the `authSlice` already exists but nothing
   uses it.
4. A decided, adopted data-fetching/caching strategy (proposed: TanStack
   Query) so 14 modules don't each invent their own loading/error/retry
   handling.
5. Removal or reconciliation of the two fully orphaned duplicate frontend
   trees discovered during the baseline audit.

### Why is it needed?

Every admin and client page currently renders from a hardcoded mock array
with zero network calls anywhere in the frontend (confirmed by the
baseline audit, see `AUDIT.md`). Phase 2 cannot proceed module-by-module
without first deciding, once, how a module talks to the backend, how
auth works, and how loading/error states are handled — otherwise each of
the 14 Phase 2 modules would independently invent its own answer, which is
exactly the inconsistency this documentation structure exists to prevent.

### Current state

- `src/api/http.ts` — a real `fetch()`-based wrapper (`requestJson<T>()`,
  cached `getJsonCached<T>()`) reading `import.meta.env.VITE_API_BASE_URL`.
  **Zero call sites anywhere.**
- No `.env`/`.env.example` file anywhere in the frontend — even wiring
  `http.ts` up today resolves to an empty base URL.
- No dev proxy in `vite.config.ts`.
- `src/redux/slices/authSlice.ts` — a fully-typed auth slice (token in
  `localStorage`, `setToken`/`setUser`/`logout` actions) that is never
  dispatched to from anywhere. No login page exists. No route guarding
  exists in `App.tsx`.
- Redux Toolkit is installed and the store is mounted in `main.tsx`, but
  `useAppSelector`/`useAppDispatch` have zero usages anywhere in
  `src/admin`, `src/client`, or `src/features`.
- No data-fetching library installed (no React Query/SWR/RTK Query).
- Shared loading/error UI primitives exist
  (`src/shared/ui/FullPageLoader.tsx`, `InlineLoader.tsx`,
  `ErrorBoundary.tsx`) but are used in exactly one module (EcoLoop), and
  even there the "loading" is a fake `setTimeout`, not a real async call.
- Two fully orphaned duplicate admin-page trees exist:
  `src/features/onboarding/` (duplicates all 8 existing admin modules,
  often as a *larger* second implementation) and `src/routes/admin/`
  (~1,801 lines). Neither is imported by `App.tsx`.

### Problems identified

1. No decision has ever been made about how the frontend should call the
   backend — building Phase 2 module-by-module without deciding this first
   would produce 14 different ad hoc answers.
2. The dead/duplicate trees are a real risk during integration: someone
   wiring up "Document Vault," for instance, could easily wire the wrong
   (218-line vs. 836-line) implementation without realizing a second one
   exists, since neither is currently routed and both look plausible.
3. The auth slice being unused means every admin request today would be
   sent with no `Authorization` header at all — every backend route
   (`auth: true`) would 401 immediately once real calls are made, unless
   auth is wired up as part of this same foundation work, not left for
   later.
4. Hand-copying backend DTO shapes into frontend types (the only type-
   sharing approach available without adopting codegen) is exactly the
   practice that produced repeated backend-mock-vs-real-schema
   disagreements this session (wrong enum value counts, missing fields,
   invented fields) — the same risk exists on the frontend side unless
   each module's types are explicitly checked against the real backend DTO
   at integration time, not assumed correct once and left alone.

### Proposed solution

See `ARCHITECTURE.md` (top-level) for the full decision set. Summary:
extend `src/api/http.ts` into per-module typed clients; adopt TanStack
Query for server state (Redux kept only for genuine client state, if any
turns out to be needed); build a minimal login page + route guard wired to
the existing `authSlice`; add `.env.example` + a Vite dev proxy; delete or
explicitly reconcile the two dead trees before Phase 2 begins.

### Expected architecture

```
Page → module hook (React Query) → module api.ts → shared http.ts → backend
```
One http client, one query-key convention, one error shape, one auth
header injection point — see `API_LAYER.md`, `REACT_QUERY.md`,
`AUTHENTICATION.md` for each piece in detail.

### Risks

- **TanStack Query is not yet an approved dependency** — if rejected in
  favor of expanding Redux, `REACT_QUERY.md`'s strategy needs to be
  rewritten as an RTK-Query-based equivalent before Phase 2 starts.
- **Deleting the dead trees is destructive** — per this project's own
  safety conventions, deletion should be preceded by a final confirmation
  that nothing outside `src/features/onboarding/`/`src/routes/admin/`
  references them (the baseline audit already checked this once; a second
  check immediately before deletion is cheap insurance).
- **Hand-mirrored types will drift** unless each Phase 2 module doc
  explicitly re-verifies its types against the backend DTO at integration
  time, not just once during this planning pass.

### Dependencies

- Backend modules must stay contract-stable during Phase 1/2 — any
  breaking backend DTO change after a frontend module is wired
  invalidates that module's types silently unless caught.
- The backend's CORS configuration must allow the frontend's dev origin
  (not yet verified — an open item, see below).

### Open Questions

1. **TanStack Query vs. expanding Redux** — not decided. This blueprint
   proposes TanStack Query; needs explicit approval before
   `REACT_QUERY.md`'s plan is implemented.
2. **Delete vs. archive the dead trees?** — outright deletion vs. moving
   to a clearly-marked `_archive/` folder pending a final human check.
   Not decided.
3. **Codegen from the backend's OpenAPI spec — now or later?** Proposed:
   later (see `ARCHITECTURE.md`), revisit if hand-mirrored types drift.
   Not locked in as a permanent decision.
4. **CORS** — has the backend's Express app been confirmed to allow the
   frontend's dev server origin? Not verified as part of this audit; needs
   a backend-side check before Phase 1 implementation can be considered
   complete.
5. **Refresh tokens** — the existing `authSlice` has no refresh-token
   concept and neither does the backend's auth module (per prior session
   research). Deferred entirely, not decided to be built at all.

### Acceptance Criteria

- [x] Data-fetching library decision approved and documented — TanStack
      Query, installed and configured (`src/api/client/queryClient.ts`,
      mounted in `main.tsx`).
- [ ] Dead-tree resolution decision approved and executed — **not done in
      Phase 1.1** (explicitly out of scope for the API-foundation-only
      pass; still open).
- [x] `.env.example` exists (`VITE_API_BASE_URL`); reads only from Vite
      env, no hardcoded URL fallback.
- [ ] `vite.config.ts` has a working dev proxy — **not done**, not part
      of Phase 1.1's explicit scope; open item.
- [ ] A login page exists, dispatches to `authSlice`, and successfully
      obtains a token from `POST /api/auth/login` against a running
      backend — **not done**, explicitly excluded from Phase 1.1's scope
      ("No login page. No backend login call.").
- [x] The shared HTTP client attaches the token to every request (when
      present) and calls a registered unauthorized-handler on 401 — the
      *handler itself* (real logout + redirect) can't be exercised
      end-to-end without a login page to obtain a token from first; the
      mechanism is built and typechecks.
- [ ] At least one real, end-to-end request (any GET) succeeds against the
      live backend from a running frontend dev server — **not attempted**;
      no module is integrated yet (explicitly out of scope — "Do NOT
      integrate any backend module pages yet").
- [x] `phase-1-foundation/AUDIT.md` has a second, post-implementation audit
      entry — see below, verdict noted there.

### Implementation Notes (Phase 1.1 — API Foundation)

Implemented: `src/api/client/` (`config.ts`, `errors.ts`, `auth.ts`,
`http.ts`, `queryClient.ts`, `index.ts`), 13 module boundary placeholders
in `src/api/modules/`, `src/api/hooks/useApi.ts`, `src/auth/`
(`auth.types.ts`, `auth.utils.ts`, `AuthProvider.tsx`, `ProtectedRoute.tsx`,
`index.ts`), `src/shared/utils/{storage,url}.ts`,
`src/shared/types/{api,common}.ts`, `.env.example`, `@tanstack/react-query`
installed, `QueryClientProvider` mounted in `main.tsx`, a `typecheck`
script added to `package.json` (none existed before).

**Consolidation, not left as a duplicate:** the old `src/api/http.ts`/
`cache.ts` (zero call sites, per the baseline audit) were deleted rather
than left alongside the new `src/api/client/` — keeping both would have
recreated exactly the kind of "which implementation is the real one"
ambiguity the baseline audit flagged as a risk for the orphaned page
trees, just one level lower (two HTTP clients instead of two admin
pages).

**`AuthProvider` is a facade over the existing Redux `authSlice`, not a
second store** — per `ARCHITECTURE.md`'s state-management decision (Redux
for genuine client state, TanStack Query for server state), auth state is
client state, so it stays in Redux; the Context only gives components a
`useAuth()` API and lets the HTTP client register a 401 handler without
`src/api/` importing React/Redux.

**Not mounted:** `AuthProvider`/`ProtectedRoute` are built, exported, and
typecheck, but are **not** wired into `main.tsx`/`App.tsx` yet. Mounting
`ProtectedRoute` around the real route tree today would lock every
currently-navigable admin page behind a login screen that doesn't exist —
deferred to the phase that builds the real login page, not silently
skipped.

**No architectural deviations** from the approved docs were needed. One
structural gap was found and is documented, not invented around: the
existing `authSlice.ts`'s `User` interface is not exported, so
`src/auth/auth.types.ts`'s `AuthUser` duck-types the same shape instead of
importing it — a small cleanup for whoever eventually exports it, not
fixed here (touching `authSlice.ts` itself was outside this phase's
"infrastructure only, don't rewrite existing code" scope).

### Audit Notes

See `AUDIT.md` for the pre-implementation baseline audit and the Phase 1.1
post-implementation audit entry appended to that same file — not a separate
file, so the before/after state is easy
to compare in one place.

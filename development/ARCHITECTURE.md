# Frontend Architecture

**Status:** 📝 Proposed — pending review/approval, nothing below is implemented yet · **Updated:** 2026-07-28

This document records the frontend's architecture decisions and *why* each
was made — the frontend equivalent of a backend module's "Architecture
Freeze" section. Where a decision is still open, it's marked **PENDING**
rather than silently assumed.

---

## Folder Structure

The existing per-module convention is kept, extended with one new
sibling folder:

```
src/admin/<module>/
├── pages/
├── components/
├── services/
│   ├── mock/        ← existing — kept during migration, removed per-module
│   │                    once that module's real integration lands
│   └── api.ts        ← NEW — the real, typed calls for this module
├── hooks/            ← NEW — this module's React Query hooks
└── types/
```

**Why:** every module already follows `pages/components/services/types`
— extending it (rather than introducing a parallel `src/features/`-style
tree, which is exactly the pattern that produced this session's orphaned
duplicate trees) keeps the migration mechanical: one module at a time,
same shape, `mock/` deleted only once `api.ts` is proven working.

See `phase-1-foundation/PROJECT_STRUCTURE.md` for the full folder-by-folder
breakdown, including which existing folders are dead code slated for
removal.

## Module Boundaries

One frontend module folder per backend route module — a 1:1 mapping,
matching the backend's own module boundaries exactly (no frontend module
should call more than one backend module's routes directly; if a page
needs data from two backend modules, it composes two hooks, it doesn't
reach into another module's `api.ts`/`hooks/` from outside).

## API Layer

**Decision:** extend the existing (currently unused) `src/api/http.ts`
into one typed client file per backend module, rather than adopting a
generated OpenAPI client for Phase 1.

**Why:** the backend already exposes a real OpenAPI/Swagger spec
(`backend/src/config/swagger.ts`, served at `/docs.json`) — generating a
client from it (e.g. via `openapi-typescript`) is the more scalable
long-term answer and avoids the exact hand-copied-type drift this session
found repeatedly on the backend side (mock types disagreeing with real
enums). It is **not** adopted for Phase 1 itself because introducing
codegen tooling is its own decision with its own risk, and the immediate
goal is proving the integration pattern works end-to-end on one module
first. **Revisit after Phase 1**: if hand-written types drift from the
backend more than once during Phase 2, that's the trigger to switch to
codegen rather than tightening the hand-written convention further.

See `phase-1-foundation/API_LAYER.md` for the concrete request/response/
error-handling design.

## State Management

**PENDING — not yet approved.** Redux Toolkit is already installed and
its store is mounted, but is completely unused (`useAppSelector`/
`useAppDispatch` have zero call sites anywhere). Two real options:

1. Keep Redux for genuine client-only state (UI state, filters, anything
   that isn't "data from the server") and adopt **TanStack Query** for all
   server state (fetching, caching, invalidation, loading/error). This is
   the recommended option — it gives every module loading/retry/caching
   behavior for free instead of it being hand-rolled 14 times, which is
   what would happen if server state were pushed into Redux via thunks.
2. Expand Redux's own async patterns (RTK Query, or manual thunks) to
   cover server state too, avoiding a second dependency.

**Recommendation:** option 1 (TanStack Query + Redux for client state
only, if any client state turns out to be needed at all). Not decided
until reviewed — see `phase-1-foundation/REACT_QUERY.md`.

## Authentication Flow

An `authSlice` already exists (token persisted to `localStorage`,
`setToken`/`logout` actions) but is entirely inert — no login page exists,
nothing dispatches to it, and nothing reads it to guard a route. Proposed:

```
Login page (NEW)
  → POST /api/auth/login
  → on success: authSlice.setToken() + setUser()
  → http client attaches `Authorization: Bearer <token>` to every request

Route guard (NEW, wraps the admin route tree in App.tsx)
  → reads authSlice.isAuthenticated
  → redirects to /login if false

http client 401 response
  → authSlice.logout() + redirect to /login
```

See `phase-1-foundation/AUTHENTICATION.md` for the full design, including
what's explicitly deferred (refresh tokens, role-based UI gating — the
backend has no RBAC today per `BACKEND-DECISIONS-AND-QUESTIONS.md` D9, so
neither does the frontend need any yet).

## Data Flow

```
Page component
  → React Query hook (src/admin/<module>/hooks/useX.ts)
  → typed API function (src/admin/<module>/services/api.ts)
  → src/api/http.ts (shared client: base URL, auth header, error normalization)
  → backend
```

No component calls `fetch`/the shared client directly — every network
call goes through a module's own hook, so loading/error/caching behavior
is consistent everywhere by construction, not by convention alone.

## Error Handling

- Network/HTTP errors are normalized once, in `src/api/http.ts`, into one
  shared error shape (matching the backend's own `ApiError` response
  contract) rather than every module inventing its own.
- React Query surfaces that error via its own `error`/`isError` state —
  pages render the existing `ErrorBoundary`/inline error UI already built
  (currently unused outside EcoLoop) rather than each page hand-rolling a
  try/catch.
- A 401 is handled globally (logout + redirect), not per-page.

## Component Hierarchy

Unchanged from what already exists — Pages → feature components → shared
UI primitives (`src/shared/ui/FullPageLoader.tsx`, `InlineLoader.tsx`,
`ErrorBoundary.tsx` already exist and should become the default loading/
error UI for every migrated module, not just EcoLoop).

---

## Known Dead Code (to resolve before/during Phase 1)

- `src/features/onboarding/` — duplicates all 8 existing admin modules,
  in most cases as a *larger*, independently-built second implementation
  (not a thin copy). Not imported by `App.tsx` or anything else.
- `src/routes/admin/` — a third, also fully orphaned generation
  (~1,801 lines).

Neither is deleted by this documentation commit — removal is Phase 1
implementation work, tracked in `phase-1-foundation/NOTES.md`, not a
documentation-only decision (deleting code needs its own confirmation
pass to make sure nothing was missed by the audit).

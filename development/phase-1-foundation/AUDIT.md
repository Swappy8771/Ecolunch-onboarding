# Phase 1 — Audit Log

Every completed phase (and, here, the pre-implementation baseline) gets a
dated audit entry appended below. Newest entry first.

---

## 2026-08-01 — Admin login implemented; closes this file's remaining Auth open items

`AuthProvider`/`ProtectedRoute` are now mounted in `App.tsx` (inside
`BrowserRouter`, wrapping the whole route tree; `/admin/*` guarded,
`/login`/`/client/*` not). New: `src/auth/pages/LoginPage.tsx`,
`src/api/modules/auth.api.ts`, `src/features/auth/{mappers,hooks}/`,
`queryKeys.auth`. Fixed the two items this file flagged as follow-up
cleanup rather than leaving them: `authSlice.ts` now imports `AuthUser`
from `auth.types.ts` directly instead of duck-typing its own `User`
interface, and both now match the backend's real login-response shape
(`{id, email, firstName, lastName}` — no `name`/`role`, since the backend
has no roles) instead of the previously-invented shape. `authSlice.ts`
also now routes through `shared/utils/storage.ts`'s
`getStoredToken`/`setStoredToken`/`clearStoredToken` instead of duplicating
direct `localStorage` calls. Full detail in `AUTHENTICATION.md`.

## 2026-07-29 — Note: Phase 2 (Typed API Contract Layer) resolved two Phase 1.1 open items

Phase 2's implementation (audited in full in
`phase-2-api-integration/NOTES.md`, not duplicated here since it isn't
Phase 1 scope) closes two items this file's Phase 1.1 entry left open:
1. **"Whether Modules & Required Setup needs its own `*.api.ts` file"**
   (see "Remaining Technical Debt" below) — resolved yes; it now has
   `src/api/modules/modulesRequiredSetup.api.ts`, a distinct file from
   `modules.api.ts` (Modules & Pricing), since they are separate backend
   modules and the query-key factory (`src/api/queryKeys.ts`) had already
   modeled them as separate.
2. **13 empty API placeholder files** are no longer placeholders — all 13
   (now 14, counting the new `modulesRequiredSetup.api.ts`) expose real
   typed functions against the backend's actual routes. This does not
   change this file's PASS verdict for Phase 1.1's own claimed scope
   (infrastructure only); it is recorded here purely as a pointer so this
   audit log doesn't go stale about a decision it explicitly left open.

The other three "Remaining Technical Debt" items below (dead-tree removal,
Vite dev proxy, login page/route-guard mounting) are untouched by Phase 2
and remain open.

---

## 2026-07-29 — Phase 1.1 (API Foundation) — Post-Implementation Audit

**What was reviewed:** the newly-created API client, module API
boundaries, React Query setup, auth infrastructure, and shared utilities/
types, against `ARCHITECTURE.md`/`STANDARDS.md`/the six
`phase-1-foundation/*.md` design docs — plus a re-check that no feature
page, mock data, routing, or duplicate tree was touched, per this phase's
explicit scope.

### What was implemented

- `src/api/client/` — `config.ts` (env resolution only), `errors.ts`
  (`ApiError` + normalization), `auth.ts` (token header injection + a
  registerable 401 handler, no React/Redux dependency), `http.ts` (the one
  shared fetch wrapper: base URL, headers, JSON parsing, timeout via
  `AbortController`, error normalization), `queryClient.ts` (TanStack
  Query defaults per `REACT_QUERY.md`), `index.ts` (barrel).
- `src/api/modules/*.api.ts` — 13 files, each an empty typed placeholder
  object with a comment pointing at its Phase 2 doc. Matches the approved
  file list exactly (13 files, not 14 — `modules.api.ts` covers Modules &
  Pricing only; whether Modules & Required Setup gets its own file is left
  as an open item in that file's own comment, not decided here).
- `src/api/hooks/useApi.ts` — `useApiQuery`/`useApiMutation`, typed
  wrappers around TanStack Query's core hooks scoped to `ApiError`.
- `src/auth/` — `auth.types.ts`, `auth.utils.ts`, `AuthProvider.tsx`
  (facade over the existing `authSlice`), `ProtectedRoute.tsx`, `index.ts`.
- `src/shared/utils/storage.ts` (token storage, the one place owning the
  `authToken` key name) and `url.ts` (query-string/path helpers).
- `src/shared/types/api.ts` and `common.ts` — generic envelope/pagination/
  identifiable types only, no backend DTO copied in.
- `.env.example` with `VITE_API_BASE_URL`.
- `@tanstack/react-query` installed; `QueryClientProvider` mounted in
  `main.tsx` alongside the existing Redux `Provider` (required by
  `REACT_QUERY.md`'s own instruction to wrap the app).
- A `typecheck` script added to `package.json` (`tsc -b --noEmit`) — none
  existed before, needed to actually run the verification this phase's own
  workflow requires.
- **Removed** `src/api/http.ts` and `src/api/cache.ts` — both confirmed
  zero call sites (baseline audit + a fresh grep immediately before
  deletion), fully superseded by `src/api/client/`. This is a
  consolidation of the API layer itself (explicitly in this phase's
  scope), not a "duplicate tree" removal in the sense Phase 1's dead-code
  item means (`src/features/onboarding/`, `src/routes/admin/` — untouched).

### Findings

| Check | Result |
|---|---|
| Feature pages modified? | No — confirmed via `git status`: only `package.json`/`package-lock.json`, `main.tsx`, the two deleted files, and new files/folders changed. |
| Mock data replaced? | No — no `services/mock/` file in any admin/client module was touched. |
| Routing changed? | No — `App.tsx` was not modified. `ProtectedRoute` exists but is not applied to any route. |
| Duplicate trees removed? | No — explicitly out of this phase's scope; `src/features/onboarding/` and `src/routes/admin/` are untouched and still present. |
| `npm run typecheck` | Clean, 0 errors. |
| `npm run lint` | 17 findings total; 16 confirmed pre-existing in files this phase never touched (cross-checked against `git status`); 1 new finding in `AuthProvider.tsx` (`react-refresh/only-export-components`, from exporting both a component and `useAuth`) — this exactly mirrors the same already-tolerated pattern in the pre-existing `ThemeContext.tsx`/`LangContext.tsx`, kept consistent with that convention rather than restructured. |
| Circular dependencies? | None — `src/api/client/auth.ts` depends on `@shared/utils/storage` (one direction); `src/auth/` depends on `src/api/client/auth.ts` and `@/redux/*` (one direction); `src/api/client/http.ts` depends on `@shared/utils/url` (one direction). No file in `src/shared/` or `src/api/client/` imports back from `src/auth/`. |
| `any` usage in new code? | None. |
| Named exports / barrels? | All new files use named exports; `src/api/client/index.ts` and `src/auth/index.ts` provide barrels. |

### Issues

None architecture-violating. Two structural gaps found and documented,
not fixed (out of this phase's scope):
1. `authSlice.ts`'s `User` interface isn't exported — `auth.types.ts`'s
   `AuthUser` duck-types the same shape instead. Cosmetic, not a bug (TS
   structural typing makes this safe), but worth a future one-line export
   fix in `authSlice.ts` itself.
2. `@caterer` is defined as a path alias (`vite.config.ts`/
   `tsconfig.app.json`) pointing at `./src/caterer`, but the actual folder
   is `src/client/` — a pre-existing dead alias, unrelated to this
   phase's work, not fixed here.

### Fixes

N/A — no issue rose to "must fix before this phase can be considered
done" per the audit criteria.

### Remaining Technical Debt

- Dead-tree removal (`src/features/onboarding/`, `src/routes/admin/`).
- Vite dev proxy + confirming the backend's real local port/CORS config.
- Login page + mounting `AuthProvider`/`ProtectedRoute`.
- Whether Modules & Required Setup needs its own `*.api.ts` file.
- The two minor gaps under "Issues" above.

### Verdict

**PASS** for the scope actually claimed (API client, env config, React
Query, auth infrastructure, shared utilities/types, folder structure) —
every item in this phase's explicit deliverable list exists, typechecks,
and lints clean relative to pre-existing baseline. **Not yet a PASS for
all of Phase 1** as originally scoped in `NOTES.md` (dead-tree removal and
the full login/route-guard flow remain, see Remaining Technical Debt) —
tracked as open work in `ROADMAP.md`, not silently dropped.

---

## 2026-07-28 — Baseline Audit (pre-implementation)

**What was reviewed:** the entire frontend (`Ecolunch/src/`) for API-
integration readiness — HTTP client, auth, state management, environment
config, module coverage, and duplicate/dead code — ahead of any Phase 1
implementation work.

### Findings

| Area | Finding |
|---|---|
| HTTP client | `src/api/http.ts` exists, is real and reasonably well-formed (`requestJson<T>`, `getJsonCached<T>`) — but has **zero call sites anywhere**. |
| Environment | **No `.env`/`.env.example` anywhere.** `VITE_API_BASE_URL` (already read by `http.ts`) has no default and resolves empty. |
| Dev proxy | `vite.config.ts` has no `server.proxy` — no `/api/*` routing to the backend. |
| Auth | `authSlice.ts` is fully built (token persistence, actions) but **never dispatched to anywhere.** No login page exists. No route guarding exists in `App.tsx`. |
| State management | Only Redux Toolkit installed; store mounted but **`useAppSelector`/`useAppDispatch` have zero usages** anywhere in `admin`/`client`/`features`. No React Query/SWR/etc. installed. |
| Loading/error UI | `FullPageLoader`/`InlineLoader`/`ErrorBoundary` exist but are used in exactly **one** module (EcoLoop), and even there driven by a fake `setTimeout`, not a real async lifecycle. Every other page assumes instantly-present data. |
| Types | No shared types between frontend and backend at all. Only 4 of 8 existing admin modules have a populated `types/` file. Backend exposes a real OpenAPI/Swagger spec (`backend/src/config/swagger.ts`, `/docs.json`) that nothing on the frontend references. |
| Module coverage | Backend mounts 17 route modules. Frontend has **8** admin module folders. **Missing entirely:** Banking, Establishments, Menus, Users. Corrections exists client-side only, no admin page. Audit is a sub-tab inside Modules & Pricing, not its own surface. |
| Dead code | `src/features/onboarding/` duplicates **all 8** existing admin modules — in most cases as a larger, independently-built second implementation (e.g. Document Vault: 208 lines live vs. 836 orphaned; Contract Management: 288 vs. 767; EcoLoop: 119 vs. 547). `src/routes/admin/` is a third, also fully orphaned generation (~1,801 lines). Neither is referenced by `App.tsx` or anything else. |
| Real network calls | **None exist anywhere in the frontend, confirmed.** Every admin/client page renders from a local mock array. |

### Issues

1. Zero working integration path exists today — every piece needed
   (client, env, auth, data-fetching) is either dead or half-built.
2. Two fully orphaned duplicate implementations create real risk of
   wiring the wrong one during Phase 2 if not resolved first.
3. Auth being completely unwired means the very first real backend call
   would 401 unless auth is built as part of the *same* phase, not
   deferred.
4. Nearly half the target modules don't have a page to convert yet — this
   is "build the page" work, not "swap mock for fetch" work, and should be
   scoped/estimated as such in Phase 2 planning.

### Fixes

None — this is a pre-implementation baseline audit. No code was changed.

### Remaining Technical Debt

Everything under "Findings" above is, by definition, the technical debt
Phase 1 exists to pay down. Tracked in `NOTES.md`'s Acceptance Criteria.

### Verdict

**FAIL** — expected and by design: this audit establishes that Phase 1
has not been implemented yet, giving the work that follows a precise,
documented starting point rather than an assumed one. The next audit entry
in this file should be the post-implementation Phase 1 audit, expected to
reference this entry's findings one by one.

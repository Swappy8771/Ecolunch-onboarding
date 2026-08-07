# API Layer

**Status:** 📝 Proposed, not implemented · **Updated:** 2026-07-28

---

## What exists today

`src/api/http.ts` — a real, reasonably well-formed `fetch()` wrapper:
`requestJson<T>()` and a cached `getJsonCached<T>()`, reading
`import.meta.env.VITE_API_BASE_URL`. **It has zero call sites anywhere in
the frontend.** It is not broken — it is simply never used.

## HTTP Client

Proposed: keep `http.ts` as the *one* place that knows about `fetch`,
the base URL, and default headers. Every module's `services/api.ts` calls
through it — no module calls `fetch` directly.

```
src/api/http.ts
  requestJson<T>(path, options) → attaches base URL + Authorization header
                                  → parses JSON → throws a normalized
                                    ApiError on non-2xx
```

**Why one shared client instead of per-module fetch calls:** a single
choke point is where auth-header injection, base-URL resolution, and
error normalization each get implemented exactly once — the same reasoning
already applied consistently across the backend's own modules this
session (e.g. every module reusing `writeAudit()`/`computeCompletion()`
rather than reimplementing them).

## Request Flow

```
api.ts function (e.g. getEstablishmentOverview(catererId))
  → builds the path (`/admin/establishments/caterers/${catererId}/overview`)
  → calls http.ts's requestJson<EstablishmentOverviewDTO>(path)
  → http.ts attaches base URL + Authorization header + Content-Type
  → fetch()
```

## Response Flow

```
fetch() resolves
  → non-2xx status → http.ts throws ApiError (see below)
  → 2xx → response body parsed as JSON, returned typed as T
  → React Query hook receives the typed value directly — no
    re-parsing/re-shaping in the component
```

## Error Handling

Proposed shared error shape, mirroring the backend's own `ApiError`
response contract (status + message) rather than inventing a new one:

```ts
class ApiError extends Error {
  status: number;
  body: unknown; // the raw backend error payload, for cases that need detail
}
```

`http.ts` throws this for any non-2xx response. React Query surfaces it via
its own `error` state — pages render the existing `ErrorBoundary`/inline
error UI, never a bespoke per-page `try/catch`.

## Authorization

`http.ts` reads the current token (from the `authSlice`/its `localStorage`
persistence, whichever `AUTHENTICATION.md` finalizes) and attaches
`Authorization: Bearer <token>` to every request. A 401 response triggers a
shared handler (logout + redirect to `/login`) rather than being handled
per-module.

## Interceptors

No interceptor library is proposed (no axios) — `http.ts` itself is the
single interception point (request: attach auth header; response: throw
`ApiError` / handle 401). This keeps the dependency surface minimal, matching
this being a foundational, low-risk layer rather than a place to introduce
new tooling.

## Module API Structure

One file per backend module: `src/admin/<module>/services/api.ts`. Each
exported function:
- Takes explicit parameters (never reads global/ambient state).
- Returns the module's own DTO type.
- Maps 1:1 to one backend endpoint — no function silently calls two
  endpoints and merges the results (that composition, if needed, happens
  in a hook or the calling page, so it's visible, not hidden inside the
  client).

## Why this architecture was chosen

- **Reuses what already exists** (`http.ts`) rather than introducing a
  second HTTP mechanism — the file was already built correctly, just never
  adopted.
- **Defers codegen** (see `ARCHITECTURE.md`) rather than introducing an
  OpenAPI-client-generation pipeline as part of the very first piece of
  real integration work — proving the pattern manually on one module first
  de-risks adopting codegen later with a working reference to migrate
  from.
- **One choke point for auth/errors** avoids the 14-modules-14-answers
  problem this whole documentation effort is meant to prevent.

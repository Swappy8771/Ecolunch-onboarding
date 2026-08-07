# Environment & Build Configuration

**Status:** 📝 Proposed, not implemented · **Updated:** 2026-07-28

---

## What exists today

- **No `.env`/`.env.example` file exists anywhere in the frontend.**
  `src/api/http.ts` already reads `import.meta.env.VITE_API_BASE_URL`, so
  even the existing (unused) client resolves to an empty base URL today.
- `vite.config.ts` (20 lines): plugins + path aliases only — **no
  `server.proxy` block**, so there is no `/api/*` → backend dev-proxy
  routing.
- The backend, by contrast, already has a real `.env`/`.env.example` and a
  zod-validated `env.ts` — the frontend has no equivalent discipline yet.

## Environment Files (proposed)

```
.env.example          ← committed, documents every variable, no real secrets
.env.local             ← gitignored, developer's actual local values
```

Proposed variables for Phase 1:
```
VITE_API_BASE_URL=http://localhost:<backend-port>/api
```
No other variables are proposed yet — added only as a real need appears
(e.g. a feature flag), not speculatively.

## API URLs

- **Local development:** `http://localhost:<backend-port>/api`, matched
  to whatever port the backend's `env.ts`/`PORT` actually runs on — needs
  confirming against the backend's own `.env.example` before this is
  finalized (open item, not yet verified as part of this documentation
  pass).
- **Staging/Production:** not yet defined — no staging/production backend
  deployment target has been referenced anywhere in this session's
  research. Left unspecified rather than guessed.

## Local Setup (proposed, once implemented)

1. Copy `.env.example` to `.env.local`, fill in `VITE_API_BASE_URL`.
2. Ensure the backend is running locally (per `backend/README`/its own
   env setup).
3. `npm run dev` — Vite's dev server proxies `/api/*` to the backend (see
   below), so the frontend can call relative paths (`/api/admin/...`)
   without hardcoding a host in application code — only `http.ts` needs
   the base URL, and only for constructing paths, not for CORS purposes,
   once the proxy is in place.

## Development — Vite Proxy (proposed)

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_BASE_URL ?? 'http://localhost:<backend-port>',
      changeOrigin: true,
    },
  },
},
```
**Why:** avoids CORS entirely in local dev (the browser sees same-origin
requests to the Vite dev server, which proxies them server-side) — the
alternative is confirming/configuring CORS on the backend for every
frontend dev origin, which is more fragile across different developers'
local ports.

## Production Build Configuration

No changes proposed to `"build": "tsc -b && vite build"` itself — a
production build simply needs `VITE_API_BASE_URL` set to a real backend
URL at build time (Vite inlines `import.meta.env.*` at build, not runtime),
which has implications for how many separate builds are needed per
environment — not yet decided since no deployment target exists yet (see
above). Flagged as an open item for whoever sets up the actual deployment
pipeline, not resolved here.

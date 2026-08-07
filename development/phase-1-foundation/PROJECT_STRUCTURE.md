# Project Structure

**Status:** documents current state + proposed additions · **Updated:** 2026-07-28

---

## Current `src/` layout (as found by the baseline audit)

```
src/
├── admin/                    ← Admin Portal — 8 modules, each mock-only
│   ├── caterers/
│   ├── contract-management/
│   ├── modules-pricing/      ← includes a "modules-config" sub-page and
│   │                            an Audit sub-tab (not its own module)
│   ├── golive-monitor/       ← live-routed; a second implementation exists
│   │                            under src/features/onboarding/
│   ├── ecoloop/              ← the one module with any loading/error UI,
│   │                            though driven by a fake timer
│   ├── validation-center/    ← live-routed; a second implementation exists
│   │                            under src/features/onboarding/
│   ├── document-vault/       ← live-routed; a second implementation exists
│   │                            under src/features/onboarding/
│   └── dashboard/
├── client/                   ← Client Portal (caterer-facing) — also mock-only
│   ├── corrections/          ← client-facing only; no admin equivalent exists
│   ├── golive/
│   ├── modules/              ← "Modules & Required Setup" client page
│   ├── contrats/
│   └── document-vault/
├── features/onboarding/      ← ORPHANED — duplicates all 8 admin modules,
│                                 not imported by App.tsx or anything else
├── routes/admin/              ← ORPHANED — a third generation, ~1,801 lines,
│                                 not imported anywhere
├── redux/
│   ├── slices/authSlice.ts    ← fully built, never dispatched to
│   └── (store mounted in main.tsx, otherwise unused)
├── api/
│   └── http.ts                ← real fetch() wrapper, zero call sites
├── shared/ui/                 ← FullPageLoader, InlineLoader, ErrorBoundary
│                                  (used in exactly one module today)
└── app/
    └── App.tsx                 ← route tree; no auth guarding
```

## Why each existing folder exists

- **`src/admin/<module>/`** — one folder per admin-portal feature,
  currently each with `pages/components/services/mock/types/`. This is the
  folder shape `ARCHITECTURE.md` extends (adding `api.ts`/`hooks/`) rather
  than replaces.
- **`src/client/`** — the caterer-facing portal, currently paused per the
  backend's own `BACKEND-DECISIONS-AND-QUESTIONS.md` D1 — every backend
  module built this session that has a caterer-facing counterpart was
  built admin-viewable-only for exactly this reason. Frontend integration
  of `src/client/` pages is out of scope until the caterer portal itself
  resumes — tracked as a future item, not part of Phase 2's module list.
- **`src/redux/`** — the store exists and is mounted, but only
  `authSlice` has real content; everything else is unused scaffolding.
- **`src/api/`** — currently one dead file (`http.ts`). Phase 1 makes this
  folder's contents actually load-bearing.
- **`src/shared/ui/`** — the loading/error primitives every module should
  adopt, not just EcoLoop.

## Ownership / Module Boundaries

Each `src/admin/<module>/` folder owns its own pages/components/hooks/api
calls. No module imports another module's `services/api.ts` or `hooks/`
directly — if a page genuinely needs two modules' data (e.g. a dashboard
combining Go-Live + Corrections), it composes two hooks at the page level,
mirroring the backend's own "one module, one service, cross-module calls
only through the sibling's public service" discipline established
throughout this session's backend work.

## What's missing entirely (needs new folders, not just new files)

Per the baseline audit, these backend modules have **no** frontend admin
folder at all today:
- `src/admin/banking/`
- `src/admin/establishments/`
- `src/admin/menus/`
- `src/admin/users/`
- An admin-side `src/admin/corrections/` (only `src/client/corrections/`
  exists today)
- Audit as its own module (`src/admin/audit/`) rather than a sub-tab of
  Modules & Pricing

Building these is Phase 2 work, not Phase 1 — Phase 1 only needs to
establish the *pattern* (one already-existing module, fully wired) that
these new folders will then follow.

## Dead code recommended for removal (Phase 1 scope)

- `src/features/onboarding/` (duplicates all 8 admin modules)
- `src/routes/admin/` (third orphaned generation)

See `NOTES.md`'s Open Question #2 for the delete-vs-archive decision still
pending.

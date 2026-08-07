# EcoLunch PRS — Frontend Architecture

> **What this doc is:** an accurate map of the current `src/` structure, written so a
> developer joining today can find "the caterer Contracts page" or "the admin Go-live page"
> without false leads. Updated 2026-08-02 after a structural cleanup pass (dead-code
> removal + the `client` → `caterer` rename described below).
>
> The historical refactor plan this file used to contain (dated June 2026) is kept at
> the bottom, clearly marked as superseded — most of it was executed differently or not
> at all; treat it as background, not as the current state.

---

## 1. The two portals

This app is two separate portals sharing one codebase, one router, and one build:

| Folder | Portal | Matches |
|---|---|---|
| `src/admin/` | **Onboarding ADMIN PORTAL** — the internal EcoLunch staff app | `client document/Admin Portal Document.md` |
| `src/caterer/` | **Caterer Onboarding Portal** — the caterer-facing app | `client document/Caterer Portal Document.md` |

If you're looking for a specific screen, start from whichever document names it, then look for
the matching section folder under `src/admin/` or `src/caterer/` — the folder names deliberately
mirror each document's own vocabulary (e.g. Admin doc's "Contract Management" → `src/admin/contract-management/`;
Caterer doc's "Corrections & Follow-up" → `src/caterer/corrections/`).

**Until 2026-08-02, `src/caterer/` was called `src/client/`** — a legacy name that predated
both documents and didn't match either one's own terminology ("Caterer Portal", never "Client
Portal"). It has been renamed throughout: the folder, `ClientLayout`/`ClientSidebar`/`ClientHeader`
→ `CatererLayout`/`CatererSidebar`/`CatererHeader`, every `Client*Page` component → `Caterer*Page`,
and every `/client/*` route → `/caterer/*`. If you see "Client" anywhere in code or a comment
referring to the caterer portal, it's stale — flag it.

---

## 2. Per-section folder shape

Every section under `admin/` and `caterer/` follows the same shape (not all subfolders exist for
every section yet — only created when there's real content for them):

```
admin/<section>/            caterer/<section>/
├── pages/                  ├── pages/
│   └── Admin<X>Page.tsx    │   └── Caterer<X>Page.tsx    ← what's actually routed (see App.tsx)
├── components/             ├── components/                ← section-local UI pieces
├── hooks/                  (caterer sections mostly don't need this — see §4)
├── services/
└── types/
```

`src/app/App.tsx` is the single source of truth for what's actually routed — every `lazy(() =>
import(...))` there names the real page component. If a file isn't reachable from there, it's dead,
no matter how complete it looks.

---

## 3. `src/features/` — the shared query/mutation layer

`features/` sits between `src/api/` and the page components. For each domain it holds hand-written
ViewModel types, mapper functions (raw API response → ViewModel), and TanStack Query hooks. Pages
never call `src/api/modules/*` directly — always through a `features/*/hooks/*` hook.

**Every folder here is portal-scoped — there is no folder actually shared by both portals** (despite
sitting in one flat directory). The prefix tells you which:

| Prefix | Portal | Examples |
|---|---|---|
| `caterer*` | Caterer Portal only | `catererMenus`, `catererContracts`, `catererBanking`, `catererCorrections`, `catererModulesRequiredSetup`, `catererProfile`, `catererAuth`, `catererEstablishments` |
| `admin*` | Admin Portal only | `adminContracts`, `adminValidation`, `adminGolive`, `adminEcoloop`, `adminModulesPricing`, `adminCaterers`, `adminDashboard`, `adminDocumentVault`, `adminAuth`, `adminUsers` |

(The `admin*` prefix was added in this same cleanup pass — these 10 folders used to have no
prefix at all, e.g. `features/contracts/` for admin vs. `features/catererContracts/` for caterer,
which looked like variants of the same thing rather than two different portals' data.)

---

## 4. Redux Toolkit — intentionally minimal

There are exactly **3 real slices**, all in `src/redux/slices/` or a feature's own `redux/` folder:

| Slice | Location | Owns |
|---|---|---|
| `auth` | `src/redux/slices/authSlice.ts` | Admin login token/user — `src/auth/AuthProvider.tsx` is a thin Context facade over this, not a separate state store |
| `catererAuth` | `src/features/catererAuth/redux/catererAuthSlice.ts` | Caterer login token/user |
| `catererProfile` | `src/features/catererProfile/redux/catererProfileSlice.ts` | Caterer profile edit-in-progress state |

**Everything else is TanStack Query, not Redux.** This is a deliberate rule, not an oversight or a
half-finished migration: Redux is reserved for genuine client-only state (auth session, in-progress
edits); all server data — every list, every detail view, every mutation across both portals — goes
through `features/*/hooks/`. If you're about to add a new Redux slice for server data, that's
almost certainly the wrong layer; add a query/mutation hook in `features/` instead.

There used to be a `dashboardSlice`/`uiSlice` pair registered in the store with zero real
consumers anywhere in the app — removed in this same pass, along with ~1000 lines of Redux
usage docs describing a pattern the app didn't actually follow.

---

## 5. Everything else, briefly

| Folder | Purpose |
|---|---|
| `src/api/client/` | The HTTP client (`http.ts`) + dual admin/caterer 401 handling (`auth.ts`) — a caterer-session 401 never logs out the admin session and vice versa, via `authDomain: 'admin' \| 'caterer'` on every request |
| `src/api/modules/` | Typed fetch functions per domain, `caterer-*.api.ts` for caterer, unprefixed for admin |
| `src/api/generated/` | OpenAPI-codegen'd request/response types — never hand-edited, regenerated from the backend's live spec |
| `src/api/hooks/` | `createQueryHook`/`useApiQuery`/`useApiMutation` — the factory every `features/*/hooks/*` file builds on |
| `src/layouts/admin/`, `src/layouts/caterer/` | The two portals' shells (header/sidebar/outlet) — matches `admin/`/`caterer/` 1:1 |
| `src/auth/` | Admin auth (Context facade + `ProtectedRoute`), plus `src/auth/caterer/` for the caterer auth equivalent |
| `src/shared/` | Cross-portal UI kit, contexts (Theme/Lang), i18n, generic components/hooks/utils — actually used by both portals, unlike `features/` |
| `src/app/App.tsx` | The one router — the ground truth for what's live |

---

## 6. Known gaps (honest, not aspirational)

- **i18n is partial, not universal** — only a minority of files use `useLang()`; most pages hardcode
  strings directly. Don't assume "everything goes through i18n" as a rule when reading code.
- **No `core/` engine layer exists** — an earlier attempt at one (`src/core/`) was 4 empty stub
  folders plus one fully-orphaned Smart Import component, none of it wired into anything; removed
  in this pass. Smart Import itself is not built on either portal yet (backend is a stub too).
- **`src/admin/modules-pricing/pages/AdminModulesConfigPage.tsx`** is a live but fully-mock,
  unrouted-from-sidebar page whose relationship to the real `AdminModulesPricingPage.tsx` is
  unresolved — don't treat it as current.
- **No unified "Caterer Onboarding File" view exists on the admin side** — the Admin Portal
  Document's §6 (open one caterer, see Profile/Banks/Menus/etc. all in one tabbed file) isn't
  built; each section is its own top-level admin page reached via a `?catererId=` deep link instead.

---

## Historical: June-2026 Refactor Plan (superseded)

The section below is the original, more ambitious restructuring plan this file used to contain in
full. Some of it happened (the `client` → `caterer` rename, deleting `features/onboarding/`,
per-section `pages/components/hooks/services/types` folders under `admin/`). Most of the rest —
a portal-agnostic `core/` engine layer with real Smart Import/Contracts/Dropbox integration, a
`services/` folder per feature with mock-then-real data functions, splitting i18n by portal — was
never executed and isn't currently planned. Treat everything below as background/inspiration only,
not as a description of what exists today.

<details>
<summary>Expand original plan (long)</summary>

*(Path aliases, `core/` engine extraction, per-feature `services/` layers, i18n namespace
splitting, and the original file-by-file migration table — written before the backend existed and
before either portal document was finalized. Available in git history at this file's prior
revision if needed.)*

</details>

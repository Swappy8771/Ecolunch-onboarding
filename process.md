# EcoLunch PRS — Project Structure & File Reference

## Overview

**EcoLunch PRS Onboarding Admin Portal** is a dark-theme enterprise SaaS application built to manage the full onboarding lifecycle of caterers (traiteurs) onto the EcoLunch / PRS platform. It exposes two portals:

- **Admin Portal** (`/admin/*`) — Onboarding admins manage caterers, validations, documents, contracts, modules, and go-live status.
- **Client Portal** (`/client/*`) — Each caterer's own workspace to fill out their onboarding sections and track progress.

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool + dev server |
| Tailwind CSS | 4.1.18 | Utility-first styling |
| React Router | 7.15.1 | Client-side routing |
| Lucide React | 1.16.0 | Icon library |

---

## Root Level Files

```
/
├── index.html              Entry HTML — mounts <div id="root">
├── vite.config.ts          Vite config — React plugin + Tailwind CSS Vite plugin
├── tsconfig.json           Root TS config — references app + node configs
├── tsconfig.app.json       App TS config — strict mode, ES2022, react-jsx
├── tsconfig.node.json      Node TS config — for Vite config file itself
├── package.json            Dependencies and scripts
├── eslint.config.js        ESLint rules
├── vercel.json             Vercel deploy config (SPA rewrites)
├── ONBOARDING.md           Project onboarding guide for new devs
├── admin.md                Admin portal notes
└── process.md              This file — structure reference
```

---

## `src/` — Application Source

```
src/
├── index.css               Design tokens + global styles
├── main.tsx                React entry point
├── app/
│   └── App.tsx             Root router — providers + lazy routes
├── api/
│   ├── http.ts             HTTP fetch wrapper
│   └── cache.ts            In-memory cache utility
├── shared/
│   ├── context/            React context providers
│   ├── hooks/              Custom React hooks
│   ├── i18n/               Translation strings
│   ├── components/         Reusable domain components (NEW)
│   └── ui/                 Primitive UI components
├── layouts/
│   ├── admin/              Admin shell (header + sidebar + outlet)
│   └── client/             Client shell (header + sidebar + outlet)
├── routes/
│   ├── admin/              Full admin page components
│   └── client/             Full client page components
└── features/
    ├── dashboard/          Dashboard-specific cards
    └── onboarding/         Feature modules for each onboarding section
```

---

## `src/index.css` — Design System

**Why it exists:** Single source of truth for all visual tokens. No hardcoded colors anywhere else — everything references CSS variables.

**What it defines:**

| Variable group | Examples | Purpose |
|---|---|---|
| `--bg-*` | `--bg-base`, `--bg-surface`, `--bg-card`, `--bg-inner` | Surface depth layers (4 levels) |
| `--text-*` | `--text-1` → `--text-4` | Text hierarchy from primary to subtle |
| `--border-*` | `--border-default`, `--border-strong`, `--border-subtle` | Border intensities |
| `--accent` | `#a3e635` (dark) / `#5c9e0f` (light) | Lime brand color |

Dark theme is default. Light theme overrides via `[data-theme="light"]` on the root element.

**Utility classes defined here:**
- `.card-float` — box-shadow card elevation
- `@keyframes spin` / `@keyframes pulse` — used by InlineLoader + notification bell

---

## `src/main.tsx` — Entry Point

Mounts the React app into `<div id="root">`. Wraps in `React.StrictMode` for development warnings.

---

## `src/app/App.tsx` — Root Router

**Why it exists:** Central place for:
1. Wrapping the app in all providers (`ThemeProvider`, `LangProvider`, `ErrorBoundary`)
2. Defining all routes in one place
3. Lazy-loading every page component so the initial bundle stays small

**Route structure:**
```
/                   → redirects to /admin/dashboard
/admin/*            → AdminLayout (header + sidebar) wraps all admin routes
/client/*           → ClientLayout (header + sidebar) wraps all client routes
```

All page components are loaded with `React.lazy()` + `<Suspense fallback={<FullPageLoader />}>`. This means each page is a separate JS chunk — the user only downloads what they visit.

---

## `src/api/` — Network Layer

### `http.ts`
Generic fetch wrapper. Exports:
- `requestJson<T>()` — makes a fetch call, throws `HttpError` on non-2xx, returns typed JSON
- `getJsonCached<T>()` — same but caches results in memory for 30s (TTL configurable)
- `buildUrl()` — constructs URL from base + query params object

### `cache.ts`
Simple in-memory Map-based cache.
- `getCached<T>(key)` — returns value if not expired
- `setCached(key, value, ttl)` — stores with expiry timestamp
- `clearCache(prefix?)` — clears all or by key prefix

**Why separate from http.ts:** Keeps caching logic isolated and testable independently of fetch logic.

---

## `src/shared/context/` — Global State

### `LangContext.tsx`
Manages UI language (French / English).

- Persists to `localStorage` as `ecolunch-lang`
- Defaults to French (`'fr'`)
- Exposes `useLang()` hook which returns `{ lang, setLang, t }` where `t` is the full typed translations object
- **Why not Zustand/Redux:** The app has very limited global state — just theme and language. Context + localStorage is the right level of complexity.

### `ThemeContext.tsx`
Manages dark / light mode.

- Persists to `localStorage` as `ecolunch-theme`
- Falls back to `window.matchMedia('prefers-color-scheme')` if not set
- On change, sets `data-theme="dark"` or `data-theme="light"` on `document.documentElement` — this triggers the CSS variable overrides in `index.css`
- Exposes `useTheme()` hook returning `{ theme, toggleTheme }`

---

## `src/shared/hooks/`

### `useIsDesktop.ts`
Returns `true` when viewport width ≥ 1024px (Tailwind's `lg` breakpoint).

Used by `AdminLayout` and `ClientLayout` to:
- Decide whether to render the sidebar as a fixed panel or a slide-over drawer
- Calculate the `margin-left` offset for the main content area

---

## `src/shared/i18n/` — Translations

### `fr.ts`
French translation strings. **This file defines the `Translations` type** via `export type Translations = typeof fr`. Every key added here automatically becomes a required key in `en.ts`.

### `en.ts`
English translations. Typed as `satisfies Translations` — TypeScript will error if any key from `fr.ts` is missing or has a wrong value type.

**Rule:** Always add new translation keys to `fr.ts` first. Then add the English equivalent in `en.ts`. Adding to `en.ts` first causes a TypeScript error.

**Structure of translation keys:**
```
common.*          Shared labels (cancel, save, search…)
status.*          Status labels (inProgress, approved, pending…)
priority.*        Priority labels
header.*          Header UI strings
adminSidebar.*    Admin nav labels
clientSidebar.*   Client nav labels
dashboard.*       Admin dashboard strings
traiteurs.*       Caterers page strings
centreValidation.*  Validation center strings
documentVault.*   Document vault strings
ecoloop.*         EcoLoop ticket strings
modules.*         Modules config strings
profil.*          Profile section strings
banques.*         Banking section strings
mesClients.*      Clients section strings
menus.*           Menus section strings
```

---

## `src/shared/components/` — Domain Reusable Components

These components are used across multiple admin pages. They encapsulate visual patterns that appeared copy-pasted across 2–4 pages.

### `PageHeader.tsx`
Page-level header with badge, gradient title, subtitle, and optional right slot.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `badge` | `{ icon, label }` | required | Top badge chip (e.g. "EcoLunch Admin") |
| `title` | `string` | required | Gradient h1 text |
| `subtitle` | `string?` | — | Muted description below title |
| `right` | `ReactNode?` | — | Right side (date widget, action buttons) |
| `size` | `'hero' \| 'page'` | `'hero'` | `hero` = large lg-breakpoint (Dashboard), `page` = compact sm-breakpoint (all other pages) |
| `glowColor` | `string?` | lime | Radial decoration color (hero only) |

**Used in:** Dashboard, Caterers, (Validation Center, Document Vault — pending)

---

### `SectionDivider.tsx`
Horizontal rule with a label. Used to separate sections on a page.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Section label text (uppercase) |
| `icon` | `ReactNode?` | Left icon (e.g. AlertTriangle for Urgent Blockers) |
| `rightLabel` | `string?` | Text on the right side (e.g. "View All") |
| `meta` | `ReactNode?` | Chips/badges between label and the rule line |
| `className` | `string?` | Override margin (default `mb-5`) |

**Used in:** Dashboard (3×)

---

### `ColoredIconBox.tsx`
A square box with a tinted background and icon, used everywhere an icon needs a colored container.

**Props:**
| Prop | Default | Description |
|---|---|---|
| `icon` | required | Lucide icon node |
| `color` | required | Hex color — bg becomes `color + '18'` (10% opacity) |
| `size` | `24` | Width and height in px |
| `radius` | `'rounded-md'` | Tailwind border-radius class |

**Used in:** `BlockerCard`, `ActivityFeedItem` (and many inline uses elsewhere)

---

### `BlockerCard.tsx`
Card for the Urgent Blockers section. Shows severity, category, caterer, issue description, and an action link.

**Props:** `icon`, `severity` (`'critical' | 'warning'`), `caterer`, `category`, `issue`, `action`, `to`

Internal: derives accent color from severity (`#f87171` critical, `#fbbf24` warning). Top accent strip + hover-tinted action button.

**Used in:** Dashboard Urgent Blockers grid

---

### `ActivityFeedItem.tsx`
A single row in the Recent Updates activity feed. Left color strip indicates priority; shows caterer name, event type chip, priority badge, time, and action link.

**Props:** `icon`, `color`, `priorityLabel`, `caterer`, `eventType`, `detail`, `time`, `action`, `to`, `isLast`

`isLast` controls whether the bottom border renders (last item in the feed has none).

**Used in:** Dashboard Recent Updates feed

---

### `SelectFilter.tsx`
Styled `<select>` dropdown for filter bars. Active selection highlights the border in lime.

**Props:** `label` (placeholder), `value`, `options: { value, label }[]`, `onChange`

**Used in:** Caterers filter bar, (Validation Center, Document Vault — pending)

---

### `DropdownMenu.tsx`
Three-dot (`⋯`) contextual action menu with click-outside detection.

**Props:**
| Prop | Description |
|---|---|
| `open` | Controlled open state |
| `onToggle` | Called when trigger button is clicked |
| `onClose` | Called when user clicks outside |
| `actions` | `{ label, icon, color? }[]` — the menu items |
| `minWidth` | Dropdown min-width (default `'200px'`) |

Click-outside uses `useRef<HTMLDivElement>` + `document.addEventListener('mousedown', ...)` with cleanup on `useEffect` return.

Per-action `color` is optional — defaults to `var(--text-2)` for label and `var(--text-4)` for icon.

**Used in:** Caterers row actions, (Validation Center, Document Vault — pending)

---

### `FilterBar.tsx`
Wrapper card for all filter UI. Renders the `<Filter>` icon, wraps `children` (search input + SelectFilters), and appends Apply/Reset buttons aligned to the right.

**Props:** `onApply`, `onReset`, `hasFilter: boolean`, `children: ReactNode`

The `flex-1 justify-end` + `minWidth: max-content` on the action group ensures Apply/Reset always stay right-aligned even when the filter row wraps to a second line on small screens.

**Used in:** Caterers, (Validation Center — pending)

---

## `src/shared/ui/` — Primitive UI Components

These are lower-level building blocks, mostly for decoration, feedback, and status display.

| File | What it does |
|---|---|
| `Badge.tsx` | Three-variant chip (accent / muted / active). Used for category labels. |
| `CircularProgress.tsx` | SVG circular progress ring. Used in ClientDashboard and SectionHeader to show completion %. |
| `ErrorBoundary.tsx` | React class component. Catches render errors, shows fallback + reload button. Wraps the entire app in `App.tsx`. |
| `FullPageLoader.tsx` | Centered spinner + label. Used as `<Suspense>` fallback during lazy route loading. |
| `InlineLoader.tsx` | Small rotating spinner. Used inside FullPageLoader and anywhere inline loading is needed. |
| `LangToggle.tsx` | Button that shows "FR" or "EN" and calls `setLang()` to switch. In both headers. |
| `NotificationBell.tsx` | Bell icon with a badge count. Shows "99+" if count > 99. Used in AdminHeader and ClientHeader. |
| `PageBadge.tsx` | Small chip at top of pages (lime text + icon). e.g. "EcoLunch Admin", "Validation Center". |
| `PlaceholderPage.tsx` | Full-page placeholder for unbuilt sections. Shows phase-2 badge + description. Used by contract-management, modules-pricing, golive-monitor, ecoloop features. |
| `SectionHeader.tsx` | Client-side section header with CircularProgress + status badge. Used at top of each client onboarding section (Profil, Banques, etc.). |
| `StatusBadge.tsx` | Colored dot + label badge. French status types: en-attente, correction, manquant, rejete, approuve. Used in older client route pages. |
| `StatusPill.tsx` | Flexible status pill. Accepts any color/bg/border/label — not tied to a fixed status type. Used in ClientDashboard and CentreDeValidation. |
| `ThemeToggle.tsx` | Sun/Moon button that calls `toggleTheme()`. In both headers. |

---

## `src/layouts/` — Shell Components

Layouts wrap all route pages. They render the fixed header, sidebar, and an `<Outlet>` where the active route renders.

### `admin/AdminLayout.tsx`
Controls the admin shell responsiveness.

- **Desktop (≥1024px):** Sidebar is fixed, 300px wide (68px when collapsed). Main content has `marginLeft: sidebarWidth` + `paddingLeft: 28px` gap.
- **Mobile (<1024px):** Sidebar becomes a slide-over drawer triggered by hamburger in header.
- Passes `collapsed`, `setCollapsed`, `drawerOpen`, `setDrawerOpen` to children via props.

### `admin/AdminHeader.tsx`
Fixed top bar (52px height). Contains:
- Left: logo + "EcoLunch · PRS · ONBOARDING" text
- Right (desktop): portal badge, notification bell, language toggle, theme toggle, link to client portal
- Right (mobile): hamburger menu button + condensed toggles

The 52px height is hardcoded in multiple places — `top-[52px]` in the detail drawer positioning, `marginTop: 52` in layout content offset.

### `admin/Sidebar.tsx`
Navigation sidebar for admin portal.
- **Desktop:** Fixed left panel, collapsible to icon-only mode (68px)
- **Mobile:** Full-width slide-over drawer
- Contains: Persona card (role/name), 8 nav items, Permissions panel
- Active route gets lime left border + tinted background via `NavLink`
- Sidebar width: `expanded = 300px`, `collapsed = 68px`

### `client/ClientLayout.tsx`, `ClientHeader.tsx`, `ClientSidebar.tsx`
Mirror of admin layout for the caterer-facing portal.
- Sidebar is 280px (not 300px)
- Header uses amber (`rgba(251,191,36,...)`) instead of lime for the portal badge
- ClientSidebar shows onboarding progress % and section completion status

---

## `src/routes/admin/` — Admin Page Components

These are the full-page components rendered inside `AdminLayout`. Each corresponds to one sidebar nav item.

### `Dashboard.tsx`
Main dashboard (`/admin/dashboard`).

**Sections:**
1. `PageHeader` with date widget
2. 4 stat cards (caterers, validations, tickets, go-live blocked)
3. `SectionDivider` + Quick Access grid (`FeatureCard` × 7)
4. `SectionDivider` + Recent Updates feed (`ActivityFeedItem` × 5 + View All footer)
5. `SectionDivider` + Urgent Blockers grid (`BlockerCard` × 5)

**Data is currently mock** — all data lives as `const` arrays at the top of the file. API integration point: replace `ALL_UPDATES`, `URGENT_BLOCKERS`, and `STATS` with fetched data.

---

### `CentreDeValidation.tsx`
Older validation center page (`/admin/validation-center` was previously routed here before the feature version was built).

Contains a tab-based interface with `ValidationRow` type and `StatusPill` components. Currently superseded by `features/onboarding/validation-center/index.tsx` for the main route.

---

### `CentreImport.tsx`
Smart Import center — 13 import types (profil-traiteur, banques, écoles, etc.) each with status (`pret` / `draft`), template download, and mapping view. Re-exported as `ClientSmartImport` for the client portal route.

---

### `OnboardingTraiteurs.tsx`
Older traiteurs management page (different from the feature version at `features/onboarding/caterers`). Contains `TraiteurStatus`, `Vertical`, `ReadinessTag` types and full table UI.

---

### `OnboardingDirections.tsx`, `OnboardingCSS.tsx`, `OnboardingEcoles.tsx`
Placeholder pages for onboarding sub-sections (Directions, CSS, Écoles). Each renders `<PlaceholderPage>` with appropriate icon and breadcrumb.

---

### `EcoLoop.tsx`
EcoLoop ticket system for admin. Full ticket list with status tabs (Open, Waiting Caterer, etc.), priority indicators, and ticket creation modal.

---

### `ModulesConfig.tsx`
Modules configuration page. Shows all 6 module categories (Finance, Accounting, Operations, Communication, Parents, Analytics), each with enabled/disabled/configured status and go-live dependency flag.

---

## `src/routes/client/` — Client Page Components

Caterer-facing portal pages. Each maps to one step in the onboarding flow.

| File | Route | Purpose |
|---|---|---|
| `ClientDashboard.tsx` | `/client/client-dashboard` | Progress overview, section list with % completion |
| `ClientProfil.tsx` | `/client/profil` | Legal info, address, contact fields |
| `ClientBanques.tsx` | `/client/banques` | Banking info + required bank documents |
| `ClientMesClients.tsx` | `/client/mes-clients` | Schools, daycares, camps, CSS tab management |
| `ClientMenus.tsx` | `/client/menus` | Menu cycles, packages by establishment type |
| `ClientSmartImport.tsx` | `/client/smart-import` | Re-exports `CentreImport` — same component, different context |
| `DocumentVault.tsx` | `/client/document-vault` | Caterer's own document storage, upload, status |
| `EcoLoop.tsx` | `/client/ecoloop` | Support ticket thread for this caterer |

---

## `src/features/` — Feature Modules

Features contain full-page implementations that are more complex than a simple route component. They are imported by `App.tsx` as lazy-loaded route components.

### `features/dashboard/components/`

**`StatCard.tsx`**
Large number stat card with glow hover effect. Props: `label`, `value`, `icon?`, `valueColor` (`lime | blue | red | amber`), `trend?`. Used on the admin Dashboard.

**`FeatureCard.tsx`**
Navigation card for Quick Access section. Shows icon, title, description, and "Ouvrir" action with arrow. Renders as `<Link>` when `to` prop is provided. Hover shows radial glow. Used on Dashboard.

---

### `features/onboarding/caterers/index.tsx`
**Route:** `/admin/caterers`

Full enterprise table for managing caterers in the onboarding pipeline.

**Key elements:**
- 4 stat cards (total, in-progress, needs review, ready for go-live)
- `FilterBar` with search + 3 `SelectFilter` dropdowns (status, vertical, admin)
- Table: 10 columns, `minWidth: 1120px`, sticky header, row hover
- Each row: caterer name, city, verticals (chips), progress bar, `StatusPill`, validations count, tickets count, assigned admin, last update date, `DropdownMenu` (7 actions)
- Pagination: prev/next + page number pills + per-page selector
- `NewCatererModal`: form to create a new caterer onboarding

**Local components (page-specific, not in shared/):**
- `StatCard` — compact horizontal card variant
- `StatusPill` — dot + label badge tied to `Status` type
- `FormField` — simple labeled input for the modal
- `NewCatererModal` — full modal with verticals multi-select

---

### `features/onboarding/validation-center/index.tsx`
**Route:** `/admin/validation-center`

Queue-based validation workflow. Admins review, approve, reject, or request corrections on onboarding items submitted by caterers.

**Key elements:**
- 4 compact stat cards (pending, approved, corrections, critical)
- `FilterBar` with search + 5 `SelectFilter` dropdowns (type, status, priority, caterer, reviewer)
- Table: 7 columns, click on item title or View button opens detail drawer
- `DetailDrawer` (right-side panel): slides in from right (`translateX`), shows all item details, notes textarea, history timeline, Approve/Correction/Reject buttons

**Local components:**
- `StatusBadge`, `PriorityBadge`, `TypeBadge` — tied to local status/priority/type enums
- `StatCard` — compact horizontal variant
- `SelectFilter` — (candidate to replace with shared version)
- `RowMenu` — (candidate to replace with shared `DropdownMenu`)
- `DetailDrawer` — complex drawer, page-specific for now

---

### `features/onboarding/document-vault/index.tsx`
**Route:** `/admin/document-vault`

Three-level navigation: Caterer list → Category grid → Document table.

**Navigation levels:**
1. **Level 1** — Grid of 6 caterer vault cards (all docs, pending, corrections stats)
2. **Level 2** — Left: caterer list panel (280px). Right: 11 category cards
3. **Level 3** — Same left panel. Right: document table (8 docs, 7 columns)

**Local components:**
- `StatusBadge` — doc status (approved, pending, rejected, correction)
- `StatCard` — compact horizontal variant
- `SelectFilter` — (candidate to replace with shared version)
- `DocRowMenu` — 12-action menu (candidate to replace with shared `DropdownMenu`)
- `CatererSidePanel`, `CatererVaultGrid`, `CategoryGrid`, `DocumentTable` — structural components

---

### `features/onboarding/` — Placeholder Features

These modules are defined but not yet implemented. Each exports a component that renders `<PlaceholderPage>`.

| Module | Route | Status |
|---|---|---|
| `contract-management/index.tsx` | `/admin/contract-management` | Placeholder |
| `modules-pricing/index.tsx` | `/admin/modules-pricing` | Placeholder |
| `golive-monitor/index.tsx` | `/admin/golive-monitor` | Placeholder |
| `ecoloop/index.tsx` | `/admin/ecoloop` | Placeholder |
| `dashboard/index.tsx` | (internal) | Placeholder |

---

## Architecture Patterns

### 1. CSS Design Tokens — Never Hardcode Surfaces
All backgrounds, text colors, and borders use `var(--bg-*)`, `var(--text-*)`, `var(--border-*)`. Accent colors (`#a3e635`, `#60a5fa`, etc.) are hardcoded as hex only when they're fixed semantic values (success = lime, info = blue, etc.) not theme-switchable.

### 2. i18n Type Safety
`fr.ts` defines the shape. `en.ts` satisfies it. Add keys to `fr.ts` first or TypeScript errors appear in `en.ts`. This prevents untranslated strings silently slipping through.

### 3. Filter Snapshot Pattern
All filter pages maintain two states:
- **Draft state** (`search`, `statusFilter`, etc.) — updates on every keystroke/selection
- **Applied state** (`applied`) — only updates when "Apply Filters" is clicked

The table filters against `applied`, not the draft state. This prevents the table jumping on every character typed in the search box.

### 4. Click-Outside Menu Pattern
Every `DropdownMenu` and any open menu uses:
```ts
const ref = useRef<HTMLDivElement>(null)
useEffect(() => {
  if (!open) return
  function handle(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) onClose()
  }
  document.addEventListener('mousedown', handle)
  return () => document.removeEventListener('mousedown', handle)
}, [open, onClose])
```
The cleanup function prevents memory leaks. The `if (!open) return` early-exit avoids attaching the listener when the menu is closed.

### 5. Right-Side Detail Drawer
The `DetailDrawer` in Validation Center positions at `fixed right-0 top-[52px] bottom-0` (below the 52px header) and uses `translateX(0)` / `translateX(100%)` CSS transitions. The `52px` is tied to `AdminHeader` height — if the header height ever changes, this value must be updated too.

### 6. Lazy Route Loading
Every page component in `App.tsx` is wrapped in `React.lazy()`. This means:
- Initial bundle is small (only the shell loads)
- Each page JS chunk downloads on first visit
- `FullPageLoader` shows during the transition
- TypeScript still type-checks lazy components

### 7. Shared Components vs. Shared UI
- **`shared/ui/`** — Primitive, generic components (Badge, CircularProgress, StatusPill). No domain knowledge. Could be used in any app.
- **`shared/components/`** — Domain components for this app (PageHeader, FilterBar, BlockerCard, ActivityFeedItem). They know about design tokens and EcoLunch-specific patterns but are reusable across multiple admin pages.

---

## Current Reusability Status

| Component | Currently used in | Pending migration |
|---|---|---|
| `PageHeader` | Dashboard, Caterers | Validation Center, Document Vault |
| `SelectFilter` | Caterers | Validation Center, Document Vault |
| `DropdownMenu` | Caterers | Validation Center, Document Vault |
| `FilterBar` | Caterers | Validation Center |
| `SectionDivider` | Dashboard | — |
| `BlockerCard` | Dashboard | — |
| `ActivityFeedItem` | Dashboard | — |
| `ColoredIconBox` | BlockerCard, ActivityFeedItem | — |

---

## Page Line Counts (Post-Refactor)

| File | Lines | Notes |
|---|---|---|
| `routes/admin/Dashboard.tsx` | 395 | Reduced from 551 |
| `features/onboarding/caterers/index.tsx` | 515 | Reduced from 580 |
| `features/onboarding/validation-center/index.tsx` | 640 | Pending refactor |
| `features/onboarding/document-vault/index.tsx` | 836 | Pending refactor |

---

## Key Relationships

```
App.tsx
  └── ThemeProvider (ThemeContext)
  └── LangProvider (LangContext)
  └── AdminLayout
        ├── AdminHeader (LangToggle, ThemeToggle, NotificationBell)
        ├── Sidebar (useIsDesktop)
        └── <Outlet> → admin route pages
              ├── Dashboard → shared/components: PageHeader, SectionDivider,
              │                ActivityFeedItem, BlockerCard
              │             features/dashboard: StatCard, FeatureCard
              ├── Caterers → shared/components: PageHeader, SelectFilter,
              │                DropdownMenu, FilterBar
              ├── ValidationCenter → local: StatusBadge, PriorityBadge,
              │                      TypeBadge, DetailDrawer
              └── DocumentVault → local: CatererSidePanel, CategoryGrid,
                                  DocumentTable
```

---

*Last updated: June 2026 — EcoLunch PRS Onboarding Admin Portal v1 build.*

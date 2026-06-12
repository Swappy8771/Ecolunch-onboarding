# EcoLunch PRS — Architecture Refactor Plan

> **Scope:** Folder structure, module boundaries, import paths, and backend-readiness.
> No business logic, UI, routes, translations, or styling are changed.

---

## 1. Proposed New Folder Structure

```
src/
│
├── app/
│   └── App.tsx                          ← router + providers (no change)
│
├── api/
│   ├── http.ts                          ← fetch wrapper (no change)
│   └── cache.ts                         ← TTL cache (no change)
│
├── layouts/
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminHeader.tsx
│   │   └── Sidebar.tsx
│   └── caterer/                         ← renamed from layouts/client/
│       ├── CatererLayout.tsx
│       ├── CatererHeader.tsx
│       └── CatererSidebar.tsx
│
├── routes/                              ← THIN FILES ONLY — just re-export a page
│   ├── admin/
│   │   ├── dashboard.tsx
│   │   ├── caterers.tsx
│   │   ├── validation-center.tsx
│   │   ├── document-vault.tsx
│   │   ├── contract-management.tsx
│   │   ├── modules-pricing.tsx
│   │   ├── golive-monitor.tsx
│   │   ├── ecoloop.tsx
│   │   └── smart-import.tsx
│   └── caterer/
│       ├── dashboard.tsx
│       ├── profile.tsx
│       ├── banking.tsx
│       ├── establishments.tsx
│       ├── menus.tsx
│       ├── document-vault.tsx
│       ├── contracts.tsx
│       ├── modules.tsx
│       ├── corrections.tsx
│       ├── golive.tsx
│       ├── ecoloop.tsx
│       └── smart-import.tsx
│
├── admin/                               ← ALL admin portal business code
│   ├── dashboard/
│   │   ├── pages/
│   │   │   └── AdminDashboardPage.tsx   ← was routes/admin/Dashboard.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx             ← was features/dashboard/components/StatCard.tsx
│   │   │   └── FeatureCard.tsx          ← was features/dashboard/components/FeatureCard.tsx
│   │   ├── hooks/                       ← future: useDashboardStats.ts
│   │   ├── services/                    ← future: dashboardService.ts
│   │   └── types/                       ← future: dashboard.types.ts
│   │
│   ├── caterers/
│   │   ├── pages/
│   │   │   └── AdminCaterersPage.tsx    ← was features/onboarding/caterers/index.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx             ← extracted from inline local component
│   │   │   ├── StatusPill.tsx           ← extracted from inline local component
│   │   │   ├── FormField.tsx            ← extracted from inline local component
│   │   │   └── NewCatererModal.tsx      ← extracted from inline local component
│   │   ├── hooks/                       ← future: useCaterers.ts, useCatererFilters.ts
│   │   ├── services/                    ← future: caterersService.ts
│   │   └── types/
│   │       └── caterers.types.ts        ← future: Status, Vertical, CatererRow
│   │
│   ├── validation-center/
│   │   ├── pages/
│   │   │   └── AdminValidationCenterPage.tsx   ← was features/onboarding/validation-center/index.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatusBadge.tsx          ← extracted from inline (validation-specific statuses)
│   │   │   ├── PriorityBadge.tsx        ← extracted from inline
│   │   │   ├── TypeBadge.tsx            ← extracted from inline
│   │   │   └── DetailDrawer.tsx         ← extracted from inline (complex, page-specific)
│   │   ├── hooks/                       ← future: useValidationQueue.ts
│   │   ├── services/                    ← future: validationService.ts
│   │   └── types/
│   │       └── validation.types.ts      ← future: ValidationItem, ValidationStatus
│   │
│   ├── document-vault/
│   │   ├── pages/
│   │   │   └── AdminDocumentVaultPage.tsx      ← was features/onboarding/document-vault/index.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatusBadge.tsx          ← doc-specific statuses (different from validation)
│   │   │   ├── CatererSidePanel.tsx     ← extracted from inline
│   │   │   ├── CatererVaultGrid.tsx     ← extracted from inline
│   │   │   ├── CategoryGrid.tsx         ← extracted from inline
│   │   │   └── DocumentTable.tsx        ← extracted from inline
│   │   ├── hooks/                       ← future: useDocumentVault.ts
│   │   ├── services/                    ← future: documentVaultService.ts
│   │   └── types/
│   │       └── document-vault.types.ts  ← future: Document, DocStatus, DocCategory
│   │
│   ├── contract-management/
│   │   ├── pages/
│   │   │   └── AdminContractManagementPage.tsx  ← was features/onboarding/contract-management/index.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── modules-pricing/
│   │   ├── pages/
│   │   │   ├── AdminModulesPricingPage.tsx      ← was features/onboarding/modules-pricing/index.tsx
│   │   │   └── AdminModulesConfigPage.tsx       ← was routes/admin/ModulesConfig.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── golive-monitor/
│   │   ├── pages/
│   │   │   └── AdminGolivePage.tsx              ← was features/onboarding/golive-monitor/index.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── ecoloop/
│   │   ├── pages/
│   │   │   └── AdminEcoloopPage.tsx             ← was routes/admin/EcoLoop.tsx (full impl)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── onboarding-sub/                  ← groups Directions, CSS, Écoles sub-pages
│   │   ├── pages/
│   │   │   ├── DirectionsPage.tsx       ← was routes/admin/OnboardingDirections.tsx
│   │   │   ├── CSSPage.tsx              ← was routes/admin/OnboardingCSS.tsx
│   │   │   └── EcolesPage.tsx           ← was routes/admin/OnboardingEcoles.tsx
│   │   ├── components/
│   │   └── types/
│   │
│   ├── components/                      ← admin-only shared components (used by 2+ admin sections)
│   ├── hooks/                           ← admin-only hooks (e.g. useAdminPermissions)
│   ├── services/                        ← admin-only services (e.g. adminAuthService)
│   └── types/
│       └── admin.types.ts               ← admin-wide enums, base interfaces
│
├── caterer/                             ← ALL caterer portal business code
│   ├── dashboard/
│   │   ├── pages/
│   │   │   └── CatererDashboardPage.tsx ← was routes/client/ClientDashboard.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── profile/
│   │   ├── pages/
│   │   │   └── CatererProfilePage.tsx   ← was routes/client/ClientProfil.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── banking/
│   │   ├── pages/
│   │   │   └── CatererBankingPage.tsx   ← was routes/client/ClientBanques.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── establishments/
│   │   ├── pages/
│   │   │   └── CatererEstablishmentsPage.tsx  ← was routes/client/ClientMesClients.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── menus/
│   │   ├── pages/
│   │   │   └── CatererMenusPage.tsx     ← was routes/client/ClientMenus.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── document-vault/
│   │   ├── pages/
│   │   │   └── CatererDocumentVaultPage.tsx  ← was routes/client/DocumentVault.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── ecoloop/
│   │   ├── pages/
│   │   │   └── CatererEcoloopPage.tsx   ← was routes/client/EcoLoop.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── contracts/                       ← future caterer contracts section
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── modules/                         ← future caterer modules setup
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── corrections/                     ← future corrections/follow-up
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── golive/                          ← future caterer go-live section
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── components/                      ← caterer-only shared components
│   ├── hooks/
│   ├── services/
│   └── types/
│       └── caterer.types.ts
│
├── core/                                ← platform engines — no portal UI dependency
│   ├── smart-import/
│   │   ├── SmartImportEngine.tsx        ← was routes/admin/CentreImport.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── documents/                       ← future: document handling logic
│   ├── contracts/                       ← future: contract lifecycle engine
│   ├── dropbox/                         ← future: Dropbox file integration
│   ├── dropbox-sign/                    ← future: e-signature integration
│   ├── audit/                           ← future: audit log engine
│   ├── permissions/                     ← future: role/permission checks
│   └── notifications/                  ← future: notification dispatch
│
├── shared/
│   ├── ui/                              ← primitive display-only components (no change)
│   │   ├── Badge.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FullPageLoader.tsx
│   │   ├── InlineLoader.tsx
│   │   ├── LangToggle.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── PageBadge.tsx
│   │   ├── PlaceholderPage.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── StatusPill.tsx
│   │   └── ThemeToggle.tsx
│   ├── components/                      ← domain components used by both portals (no change)
│   │   ├── ActivityFeedItem.tsx
│   │   ├── BlockerCard.tsx
│   │   ├── ColoredIconBox.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── FilterBar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SectionDivider.tsx
│   │   └── SelectFilter.tsx
│   ├── context/                         ← global React contexts
│   │   ├── LangContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   └── useIsDesktop.ts
│   ├── i18n/
│   │   ├── fr.ts
│   │   └── en.ts
│   ├── utils/                           ← future: formatDate, formatStatus, etc.
│   ├── constants/                       ← future: STATUS_COLORS, PRIORITY_META, etc.
│   └── types/                           ← future: cross-portal base types
│
└── assets/                              ← future: images, logos, icons
```

---

## 2. File Mapping Table

### Infrastructure (no change)

| Current location | New location | Notes |
|---|---|---|
| `src/app/App.tsx` | `src/app/App.tsx` | Update lazy import paths only |
| `src/api/http.ts` | `src/api/http.ts` | No change |
| `src/api/cache.ts` | `src/api/cache.ts` | No change |
| `src/index.css` | `src/index.css` | No change |
| `src/main.tsx` | `src/main.tsx` | No change |

### Layouts

| Current location | New location | Notes |
|---|---|---|
| `src/layouts/admin/AdminLayout.tsx` | `src/layouts/admin/AdminLayout.tsx` | No change |
| `src/layouts/admin/AdminHeader.tsx` | `src/layouts/admin/AdminHeader.tsx` | No change |
| `src/layouts/admin/Sidebar.tsx` | `src/layouts/admin/Sidebar.tsx` | No change |
| `src/layouts/client/ClientLayout.tsx` | `src/layouts/caterer/CatererLayout.tsx` | Rename: `client` → `caterer` |
| `src/layouts/client/ClientHeader.tsx` | `src/layouts/caterer/CatererHeader.tsx` | Rename |
| `src/layouts/client/ClientSidebar.tsx` | `src/layouts/caterer/CatererSidebar.tsx` | Rename |

### Admin Portal Pages

| Current location | New location | Notes |
|---|---|---|
| `src/routes/admin/Dashboard.tsx` | `src/admin/dashboard/pages/AdminDashboardPage.tsx` | Full page → feature folder |
| `src/features/dashboard/components/StatCard.tsx` | `src/admin/dashboard/components/StatCard.tsx` | Admin-only component |
| `src/features/dashboard/components/FeatureCard.tsx` | `src/admin/dashboard/components/FeatureCard.tsx` | Admin-only component |
| `src/features/onboarding/caterers/index.tsx` | `src/admin/caterers/pages/AdminCaterersPage.tsx` | Rename: `index` → page name |
| `src/features/onboarding/validation-center/index.tsx` | `src/admin/validation-center/pages/AdminValidationCenterPage.tsx` | |
| `src/features/onboarding/document-vault/index.tsx` | `src/admin/document-vault/pages/AdminDocumentVaultPage.tsx` | |
| `src/features/onboarding/contract-management/index.tsx` | `src/admin/contract-management/pages/AdminContractManagementPage.tsx` | |
| `src/features/onboarding/modules-pricing/index.tsx` | `src/admin/modules-pricing/pages/AdminModulesPricingPage.tsx` | |
| `src/features/onboarding/golive-monitor/index.tsx` | `src/admin/golive-monitor/pages/AdminGolivePage.tsx` | |
| `src/features/onboarding/ecoloop/index.tsx` | **DELETE** | Placeholder superseded by real impl below |
| `src/features/onboarding/dashboard/index.tsx` | **DELETE** | Placeholder superseded by real impl below |
| `src/routes/admin/EcoLoop.tsx` | `src/admin/ecoloop/pages/AdminEcoloopPage.tsx` | Full implementation |
| `src/routes/admin/ModulesConfig.tsx` | `src/admin/modules-pricing/pages/AdminModulesConfigPage.tsx` | Groups with modules-pricing |
| `src/routes/admin/CentreDeValidation.tsx` | `src/admin/validation-center/pages/AdminValidationCenterLegacyPage.tsx` | Legacy — see §8 |
| `src/routes/admin/OnboardingTraiteurs.tsx` | `src/admin/caterers/pages/AdminCaterersLegacyPage.tsx` | Legacy — see §8 |
| `src/routes/admin/OnboardingDirections.tsx` | `src/admin/onboarding-sub/pages/DirectionsPage.tsx` | |
| `src/routes/admin/OnboardingCSS.tsx` | `src/admin/onboarding-sub/pages/CSSPage.tsx` | |
| `src/routes/admin/OnboardingEcoles.tsx` | `src/admin/onboarding-sub/pages/EcolesPage.tsx` | |

### Core Engine

| Current location | New location | Notes |
|---|---|---|
| `src/routes/admin/CentreImport.tsx` | `src/core/smart-import/SmartImportEngine.tsx` | Portal-independent engine |
| `src/routes/client/ClientSmartImport.tsx` | `src/caterer/smart-import/pages/CatererSmartImportPage.tsx` | Thin wrapper calling the engine |

### Caterer Portal Pages

| Current location | New location | Notes |
|---|---|---|
| `src/routes/client/ClientDashboard.tsx` | `src/caterer/dashboard/pages/CatererDashboardPage.tsx` | |
| `src/routes/client/ClientProfil.tsx` | `src/caterer/profile/pages/CatererProfilePage.tsx` | |
| `src/routes/client/ClientBanques.tsx` | `src/caterer/banking/pages/CatererBankingPage.tsx` | |
| `src/routes/client/ClientMesClients.tsx` | `src/caterer/establishments/pages/CatererEstablishmentsPage.tsx` | |
| `src/routes/client/ClientMenus.tsx` | `src/caterer/menus/pages/CatererMenusPage.tsx` | |
| `src/routes/client/DocumentVault.tsx` | `src/caterer/document-vault/pages/CatererDocumentVaultPage.tsx` | |
| `src/routes/client/EcoLoop.tsx` | `src/caterer/ecoloop/pages/CatererEcoloopPage.tsx` | |

### Shared — No Location Change

| Location | Status |
|---|---|
| `src/shared/components/*` | No change |
| `src/shared/ui/*` | No change |
| `src/shared/context/*` | No change |
| `src/shared/hooks/*` | No change |
| `src/shared/i18n/*` | No change |

---

## 3. Shared Component Candidates

These components live in `src/shared/` and are used (or should be used) by both portals.

### Currently in `shared/components/` — Correctly placed

| Component | Used by admin | Used by caterer | Notes |
|---|---|---|---|
| `PageHeader` | Dashboard, Caterers, (VC, DV pending) | Future caterer pages | Keep here |
| `FilterBar` | Caterers, (VC pending) | Future caterer filters | Keep here |
| `SelectFilter` | Caterers, (VC, DV pending) | Future caterer filters | Keep here |
| `DropdownMenu` | Caterers, (VC, DV pending) | Future caterer menus | Keep here |
| `SectionDivider` | Dashboard | Future caterer sections | Keep here |
| `ColoredIconBox` | BlockerCard, ActivityFeedItem | Future caterer use | Keep here |
| `BlockerCard` | Dashboard | — | Admin-only in practice; could move to `admin/dashboard/components/` if caterer never uses it |
| `ActivityFeedItem` | Dashboard | — | Same as BlockerCard |

### Currently in `shared/ui/` — Correctly placed

| Component | Notes |
|---|---|
| `Badge`, `StatusPill`, `CircularProgress` | Generic — stay in shared/ui |
| `PageBadge` | Generic chip — stay in shared/ui |
| `PlaceholderPage` | Used by all placeholder features — stay in shared/ui |
| `SectionHeader` | Used by caterer section pages — stay in shared/ui |
| `LangToggle`, `ThemeToggle`, `NotificationBell` | Used by both headers — stay in shared/ui |
| `ErrorBoundary`, `FullPageLoader`, `InlineLoader` | App-level — stay in shared/ui |
| `StatusBadge` | **Problem** — see §8 |

### Candidates to promote to `shared/components/`

| Current location | Candidate | Reason |
|---|---|---|
| Inline in caterers, VC, DV | `StatCard` | Each section defines its own identical horizontal stat card |
| `shared/ui/StatusBadge.tsx` | `StatusBadge` | Currently a French-status-only generic; needs to evolve into a typed variant system |

---

## 4. Core Engine Candidates

These modules contain logic that belongs to neither portal and will have their own backend API domain.

| Engine | Current home | Target: `core/` | Reason it belongs in core |
|---|---|---|---|
| **Smart Import** | `routes/admin/CentreImport.tsx` (re-exported as `ClientSmartImport`) | `core/smart-import/` | Both portals use it. Import mapping, template logic, and status are portal-independent |
| **Document Services** | Scattered inside `admin/document-vault` and `caterer/document-vault` | `core/documents/` | Upload, retrieve, categorize — same API domain for both portals |
| **Contract Engine** | Placeholder in `contract-management` (admin) and `contracts` (caterer) | `core/contracts/` | Contract lifecycle, signing state, version — single backend domain |
| **Dropbox Integration** | Not yet built | `core/dropbox/` | File storage layer shared by documents + smart import |
| **Dropbox Sign** | Not yet built | `core/dropbox-sign/` | e-signature service shared by contracts in both portals |
| **Audit Log** | Not yet built | `core/audit/` | Any action in either portal that must be logged |
| **Permissions** | Not yet built | `core/permissions/` | Role/scope checks shared across both portals |
| **Notifications** | Not yet built | `core/notifications/` | Notification dispatch shared across both portals |

**Core dependency rule:** `core/*` modules must never import from `admin/*` or `caterer/*`. They may import from `shared/*` and `api/*` only.

---

## 5. Admin-Specific Modules

Everything under `src/admin/`. None of this is accessible to the caterer portal.

| Module | Contains | Future API domain |
|---|---|---|
| `admin/dashboard` | Stats, blockers, activity feed, quick access | `/api/admin/dashboard/stats`, `/api/admin/activity` |
| `admin/caterers` | Caterer table, filters, statuses, new caterer modal | `/api/admin/caterers` |
| `admin/validation-center` | Validation queue, detail drawer, approve/reject | `/api/admin/validations` |
| `admin/document-vault` | Multi-level vault navigation per caterer | `/api/admin/documents` (proxies core) |
| `admin/contract-management` | Admin contract views, send for signature | `/api/admin/contracts` (proxies core) |
| `admin/modules-pricing` | Module config, pricing tables, go-live dependency | `/api/admin/modules`, `/api/admin/pricing` |
| `admin/golive-monitor` | Go-live blockers, readiness per caterer | `/api/admin/golive` |
| `admin/ecoloop` | Ticket list, status tabs, admin ticket creation | `/api/admin/ecoloop` |
| `admin/onboarding-sub` | Directions, CSS, Écoles sub-pages | `/api/admin/onboarding-sub` |
| `admin/components` | `StatCard` shared across admin sections | Admin-only; never exposed to caterer |
| `admin/types` | Admin enums: `Status`, `Priority`, `Vertical`, etc. | Match backend DTO enums |
| `admin/services` | Future: `adminAuthService`, `adminSessionService` | |

---

## 6. Caterer-Specific Modules

Everything under `src/caterer/`. None of this is accessible to the admin portal.

| Module | Contains | Future API domain |
|---|---|---|
| `caterer/dashboard` | Progress overview, section completion list | `/api/caterer/dashboard` |
| `caterer/profile` | Legal info, address, contact fields | `/api/caterer/profile` |
| `caterer/banking` | Bank info, required documents | `/api/caterer/banking` |
| `caterer/establishments` | Schools, daycares, camps, CSS tabs | `/api/caterer/establishments` |
| `caterer/menus` | Menu cycles, packages per establishment type | `/api/caterer/menus` |
| `caterer/document-vault` | Caterer uploads their own documents | `/api/caterer/documents` (proxies core) |
| `caterer/ecoloop` | Support thread for this caterer | `/api/caterer/ecoloop` |
| `caterer/smart-import` | Thin page wrapping `core/smart-import` engine | Uses core engine |
| `caterer/contracts` | View + sign contracts (future) | `/api/caterer/contracts` (proxies core) |
| `caterer/modules` | View required module setup (future) | `/api/caterer/modules` |
| `caterer/corrections` | View + respond to corrections (future) | `/api/caterer/corrections` |
| `caterer/golive` | Caterer go-live status view (future) | `/api/caterer/golive` |
| `caterer/types` | Caterer enums: section statuses, progress states | Match backend DTO enums |

---

## 7. Migration Plan

Migration is structured in 5 phases. Each phase is independently deployable — the app continues to work after each step.

---

### Phase 0 — Set Up Path Aliases (do first)

**Why:** The current structure has no `@/` aliases. As depth increases from `routes/admin/Dashboard.tsx` to `admin/dashboard/pages/AdminDashboardPage.tsx`, relative imports like `../../../../shared/components/PageHeader` become unmanageable. Set up aliases before moving any files so every new import uses the alias.

**Changes to `vite.config.ts`:**
```ts
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@caterer': path.resolve(__dirname, './src/caterer'),
      '@core': path.resolve(__dirname, './src/core'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
    },
  },
})
```

**Changes to `tsconfig.app.json` — add `paths` inside `compilerOptions`:**
```json
"paths": {
  "@/*":        ["./src/*"],
  "@admin/*":   ["./src/admin/*"],
  "@caterer/*": ["./src/caterer/*"],
  "@core/*":    ["./src/core/*"],
  "@shared/*":  ["./src/shared/*"],
  "@layouts/*": ["./src/layouts/*"]
}
```

**Effort:** ~30 minutes. Zero functional change.

---

### Phase 1 — Rename Layouts

Rename the caterer layout folder and files from `client` to `caterer`.

| Action | Detail |
|---|---|
| Move | `layouts/client/ClientLayout.tsx` → `layouts/caterer/CatererLayout.tsx` |
| Move | `layouts/client/ClientHeader.tsx` → `layouts/caterer/CatererHeader.tsx` |
| Move | `layouts/client/ClientSidebar.tsx` → `layouts/caterer/CatererSidebar.tsx` |
| Update | `App.tsx` import for `ClientLayout` → `CatererLayout` |

This is pure rename — no logic change. Internal component names (`ClientLayout` export name) can be renamed in the same commit or kept temporarily for compatibility.

**Effort:** ~20 minutes. Zero functional change.

---

### Phase 2 — Extract Core Engine

Extract `CentreImport.tsx` into `core/smart-import/`. This is the highest-priority extraction because it is currently the only file that is depended on by both portals.

| Action | Detail |
|---|---|
| Create | `src/core/smart-import/SmartImportEngine.tsx` — copy content from `CentreImport.tsx` |
| Verify | All imports inside the file are relative or point to `shared/` only (no admin or client-specific imports) |
| Update | `routes/admin/CentreImport.tsx` → thin re-export: `export { SmartImportEngine as default } from '@core/smart-import/SmartImportEngine'` |
| Update | `routes/client/ClientSmartImport.tsx` → thin wrapper page calling `SmartImportEngine` |
| Delete | `routes/admin/CentreImport.tsx` original file after re-export is stable |

**Effort:** ~1 hour. Zero functional change.

---

### Phase 3 — Move Admin Pages (section by section)

Move each admin section in order of complexity (simplest first). Verify `npx tsc --noEmit` passes after each section.

**Order:**

1. `admin/dashboard` — move `Dashboard.tsx` + `features/dashboard/components/`
2. `admin/caterers` — move `features/onboarding/caterers/index.tsx`, extract inline components
3. `admin/validation-center` — move `features/onboarding/validation-center/index.tsx`, extract `StatusBadge`, `PriorityBadge`, `TypeBadge`, `DetailDrawer`
4. `admin/document-vault` — move `features/onboarding/document-vault/index.tsx`, extract inline components
5. `admin/ecoloop` — move `routes/admin/EcoLoop.tsx`; delete placeholder `features/onboarding/ecoloop/index.tsx`
6. `admin/modules-pricing` — move `routes/admin/ModulesConfig.tsx` + placeholder
7. `admin/contract-management`, `admin/golive-monitor` — move placeholders
8. `admin/onboarding-sub` — move Directions, CSS, Écoles

**For each section:**
```
1. Create admin/<section>/pages/<PageName>.tsx — copy content
2. Create admin/<section>/components/ — extract any inline sub-components
3. Create admin/<section>/hooks/   (empty, for future use)
4. Create admin/<section>/services/ (empty, for future use)
5. Create admin/<section>/types/   (empty, for future use)
6. Update routes/admin/<section>.tsx → thin re-export only
7. Run: npx tsc --noEmit
8. Delete old file
```

**Thin route file pattern:**
```tsx
// src/routes/admin/document-vault.tsx
export { AdminDocumentVaultPage as default } from '@admin/document-vault/pages/AdminDocumentVaultPage'
```

**Effort per section:** 30–90 minutes. Total: ~1 day.

---

### Phase 4 — Move Caterer Pages (section by section)

Same approach as Phase 3 for caterer portal.

**Order:**

1. `caterer/dashboard` — move `ClientDashboard.tsx`
2. `caterer/profile` — move `ClientProfil.tsx`
3. `caterer/banking` — move `ClientBanques.tsx`
4. `caterer/establishments` — move `ClientMesClients.tsx`
5. `caterer/menus` — move `ClientMenus.tsx`
6. `caterer/document-vault` — move `routes/client/DocumentVault.tsx`
7. `caterer/ecoloop` — move `routes/client/EcoLoop.tsx`
8. `caterer/smart-import` — create thin page wrapping the core engine

**Effort:** ~4 hours total.

---

### Phase 5 — Consolidate Duplicates

After Phases 3–4, three problems become visible and easy to fix:

**5a. Consolidate the three `StatCard` variants**

Each of `admin/caterers`, `admin/validation-center`, and `admin/document-vault` will have a local `StatCard`. Compare them — they are likely identical or near-identical. Extract to `admin/components/StatCard.tsx`.

**5b. Consolidate `StatusBadge` variants**

There is `shared/ui/StatusBadge.tsx` (French statuses), plus local `StatusBadge` in validation-center and document-vault (different status sets). Fix: rename the shared one to `shared/ui/FrenchStatusBadge.tsx` for clarity, and give each feature its own typed `StatusBadge` in its `components/` folder with types defined in `types/`.

**5c. Delete legacy files**

| File | Reason to delete |
|---|---|
| `src/routes/admin/CentreDeValidation.tsx` | Superseded by `admin/validation-center`. Confirm no active route points to it. |
| `src/routes/admin/OnboardingTraiteurs.tsx` | Superseded by `admin/caterers`. Confirm no active route points to it. |
| `src/features/onboarding/ecoloop/index.tsx` | Placeholder superseded by `admin/ecoloop` real page |
| `src/features/onboarding/dashboard/index.tsx` | Placeholder superseded by `admin/dashboard` real page |

**Before deleting:** grep for all imports of the file. If nothing imports it and no route renders it, delete.

**Effort:** ~2 hours total.

---

### Phase 6 — Split i18n (optional, recommended before backend launch)

The current single-file approach (`fr.ts` / `en.ts`) does not scale when admin and caterer portals may have different translators, scopes, or loading strategies.

**Target structure:**
```
shared/i18n/
├── fr/
│   ├── admin.ts         ← keys: dashboard.*, traiteurs.*, centreValidation.*, documentVault.*, etc.
│   ├── caterer.ts       ← keys: profil.*, banques.*, mesClients.*, menus.*, etc.
│   └── shared.ts        ← keys: common.*, status.*, priority.*, header.*
└── en/
    ├── admin.ts
    ├── caterer.ts
    └── shared.ts
```

`LangContext.tsx` merges the three files by portal at runtime, or lazy-loads just the needed namespace.

This is a larger refactor. Do it as its own PR with only i18n changes — no UI changes.

---

## 8. Architectural Issues for Backend Integration

These are the existing issues that will create friction when real API calls are added.

---

### Issue 1 — No Path Aliases (Critical)

**Current state:** No `resolve.alias` in `vite.config.ts`, no `paths` in `tsconfig.app.json`.

**Impact:** After the refactor, a component in `admin/validation-center/pages/` importing from `shared/components/PageHeader` would require `../../../../shared/components/PageHeader`. One level deeper and it becomes `../../../../../shared/...`. This becomes unmaintainable immediately.

**Fix:** Phase 0 — add aliases before any files are moved. Covered in the migration plan above.

---

### Issue 2 — Mock Data Embedded in Page Components (Critical for API)

**Current state:** All data (`ALL_UPDATES`, `URGENT_BLOCKERS`, `CATERERS`, `VALIDATION_ITEMS`, etc.) is defined as `const` arrays at the top of page `.tsx` files.

**Impact:** When API calls are added, developers will either (a) put `fetch()` calls inside the same page component, making it untestable and bloated, or (b) need to extract data to a services layer anyway — but without a `services/` folder, there is no clear home.

**Fix:** The `services/` folder created in Phase 3/4 per feature is the hook point. Before backend integration, move the mock arrays out of page files and into `services/mockData.ts` per feature. When the real API is ready, replace `mockData.ts` with `featureService.ts` without touching the page component.

**Pattern to follow:**
```ts
// admin/caterers/services/caterersService.ts
export async function getCaterers(): Promise<CatererRow[]> {
  // Phase 3: return MOCK_CATERERS
  // Phase 4: return requestJson('/api/admin/caterers')
}
```

---

### Issue 3 — Domain Types Defined Inline in Page Files (High)

**Current state:** Types like `Status`, `Priority`, `Vertical`, `ValidationItem`, `DocumentRow` are defined as TypeScript types or string unions at the top of page `.tsx` files.

**Impact:** When services call the API and receive DTOs, the DTO types and the page types are in different files (or the same page file). Mapping between them produces duplicate type definitions or forced imports that couple services to page files (wrong direction).

**Fix:** In Phase 3/4, when extracting each feature, move type definitions to `admin/<feature>/types/<feature>.types.ts` first. Services and pages both import from `types/`. Services never import from `pages/`.

---

### Issue 4 — `StatusBadge` Has Three Different Implementations (Medium)

**Current state:**
- `shared/ui/StatusBadge.tsx` — French status labels (en-attente, approuve, etc.)
- `features/onboarding/validation-center/index.tsx` — local `StatusBadge` with validation-specific statuses
- `features/onboarding/document-vault/index.tsx` — local `StatusBadge` with document-specific statuses

**Impact:** When the backend returns a `status` string from an API, it's unclear which component to use. Three components drift independently. A backend status enum change requires 3 updates.

**Fix:** Each feature owns its own `StatusBadge` in `admin/<feature>/components/StatusBadge.tsx`, tied to that feature's `types/`. The shared `StatusBadge` in `shared/ui/` becomes a generic base (takes `color`, `label` as direct props, no status logic).

---

### Issue 5 — `CentreImport` is Shared via Re-Export, Not Extraction (Medium)

**Current state:** `routes/client/ClientSmartImport.tsx` just does:
```ts
export { default } from '../admin/CentreImport'
```
This means the admin route file is the source of truth for a caterer-facing feature.

**Impact:** When the Smart Import feature needs different API calls for admin vs caterer (admin sees all caterers, caterer sees only their own), the shared source file cannot diverge without forking it. The tight coupling also means changing the admin import flow changes the caterer import flow.

**Fix:** Phase 2 — extract to `core/smart-import/SmartImportEngine.tsx` which accepts `context: 'admin' | 'caterer'` as a prop (or two separate hooks `useAdminImport` / `useCatererImport`). Both portals use the engine but inject different data fetching logic.

---

### Issue 6 — Dual EcoLoop Implementations Coexist (Medium)

**Current state:**
- `routes/admin/EcoLoop.tsx` — full implementation (ticket list, status tabs, ticket creation modal)
- `features/onboarding/ecoloop/index.tsx` — placeholder rendering `<PlaceholderPage>`

Both exist. The app routes to the full implementation, but the placeholder is never deleted and never routes anywhere.

**Impact:** Confusion about source of truth. A developer looking at `features/onboarding/ecoloop/` assumes that is the active file.

**Fix:** Phase 5c — delete `features/onboarding/ecoloop/index.tsx` after confirming no route renders it. Move the real implementation to `admin/ecoloop/pages/AdminEcoloopPage.tsx`.

---

### Issue 7 — Three Duplicate `StatCard` Implementations (Low-Medium)

**Current state:** `caterers/index.tsx`, `validation-center/index.tsx`, and `document-vault/index.tsx` each define a local `StatCard` component inline that renders an icon + label + count in a horizontal card. They are visually identical or near-identical.

**Impact:** Styling divergence over time. When stats become API-driven, three places to wire up loading/error states.

**Fix:** Phase 5a — after pages are moved to their feature folders, compare the three `StatCard` definitions. Extract a shared `StatCard` to `admin/components/StatCard.tsx` used by all three admin sections.

---

### Issue 8 — `LangContext` i18n Is One Flat Object (Low, grows with scale)

**Current state:** All translation strings for both portals live in a single `fr.ts` / `en.ts` export. The `useLang()` hook returns the entire object.

**Impact:** As both portals grow, the translations file becomes a 500+ line object. When the caterer portal needs strings that don't exist yet (corrections, go-live, contracts), they go into the same file as admin strings. No lazy-loading by portal is possible.

**Fix:** Phase 6 — split into `admin.ts`, `caterer.ts`, `shared.ts` per language. Not urgent now but a prerequisite before internationalizing at scale or adding a translation management tool (Phrase, Lokalise).

---

### Issue 9 — No `services/` Layer Means API Logic Will Land in Pages (Critical for API)

**Current state:** There is no `services/` folder anywhere in the project. The `api/http.ts` exists but is called by nothing (no actual API calls yet).

**Impact:** When the first API endpoint is connected, without a services layer the natural place is inside the page component (`useEffect(() => { fetch(...) }, [])`). This creates untestable, unmaintainable pages and makes it impossible to share data-fetching logic between components on the same page.

**Fix:** Every feature folder created in Phase 3/4 includes an empty `services/` folder. The convention should be established before the first API call is made:
```
admin/caterers/services/
  caterersService.ts     ← API call functions
  caterers.queries.ts    ← React Query hooks (when added)
  caterers.mock.ts       ← mock data during development
```

---

## Summary Checklist

| Phase | Action | Effort | Risk |
|---|---|---|---|
| 0 | Add path aliases to vite.config.ts + tsconfig | 30 min | Low |
| 1 | Rename layouts/client → layouts/caterer | 20 min | Low |
| 2 | Extract SmartImport → core/smart-import | 1 hr | Medium |
| 3 | Move admin pages to admin/ feature folders | 1 day | Medium |
| 4 | Move caterer pages to caterer/ feature folders | 4 hr | Medium |
| 5 | Consolidate duplicates, delete legacy files | 2 hr | Low |
| 6 | Split i18n by portal namespace | 2 hr | Low |

Total estimated effort: **2–3 days** for a single developer, working incrementally with TypeScript checks after each step.

---

*Architecture analysis — EcoLunch PRS Onboarding Admin Portal, June 2026.*

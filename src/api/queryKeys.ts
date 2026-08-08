/**
 * Every React Query key used anywhere in the app is built from here —
 * no module should write a hardcoded key-array literal in a component or
 * hook. Grouped by backend module, mirroring `src/api/modules/`.
 *
 * Each leaf is a factory function returning a `readonly` tuple (`as
 * const`), so a mutation's `invalidateQueries({ queryKey: ... })` call
 * targets exactly the query it affects (per
 * `knowledge/03-frontend/phase-1-foundation/REACT_QUERY.md` — never a bare
 * `invalidateQueries()` with no key filter).
 */

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },

  catererAuth: {
    all: ['catererAuth'] as const,
    me: ['catererAuth', 'me'] as const,
  },

  catererBanking: {
    all: ['catererBanking'] as const,
    detail: ['catererBanking', 'detail'] as const,
    overview: ['catererBanking', 'overview'] as const,
  },

  catererProfile: {
    all: ['catererProfile'] as const,
    detail: ['catererProfile', 'detail'] as const,
    overview: ['catererProfile', 'overview'] as const,
  },

  catererEstablishments: {
    all: ['catererEstablishments'] as const,
    activeModules: ['catererEstablishments', 'active-modules'] as const,
    dashboard: ['catererEstablishments', 'dashboard'] as const,
    overview: (type?: string) => ['catererEstablishments', 'overview', type] as const,
    list: (filters?: Record<string, unknown>) => ['catererEstablishments', 'list', filters] as const,
    detail: (id: string) => ['catererEstablishments', 'detail', id] as const,
    closures: (id: string) => ['catererEstablishments', 'closures', id] as const,
  },

  catererMenus: {
    all: ['catererMenus'] as const,
    activeModules: ['catererMenus', 'active-modules'] as const,
    overview: (type?: string) => ['catererMenus', 'overview', type] as const,
    list: (filters?: Record<string, unknown>) => ['catererMenus', 'list', filters] as const,
    detail: (id: string) => ['catererMenus', 'detail', id] as const,
    dishes: ['catererMenus', 'dishes'] as const,
  },

  catererModulesRequiredSetup: {
    all: ['catererModulesRequiredSetup'] as const,
    overview: ['catererModulesRequiredSetup', 'overview'] as const,
    activeModules: ['catererModulesRequiredSetup', 'active-modules'] as const,
    progress: ['catererModulesRequiredSetup', 'progress'] as const,
    missingItems: (moduleKey?: string) => ['catererModulesRequiredSetup', 'missing-items', moduleKey] as const,
    detail: (moduleKey: string) => ['catererModulesRequiredSetup', 'detail', moduleKey] as const,
  },

  catererAccountingSettings: {
    all: ['catererAccountingSettings'] as const,
    detail: ['catererAccountingSettings', 'detail'] as const,
  },

  catererReportiqSettings: {
    all: ['catererReportiqSettings'] as const,
    detail: ['catererReportiqSettings', 'detail'] as const,
  },

  catererSchoolMealsSettings: {
    all: ['catererSchoolMealsSettings'] as const,
    detail: ['catererSchoolMealsSettings', 'detail'] as const,
  },

  catererDaycareMealsSettings: {
    all: ['catererDaycareMealsSettings'] as const,
    detail: ['catererDaycareMealsSettings', 'detail'] as const,
  },

  catererCampMealsSettings: {
    all: ['catererCampMealsSettings'] as const,
    detail: ['catererCampMealsSettings', 'detail'] as const,
  },

  catererDashboard: {
    all: ['catererDashboard'] as const,
    stats: ['catererDashboard', 'stats'] as const,
  },

  catererEcoloop: {
    all: ['catererEcoloop'] as const,
    list: ['catererEcoloop', 'list'] as const,
    detail: (conversationId: string) => ['catererEcoloop', 'detail', conversationId] as const,
  },

  catererGolive: {
    all: ['catererGolive'] as const,
    summary: ['catererGolive', 'summary'] as const,
    checklist: ['catererGolive', 'checklist'] as const,
  },

  catererDocumentVault: {
    all: ['catererDocumentVault'] as const,
    requirements: ['catererDocumentVault', 'requirements'] as const,
    groups: ['catererDocumentVault', 'groups'] as const,
    progress: ['catererDocumentVault', 'progress'] as const,
    documents: (filters?: Record<string, unknown>) => ['catererDocumentVault', 'documents', filters] as const,
    document: (docId: string) => ['catererDocumentVault', 'document', docId] as const,
  },

  catererCorrections: {
    all: ['catererCorrections'] as const,
    list: (filters?: Record<string, unknown>) => ['catererCorrections', 'list', filters] as const,
    summary: ['catererCorrections', 'summary'] as const,
    detail: (id: string) => ['catererCorrections', 'detail', id] as const,
    history: (id: string) => ['catererCorrections', 'history', id] as const,
  },

  catererContracts: {
    all: ['catererContracts'] as const,
    list: ['catererContracts', 'list'] as const,
    progress: ['catererContracts', 'progress'] as const,
    detail: (cid: string) => ['catererContracts', 'detail', cid] as const,
    document: (cid: string) => ['catererContracts', 'document', cid] as const,
  },

  caterers: {
    all: ['caterers'] as const,
    list: (filters?: Record<string, unknown>) => ['caterers', 'list', filters] as const,
    detail: (catererId: string) => ['caterers', 'detail', catererId] as const,
    overview: (catererId: string) => ['caterers', 'overview', catererId] as const,
  },

  banking: {
    all: ['banking'] as const,
    detail: (catererId: string) => ['banking', 'detail', catererId] as const,
    overview: (catererId: string) => ['banking', 'overview', catererId] as const,
  },

  establishments: {
    all: ['establishments'] as const,
    activeModules: (catererId: string) => ['establishments', 'active-modules', catererId] as const,
    list: (catererId: string, filters?: Record<string, unknown>) =>
      ['establishments', 'list', catererId, filters] as const,
    detail: (id: string) => ['establishments', 'detail', id] as const,
    dashboard: (catererId: string) => ['establishments', 'dashboard', catererId] as const,
    overview: (catererId: string, type?: string) => ['establishments', 'overview', catererId, type] as const,
  },

  menus: {
    all: ['menus'] as const,
    activeModules: (catererId: string) => ['menus', 'active-modules', catererId] as const,
    list: (catererId: string, filters?: Record<string, unknown>) => ['menus', 'list', catererId, filters] as const,
    detail: (id: string) => ['menus', 'detail', id] as const,
    overview: (catererId: string, type?: string) => ['menus', 'overview', catererId, type] as const,
    dishes: (catererId: string) => ['menus', 'dishes', catererId] as const,
  },

  documentVault: {
    all: ['documentVault'] as const,
    requirements: (catererId: string) => ['documentVault', 'requirements', catererId] as const,
    groups: (catererId: string) => ['documentVault', 'groups', catererId] as const,
    progress: (catererId: string) => ['documentVault', 'progress', catererId] as const,
    // The underlying Documents module's own vault (upload/version/review):
    vaultSummary: ['documentVault', 'vault-summary'] as const,
    categories: ['documentVault', 'categories'] as const,
    listForCaterer: (catererId: string, filters?: Record<string, unknown>) =>
      ['documentVault', 'list', catererId, filters] as const,
    detail: (docId: string) => ['documentVault', 'detail', docId] as const,
    history: (docId: string) => ['documentVault', 'history', docId] as const,
  },

  contracts: {
    all: ['contracts'] as const,
    templates: ['contracts', 'templates'] as const,
    list: (filters?: Record<string, unknown>) => ['contracts', 'list', filters] as const,
    byCaterer: (catererId: string) => ['contracts', 'by-caterer', catererId] as const,
    detail: (cid: string) => ['contracts', 'detail', cid] as const,
    history: (cid: string) => ['contracts', 'history', cid] as const,
    summary: (catererId: string) => ['contracts', 'summary', catererId] as const,
    document: (cid: string) => ['contracts', 'document', cid] as const,
  },

  modules: {
    all: ['modules'] as const,
    catalogue: ['modules', 'catalogue'] as const,
    setup: (catererId: string) => ['modules', 'setup', catererId] as const,
    summary: (catererId: string) => ['modules', 'summary', catererId] as const,
    pricing: (catererId: string, moduleKey: string) => ['modules', 'pricing', catererId, moduleKey] as const,
    configuration: (catererId: string, moduleKey: string) =>
      ['modules', 'configuration', catererId, moduleKey] as const,
    history: (catererId: string, moduleKey: string) => ['modules', 'history', catererId, moduleKey] as const,
    validationStatus: (catererId: string) => ['modules', 'validation-status', catererId] as const,
    contractReadiness: (catererId: string) => ['modules', 'contract-readiness', catererId] as const,
  },

  modulesRequiredSetup: {
    all: ['modulesRequiredSetup'] as const,
    activeModules: (catererId: string) => ['modulesRequiredSetup', 'active-modules', catererId] as const,
    overview: (catererId: string) => ['modulesRequiredSetup', 'overview', catererId] as const,
    moduleDetail: (catererId: string, moduleKey: string) =>
      ['modulesRequiredSetup', 'module-detail', catererId, moduleKey] as const,
    progress: (catererId: string) => ['modulesRequiredSetup', 'progress', catererId] as const,
    missingItems: (catererId: string, moduleKey?: string) =>
      ['modulesRequiredSetup', 'missing-items', catererId, moduleKey] as const,
  },

  corrections: {
    all: ['corrections'] as const,
    list: (filters?: Record<string, unknown>) => ['corrections', 'list', filters] as const,
    detail: (id: string) => ['corrections', 'detail', id] as const,
    summary: (catererId: string) => ['corrections', 'summary', catererId] as const,
    history: (id: string) => ['corrections', 'history', id] as const,
  },

  validation: {
    all: ['validation'] as const,
    list: (filters?: Record<string, unknown>) => ['validation', 'list', filters] as const,
    detail: (vid: string) => ['validation', 'detail', vid] as const,
    history: (vid: string) => ['validation', 'history', vid] as const,
  },

  golive: {
    all: ['golive'] as const,
    list: (filters?: Record<string, unknown>) => ['golive', 'list', filters] as const,
    overview: (catererId: string) => ['golive', 'overview', catererId] as const,
    blockers: (catererId: string) => ['golive', 'blockers', catererId] as const,
    summary: (catererId: string) => ['golive', 'summary', catererId] as const,
    status: (catererId: string) => ['golive', 'status', catererId] as const,
    checklist: (catererId: string) => ['golive', 'checklist', catererId] as const,
    history: (catererId: string) => ['golive', 'history', catererId] as const,
  },

  ecoloop: {
    all: ['ecoloop'] as const,
    list: (filters?: Record<string, unknown>) => ['ecoloop', 'list', filters] as const,
    byCaterer: (catererId: string, filters?: Record<string, unknown>) =>
      ['ecoloop', 'by-caterer', catererId, filters] as const,
    detail: (conversationId: string) => ['ecoloop', 'detail', conversationId] as const,
    dashboard: ['ecoloop', 'dashboard'] as const,
    history: (conversationId: string) => ['ecoloop', 'history', conversationId] as const,
  },

  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },

  audit: {
    all: ['audit'] as const,
    list: (filters?: Record<string, unknown>) => ['audit', 'list', filters] as const,
  },

  dashboard: {
    all: ['dashboard'] as const,
    stats: ['dashboard', 'stats'] as const,
  },
} as const

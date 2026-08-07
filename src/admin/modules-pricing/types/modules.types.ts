/**
 * Purely UI-layer types for this admin page's own navigation/status
 * chrome — everything about the actual module/pricing/configuration data
 * itself now lives in `src/features/adminModulesPricing/types/modulesPricing.types.ts`,
 * matching the real backend shapes. This file used to also define a mock
 * `CatererSetup`/`ModuleConfig`/etc — removed once every screen was wired
 * to real data (see NOTES.md).
 */
export type ConfigSection =
  | 'dashboard' | 'modules' | 'pricing' | 'founding-partner'
  | 'commercial-terms' | 'operational-rules' | 'effective-dates'
  | 'validation' | 'contract-readiness' | 'audit'

export type ValidationLevel = 'pass' | 'warning' | 'error' | 'pending'

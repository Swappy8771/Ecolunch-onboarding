/**
 * UI-facing types for the Modules, Pricing & Configurations feature.
 * ViewModel/filter shapes only — the raw backend DTO shapes live next to
 * the mapper that produces these, in `../mappers/modulesPricing.mapper.ts`.
 */

/** The fixed 7-item backend catalogue (`modules-pricing.model.ts`'s `MODULE_CATALOGUE`). */
export type ModuleKey =
  | 'school_meals'
  | 'daycare_meals'
  | 'camp_meals'
  | 'reportiq'
  | 'accounting'
  | 'parent_subscriptions'
  | 'css_reporting'

export type ModuleStatus = 'active' | 'inactive' | 'pending'

export interface ModulePricingViewModel {
  monthlyPriceCents: number | null
  setupFeeCents: number | null
  foundingPartnerFree: boolean
  discountPct: number
}

/** The 5 configuration sub-fields `getCatererSetup()` merges in — a subset of the full configuration (see `ModuleConfigurationDetailViewModel`, which also has labelSettings/calendarSettings/accountingMapping). */
export interface ModuleConfigurationSummaryViewModel {
  cutoffRules: Record<string, unknown>
  payoutRules: Record<string, unknown>
  creditRules: Record<string, unknown>
  notificationSettings: Record<string, unknown>
  reportSettings: Record<string, unknown>
}

export interface CatererModuleViewModel {
  key: ModuleKey
  name: string
  moduleId: string
  status: ModuleStatus
  effectiveDate: string | null
  endDate: string | null
  pricing: ModulePricingViewModel
  configuration: ModuleConfigurationSummaryViewModel
  commercialNotes: string | null
  configured: boolean
}

export interface ModuleSetupSummaryViewModel {
  activeCount: number
  monthlyTotalCents: number
  setupFeesTotalCents: number
  modulesConfigured: boolean
  pricingConfigured: boolean
}

export interface CatererModuleSetupViewModel {
  catererId: string
  modules: CatererModuleViewModel[]
  summary: ModuleSetupSummaryViewModel
}

export interface ModuleCommercialTermsViewModel {
  contractStartDate: string | null
  contractTermMonths: number | null
  autoRenewal: boolean
  paymentDaysInAdvance: number | null
  foundingPartnerExpiryDate: string | null
  discountExpiryDate: string | null
  specialTerms: string | null
}

export interface ModulePricingDetailViewModel {
  moduleKey: ModuleKey
  status: ModuleStatus
  pricing: ModulePricingViewModel & { currencyCode: string; pricingApprovedAt: string | null; pricingApprovedBy: string | null }
  commercialTerms: ModuleCommercialTermsViewModel
}

/** The full configuration object (`GET .../configuration`) — a superset of `ModuleConfigurationSummaryViewModel`, includes label/calendar/accounting sub-objects `getCatererSetup()` doesn't merge in. */
export interface ModuleConfigurationDetailViewModel {
  moduleKey: ModuleKey
  cutoffRules: Record<string, unknown>
  payoutRules: Record<string, unknown>
  creditRules: Record<string, unknown>
  notificationSettings: Record<string, unknown>
  reportSettings: Record<string, unknown>
  labelSettings: Record<string, unknown>
  calendarSettings: Record<string, unknown>
  accountingMapping: Record<string, unknown>
}

export interface ModuleHistoryEntryViewModel {
  id: string
  action: string
  actorId: string | null
  createdAt: string
}

export interface ModuleValidationViewModel {
  moduleKey: ModuleKey
  moduleName: string
  isReady: boolean
  blockers: string[]
  warnings: string[]
}

export interface ValidationStatusViewModel {
  catererId: string
  overallReady: boolean
  totalActiveModules: number
  readyModules: number
  moduleValidations: ModuleValidationViewModel[]
  blockers: string[]
  warnings: string[]
}

export interface ContractReadinessViewModel {
  catererId: string
  catererName: string
  mergeFields: Record<string, unknown>
  validationStatus: ValidationStatusViewModel
  readyForContracts: boolean
  moduleGatesComplete: boolean
  blockers: string[]
  warnings: string[]
}

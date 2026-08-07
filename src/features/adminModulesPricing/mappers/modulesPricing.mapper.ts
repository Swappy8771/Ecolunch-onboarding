import type { Mapper } from '@/api/mappers/types'
import type {
  CatererModuleSetupViewModel,
  CatererModuleViewModel,
  ModulePricingDetailViewModel,
  ModuleConfigurationDetailViewModel,
  ModuleHistoryEntryViewModel,
  ValidationStatusViewModel,
  ModuleValidationViewModel,
  ContractReadinessViewModel,
  ModuleKey,
  ModuleStatus,
} from '../types/modulesPricing.types'

/**
 * Hand-authored, not generated — `modules-pricing.service.ts` has no DTO
 * layer; every method returns a raw Mongoose `.lean()` result or a
 * custom-shaped plain object straight through the controller. Matches
 * those shapes field-for-field by hand, same convention already used for
 * Validation Center/Document Vault.
 */

export interface CatererModuleDto {
  key: ModuleKey
  name: string
  type: string
  moduleId: string
  status: ModuleStatus
  effectiveDate: string | null
  endDate: string | null
  pricing: {
    monthlyPriceCents: number | null
    setupFeeCents: number | null
    foundingPartnerFree: boolean
    discountPct: number
  }
  configuration: {
    cutoffRules: Record<string, unknown>
    payoutRules: Record<string, unknown>
    creditRules: Record<string, unknown>
    notificationSettings: Record<string, unknown>
    reportSettings: Record<string, unknown>
  }
  commercialNotes: string | null
  configured: boolean
}

export interface ModuleSetupSummaryDto {
  activeCount: number
  monthlyTotalCents: number
  setupFeesTotalCents: number
  modulesConfigured: boolean
  pricingConfigured: boolean
}

export interface CatererModuleSetupDto {
  catererId: string
  modules: CatererModuleDto[]
  summary: ModuleSetupSummaryDto
}

export const mapCatererModuleToViewModel: Mapper<CatererModuleDto, CatererModuleViewModel> = dto => ({
  key: dto.key,
  name: dto.name,
  moduleId: dto.moduleId,
  status: dto.status,
  effectiveDate: dto.effectiveDate,
  endDate: dto.endDate,
  pricing: dto.pricing,
  configuration: dto.configuration,
  commercialNotes: dto.commercialNotes,
  configured: dto.configured,
})

export const mapCatererModuleSetupToViewModel: Mapper<CatererModuleSetupDto, CatererModuleSetupViewModel> = dto => ({
  catererId: dto.catererId,
  modules: dto.modules.map(mapCatererModuleToViewModel),
  summary: dto.summary,
})

export interface ModulePricingDetailDto {
  moduleKey: ModuleKey
  status: ModuleStatus
  pricing: {
    monthlyPriceCents?: number | null
    setupFeeCents?: number | null
    foundingPartnerFree?: boolean
    discountPct?: number
    currencyCode?: string
    pricingApprovedAt?: string | null
    pricingApprovedBy?: string | null
  }
  commercialTerms: {
    contractStartDate?: string | null
    contractTermMonths?: number | null
    autoRenewal?: boolean
    paymentDaysInAdvance?: number | null
    foundingPartnerExpiryDate?: string | null
    discountExpiryDate?: string | null
    specialTerms?: string | null
  }
}

export const mapModulePricingDetailToViewModel: Mapper<ModulePricingDetailDto, ModulePricingDetailViewModel> = dto => ({
  moduleKey: dto.moduleKey,
  status: dto.status,
  pricing: {
    monthlyPriceCents: dto.pricing.monthlyPriceCents ?? null,
    setupFeeCents: dto.pricing.setupFeeCents ?? null,
    foundingPartnerFree: dto.pricing.foundingPartnerFree ?? false,
    discountPct: dto.pricing.discountPct ?? 0,
    currencyCode: dto.pricing.currencyCode ?? 'CAD',
    pricingApprovedAt: dto.pricing.pricingApprovedAt ?? null,
    pricingApprovedBy: dto.pricing.pricingApprovedBy ?? null,
  },
  commercialTerms: {
    contractStartDate: dto.commercialTerms.contractStartDate ?? null,
    contractTermMonths: dto.commercialTerms.contractTermMonths ?? null,
    autoRenewal: dto.commercialTerms.autoRenewal ?? false,
    paymentDaysInAdvance: dto.commercialTerms.paymentDaysInAdvance ?? null,
    foundingPartnerExpiryDate: dto.commercialTerms.foundingPartnerExpiryDate ?? null,
    discountExpiryDate: dto.commercialTerms.discountExpiryDate ?? null,
    specialTerms: dto.commercialTerms.specialTerms ?? null,
  },
})

export interface ModuleConfigurationDetailDto {
  moduleKey: ModuleKey
  configuration: {
    cutoffRules?: Record<string, unknown>
    payoutRules?: Record<string, unknown>
    creditRules?: Record<string, unknown>
    notificationSettings?: Record<string, unknown>
    reportSettings?: Record<string, unknown>
    labelSettings?: Record<string, unknown>
    calendarSettings?: Record<string, unknown>
    accountingMapping?: Record<string, unknown>
  }
}

export const mapModuleConfigurationDetailToViewModel: Mapper<ModuleConfigurationDetailDto, ModuleConfigurationDetailViewModel> = dto => ({
  moduleKey: dto.moduleKey,
  cutoffRules: dto.configuration.cutoffRules ?? {},
  payoutRules: dto.configuration.payoutRules ?? {},
  creditRules: dto.configuration.creditRules ?? {},
  notificationSettings: dto.configuration.notificationSettings ?? {},
  reportSettings: dto.configuration.reportSettings ?? {},
  labelSettings: dto.configuration.labelSettings ?? {},
  calendarSettings: dto.configuration.calendarSettings ?? {},
  accountingMapping: dto.configuration.accountingMapping ?? {},
})

export interface ModuleHistoryEntryDto {
  _id: string
  action: string
  actorId: string | null
  createdAt: string
}

export const mapModuleHistoryEntryToViewModel: Mapper<ModuleHistoryEntryDto, ModuleHistoryEntryViewModel> = dto => ({
  id: dto._id,
  action: dto.action,
  actorId: dto.actorId,
  createdAt: dto.createdAt,
})

export interface ValidationStatusDto {
  catererId: string
  overallReady: boolean
  totalActiveModules: number
  readyModules: number
  moduleValidations: ModuleValidationViewModel[]
  blockers: string[]
  warnings: string[]
}

export const mapValidationStatusToViewModel: Mapper<ValidationStatusDto, ValidationStatusViewModel> = dto => ({
  catererId: dto.catererId,
  overallReady: dto.overallReady,
  totalActiveModules: dto.totalActiveModules,
  readyModules: dto.readyModules,
  moduleValidations: dto.moduleValidations,
  blockers: dto.blockers,
  warnings: dto.warnings,
})

export interface ContractReadinessDto {
  catererId: string
  catererName: string
  mergeFields: Record<string, unknown>
  validationStatus: ValidationStatusDto
  readyForContracts: boolean
  moduleGatesComplete: boolean
  blockers: string[]
  warnings: string[]
}

export const mapContractReadinessToViewModel: Mapper<ContractReadinessDto, ContractReadinessViewModel> = dto => ({
  catererId: dto.catererId,
  catererName: dto.catererName,
  mergeFields: dto.mergeFields,
  validationStatus: mapValidationStatusToViewModel(dto.validationStatus),
  readyForContracts: dto.readyForContracts,
  moduleGatesComplete: dto.moduleGatesComplete,
  blockers: dto.blockers,
  warnings: dto.warnings,
})

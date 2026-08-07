import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { useApiMutation } from '@/api/hooks/useApi'

/**
 * The 4 write mutations behind every editable screen — activation/dates,
 * pricing, configuration, commercial terms. Every mutation invalidates
 * `queryKeys.modules.all` (not a bare `invalidateQueries()`): a change to
 * any one of these affects the Dashboard summary, the Modules/Pricing/
 * Effective-Dates tables, the Validation screen, and Contract Readiness —
 * all derived from the same `CatererModule` docs — same reasoning as
 * Document Vault's/Caterers' own mutation hooks.
 *
 * Note: the backend also exposes a separate `PATCH .../rules` endpoint
 * (`updateRules`) covering a subset of what `POST .../configuration`
 * already covers (cutoff/payout/credit/notification/report, but not
 * labels/calendar/accounting). Only `saveConfiguration` is wired
 * frontend-side, since it's a strict superset — using both would just be
 * two write paths to the same data with no functional difference.
 */

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.modules.all })
}

export interface ConfigureModuleVariables {
  catererId: string
  moduleKey: string
  status?: 'active' | 'inactive' | 'pending'
  effectiveDate?: string | null
  endDate?: string | null
  monthlyPriceCents?: number | null
  setupFeeCents?: number | null
  foundingPartnerFree?: boolean
  discountPct?: number
  notes?: string | null
}

/** Activate/deactivate a module and/or set its effective/end dates (`PUT .../modules/:moduleKey`). */
export function useConfigureModule() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, ConfigureModuleVariables>({
    mutationFn: ({ catererId, moduleKey, ...body }) => modulesApi.setModule(catererId, moduleKey, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface SavePricingVariables {
  catererId: string
  moduleKey: string
  monthlyPriceCents?: number | null
  setupFeeCents?: number | null
  foundingPartnerFree?: boolean
  discountPct?: number
  currencyCode?: string
}

export function useSavePricing() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SavePricingVariables>({
    mutationFn: ({ catererId, moduleKey, ...body }) => modulesApi.setPricing(catererId, moduleKey, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface SaveConfigurationVariables {
  catererId: string
  moduleKey: string
  cutoffRules?: Record<string, unknown>
  payoutRules?: Record<string, unknown>
  creditRules?: Record<string, unknown>
  notificationSettings?: Record<string, unknown>
  reportSettings?: Record<string, unknown>
  labelSettings?: Record<string, unknown>
  calendarSettings?: Record<string, unknown>
  accountingMapping?: Record<string, unknown>
}

export function useSaveConfiguration() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SaveConfigurationVariables>({
    mutationFn: ({ catererId, moduleKey, ...body }) => modulesApi.setConfiguration(catererId, moduleKey, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export interface SaveCommercialTermsVariables {
  catererId: string
  moduleKey: string
  contractStartDate?: string
  contractTermMonths?: number
  autoRenewal?: boolean
  paymentDaysInAdvance?: number
  foundingPartnerExpiryDate?: string | null
  discountExpiryDate?: string | null
  specialTerms?: string
}

export function useSaveCommercialTerms() {
  const queryClient = useQueryClient()
  return useApiMutation<unknown, SaveCommercialTermsVariables>({
    mutationFn: ({ catererId, moduleKey, ...body }) => modulesApi.setCommercialTerms(catererId, moduleKey, body),
    onSuccess: () => invalidateAll(queryClient),
  })
}

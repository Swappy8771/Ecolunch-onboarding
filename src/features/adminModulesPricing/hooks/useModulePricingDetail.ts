import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapModulePricingDetailToViewModel, type ModulePricingDetailDto } from '../mappers/modulesPricing.mapper'
import type { ModulePricingDetailViewModel } from '../types/modulesPricing.types'

/** Backs the Founding Partner / Commercial Terms screens — the fuller pricing+commercialTerms detail `getCatererSetup()` doesn't carry (currencyCode/approval stamp/expiry dates). Only fetched once a module is selected. */
export function useModulePricingDetail(catererId: string, moduleKey: string, enabled: boolean) {
  return useApiQuery<ModulePricingDetailViewModel>({
    queryKey: queryKeys.modules.pricing(catererId, moduleKey),
    queryFn: async () => {
      const response = (await modulesApi.getPricing(catererId, moduleKey)) as ModulePricingDetailDto
      return mapModulePricingDetailToViewModel(response)
    },
    enabled: enabled && Boolean(moduleKey),
  })
}

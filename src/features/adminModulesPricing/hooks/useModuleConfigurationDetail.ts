import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapModuleConfigurationDetailToViewModel, type ModuleConfigurationDetailDto } from '../mappers/modulesPricing.mapper'
import type { ModuleConfigurationDetailViewModel } from '../types/modulesPricing.types'

/** Backs the Operational Rules screen — the full 8-bucket configuration object (`getCatererSetup()` only merges 5 of them, omitting labelSettings/calendarSettings/accountingMapping). Only fetched once a module is selected. */
export function useModuleConfigurationDetail(catererId: string, moduleKey: string, enabled: boolean) {
  return useApiQuery<ModuleConfigurationDetailViewModel>({
    queryKey: queryKeys.modules.configuration(catererId, moduleKey),
    queryFn: async () => {
      const response = (await modulesApi.getConfiguration(catererId, moduleKey)) as ModuleConfigurationDetailDto
      return mapModuleConfigurationDetailToViewModel(response)
    },
    enabled: enabled && Boolean(moduleKey),
  })
}

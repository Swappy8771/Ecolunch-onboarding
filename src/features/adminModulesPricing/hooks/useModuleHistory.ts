import { queryKeys } from '@/api/queryKeys'
import { modulesApi } from '@/api/modules/modules.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapList } from '@/api/mappers/types'
import { mapModuleHistoryEntryToViewModel, type ModuleHistoryEntryDto } from '../mappers/modulesPricing.mapper'
import type { ModuleHistoryEntryViewModel } from '../types/modulesPricing.types'

interface ModuleHistoryResponseDto {
  moduleKey: string
  history: ModuleHistoryEntryDto[]
}

/** Backs the Audit & History screen — per-module (there's no caterer-wide audit endpoint in this module; a module must be selected first). */
export function useModuleHistory(catererId: string, moduleKey: string, enabled: boolean) {
  return useApiQuery<ModuleHistoryEntryViewModel[]>({
    queryKey: queryKeys.modules.history(catererId, moduleKey),
    queryFn: async () => {
      const response = (await modulesApi.getHistory(catererId, moduleKey)) as ModuleHistoryResponseDto
      return mapList(response.history, mapModuleHistoryEntryToViewModel)
    },
    enabled: enabled && Boolean(moduleKey),
  })
}

import { queryKeys } from '@/api/queryKeys'
import { goliveApi } from '@/api/modules/golive.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapList } from '@/api/mappers/types'
import { mapGoLiveHistoryEntryToViewModel, type GoLiveHistoryEntryDto } from '../mappers/golive.mapper'
import type { GoLiveHistoryEntryViewModel } from '../types/golive.types'

interface GoLiveHistoryResponseDto {
  catererId: string
  catererName: string
  history: GoLiveHistoryEntryDto[]
  totalEvents: number
}

/** Backs the "Recent Activity" panel — only fetched once the detail panel is open (`enabled`). */
export function useGoLiveHistory(catererId: string, enabled: boolean) {
  return useApiQuery<GoLiveHistoryEntryViewModel[]>({
    queryKey: queryKeys.golive.history(catererId),
    queryFn: async () => {
      const response = (await goliveApi.getHistory(catererId)) as GoLiveHistoryResponseDto
      return mapList(response.history, mapGoLiveHistoryEntryToViewModel)
    },
    enabled: enabled && Boolean(catererId),
  })
}

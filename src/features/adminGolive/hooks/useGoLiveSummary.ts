import { queryKeys } from '@/api/queryKeys'
import { goliveApi } from '@/api/modules/golive.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapGoLiveSummaryToViewModel, type GoLiveSummaryDto } from '../mappers/golive.mapper'
import type { GoLiveSummaryViewModel } from '../types/golive.types'

/** Backs the Blockers panel (rich, categorized) — `GET /admin/golive/:catererId/summary`. */
export function useGoLiveSummary(catererId: string, enabled: boolean) {
  return useApiQuery<GoLiveSummaryViewModel>({
    queryKey: queryKeys.golive.summary(catererId),
    queryFn: async () => {
      const response = (await goliveApi.getSummary(catererId)) as GoLiveSummaryDto
      return mapGoLiveSummaryToViewModel(response)
    },
    enabled: enabled && Boolean(catererId),
  })
}

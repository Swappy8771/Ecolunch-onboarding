import { queryKeys } from '@/api/queryKeys'
import { goliveApi } from '@/api/modules/golive.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { mapGoLiveOverviewToViewModel, type GoLiveOverviewDto } from '../mappers/golive.mapper'
import type { GoLiveOverviewViewModel } from '../types/golive.types'

/** Backs the detail panel's Readiness Checklist (the flat 11-item base view) — `GET /admin/golive/:catererId`. */
export function useGoLiveOverview(catererId: string, enabled: boolean) {
  return useApiQuery<GoLiveOverviewViewModel>({
    queryKey: queryKeys.golive.overview(catererId),
    queryFn: async () => {
      const response = (await goliveApi.getOverview(catererId)) as GoLiveOverviewDto
      return mapGoLiveOverviewToViewModel(response)
    },
    enabled: enabled && Boolean(catererId),
  })
}

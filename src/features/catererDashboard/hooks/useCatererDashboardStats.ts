import { queryKeys } from '@/api/queryKeys'
import { catererDashboardApi } from '@/api/modules/caterer-dashboard.api'
import { useApiQuery } from '@/api/hooks/useApi'
import { toCatererDashboardStatsViewModel } from '../mappers/catererDashboard.mapper'
import type { CatererDashboardStatsViewModel } from '../types/catererDashboard.types'

export function useCatererDashboardStats() {
  return useApiQuery<CatererDashboardStatsViewModel>({
    queryKey: queryKeys.catererDashboard.stats,
    queryFn: async () =>
      toCatererDashboardStatsViewModel(
        (await catererDashboardApi.getStats()) as Parameters<typeof toCatererDashboardStatsViewModel>[0],
      ),
  })
}

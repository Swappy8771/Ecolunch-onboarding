import { queryKeys } from '@/api/queryKeys'
import { dashboardApi } from '@/api/modules/dashboard.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'

export interface DashboardStatsViewModel {
  caterersOnboarding: number
  openValidations: number
  ecoloopTickets: number
  blockedGoLives: number
}

/** Hand-authored, not generated — matches `dashboard.dto.ts#DashboardStatsDTO` field-for-field, no mapping needed. */
export const useDashboardStats = createQueryHook(
  () => queryKeys.dashboard.stats,
  async (): Promise<DashboardStatsViewModel> => (await dashboardApi.getStats()) as DashboardStatsViewModel,
)

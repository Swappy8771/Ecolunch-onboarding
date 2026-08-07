import type { CatererDashboardStatsViewModel } from '../types/catererDashboard.types'

export function toCatererDashboardStatsViewModel(dto: CatererDashboardStatsViewModel): CatererDashboardStatsViewModel {
  return { ...dto }
}

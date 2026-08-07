import { queryKeys } from '@/api/queryKeys'
import { catererReportiqSettingsApi } from '@/api/modules/caterer-reportiq-settings.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCatererReportiqSettingsViewModel } from '../mappers/catererReportiqSettings.mapper'
import type { CatererReportiqSettingsViewModel } from '../types/catererReportiqSettings.types'

export const useCatererReportiqSettings = createQueryHook(
  () => queryKeys.catererReportiqSettings.detail,
  async (): Promise<CatererReportiqSettingsViewModel> =>
    toCatererReportiqSettingsViewModel(
      (await catererReportiqSettingsApi.get()) as Parameters<typeof toCatererReportiqSettingsViewModel>[0],
    ),
)

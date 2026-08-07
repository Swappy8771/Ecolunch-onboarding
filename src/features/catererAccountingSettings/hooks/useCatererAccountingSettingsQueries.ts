import { queryKeys } from '@/api/queryKeys'
import { catererAccountingSettingsApi } from '@/api/modules/caterer-accounting-settings.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCatererAccountingSettingsViewModel } from '../mappers/catererAccountingSettings.mapper'
import type { CatererAccountingSettingsViewModel } from '../types/catererAccountingSettings.types'

export const useCatererAccountingSettings = createQueryHook(
  () => queryKeys.catererAccountingSettings.detail,
  async (): Promise<CatererAccountingSettingsViewModel> =>
    toCatererAccountingSettingsViewModel(
      (await catererAccountingSettingsApi.get()) as Parameters<typeof toCatererAccountingSettingsViewModel>[0],
    ),
)

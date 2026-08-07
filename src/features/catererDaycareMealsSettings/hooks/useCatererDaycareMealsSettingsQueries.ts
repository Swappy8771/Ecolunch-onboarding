import { queryKeys } from '@/api/queryKeys'
import { catererDaycareMealsSettingsApi } from '@/api/modules/caterer-daycare-meals-settings.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCatererDaycareMealsSettingsViewModel } from '../mappers/catererDaycareMealsSettings.mapper'
import type { CatererDaycareMealsSettingsViewModel } from '../types/catererDaycareMealsSettings.types'

export const useCatererDaycareMealsSettings = createQueryHook(
  () => queryKeys.catererDaycareMealsSettings.detail,
  async (): Promise<CatererDaycareMealsSettingsViewModel> =>
    toCatererDaycareMealsSettingsViewModel(
      (await catererDaycareMealsSettingsApi.get()) as Parameters<typeof toCatererDaycareMealsSettingsViewModel>[0],
    ),
)

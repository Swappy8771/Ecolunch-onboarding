import { queryKeys } from '@/api/queryKeys'
import { catererCampMealsSettingsApi } from '@/api/modules/caterer-camp-meals-settings.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCatererCampMealsSettingsViewModel } from '../mappers/catererCampMealsSettings.mapper'
import type { CatererCampMealsSettingsViewModel } from '../types/catererCampMealsSettings.types'

export const useCatererCampMealsSettings = createQueryHook(
  () => queryKeys.catererCampMealsSettings.detail,
  async (): Promise<CatererCampMealsSettingsViewModel> =>
    toCatererCampMealsSettingsViewModel(
      (await catererCampMealsSettingsApi.get()) as Parameters<typeof toCatererCampMealsSettingsViewModel>[0],
    ),
)

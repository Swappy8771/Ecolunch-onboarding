import { queryKeys } from '@/api/queryKeys'
import { catererSchoolMealsSettingsApi } from '@/api/modules/caterer-school-meals-settings.api'
import { createQueryHook } from '@/api/hooks/useQueryFactory'
import { toCatererSchoolMealsSettingsViewModel } from '../mappers/catererSchoolMealsSettings.mapper'
import type { CatererSchoolMealsSettingsViewModel } from '../types/catererSchoolMealsSettings.types'

export const useCatererSchoolMealsSettings = createQueryHook(
  () => queryKeys.catererSchoolMealsSettings.detail,
  async (): Promise<CatererSchoolMealsSettingsViewModel> =>
    toCatererSchoolMealsSettingsViewModel(
      (await catererSchoolMealsSettingsApi.get()) as Parameters<typeof toCatererSchoolMealsSettingsViewModel>[0],
    ),
)

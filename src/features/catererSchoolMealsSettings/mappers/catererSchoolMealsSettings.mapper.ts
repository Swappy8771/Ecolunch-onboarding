import type { CatererSchoolMealsSettingsViewModel } from '../types/catererSchoolMealsSettings.types'

/** Hand-authored — `school-meals-settings`'s DTO shape has no OpenAPI response schema, same convention as every other hand-authored mapper this session. */
export function toCatererSchoolMealsSettingsViewModel(dto: CatererSchoolMealsSettingsViewModel): CatererSchoolMealsSettingsViewModel {
  return { ...dto }
}

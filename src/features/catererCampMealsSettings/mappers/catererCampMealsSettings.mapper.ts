import type { CatererCampMealsSettingsViewModel } from '../types/catererCampMealsSettings.types'

/** Hand-authored — `camp-meals-settings`'s DTO shape has no OpenAPI response schema, same convention as every other hand-authored mapper this session. */
export function toCatererCampMealsSettingsViewModel(dto: CatererCampMealsSettingsViewModel): CatererCampMealsSettingsViewModel {
  return { ...dto }
}

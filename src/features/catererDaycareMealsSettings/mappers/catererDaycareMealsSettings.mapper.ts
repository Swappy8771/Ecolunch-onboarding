import type { CatererDaycareMealsSettingsViewModel } from '../types/catererDaycareMealsSettings.types'

/** Hand-authored — `daycare-meals-settings`'s DTO shape has no OpenAPI response schema, same convention as every other hand-authored mapper this session. */
export function toCatererDaycareMealsSettingsViewModel(dto: CatererDaycareMealsSettingsViewModel): CatererDaycareMealsSettingsViewModel {
  return { ...dto }
}
